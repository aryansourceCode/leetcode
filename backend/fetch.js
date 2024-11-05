const express = require('express');
const axios = require('axios');
const router = express.Router();
const NodeCache = require('node-cache');

// Cache instance with 1-hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// LeetCode GraphQL endpoint
const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

// GraphQL queries
const questionQuery = `
query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        questionId
        title
        difficulty
        content
        exampleTestcases
        sampleTestCase
        metaData
        hints
        stats
        similarQuestions
        topicTags {
            name
        }
    }
}`;

const questionsListQuery = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
    ) {
        total: totalNum
        questions: data {
            questionId
            title
            titleSlug
            difficulty
            topicTags {
                name
            }
        }
    }
}`;

// Helper function to fetch data from LeetCode API
async function fetchFromLeetCode(query, variables) {
    try {
        const response = await axios.post(LEETCODE_API_ENDPOINT, {
            query,
            variables
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('LeetCode API Error:', error.message);
        throw new Error('Failed to fetch data from LeetCode');
    }
}

// Extract main description before examples
function extractDescription(content) {
    const exampleIndex = content.indexOf('<strong class="example">');
    const descriptionText = exampleIndex !== -1 ? content.slice(0, exampleIndex) : content;
    return descriptionText.replace(/<\/?[^>]+(>|$)/g, '').trim(); // Clean HTML tags
}

// Extract test cases from the description
function extractTestCasesFromDescription(description) {
    const inputOutputPattern = /<strong>Input:<\/strong>\s*(.*?)\s*<strong>Output:<\/strong>\s*(.*?)<\/pre>/gs;
    const matches = [...description.matchAll(inputOutputPattern)];

    const testCases = matches.map((match, index) => {
        const input = match[1].replace(/<\/?[^>]+(>|$)/g, '').trim();  // Remove HTML tags
        const output = match[2].replace(/<\/?[^>]+(>|$)/g, '').trim(); // Remove HTML tags
        return {
            id: index + 1,
            input,
            expectedOutput: output
        };
    });

    return testCases;
}

// Endpoint to list questions with pagination and filters
router.get('/questions', async (req, res) => {
    try {
        const { difficulty, tags, page = 1, limit = 100 } = req.query;
        const skip = (page - 1) * limit;

        const cacheKey = `questions-${difficulty}-${tags}-${page}-${limit}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const filters = {
            difficulty: difficulty?.toUpperCase(),
            tags: tags ? tags.split(',') : undefined
        };

        const data = await fetchFromLeetCode(questionsListQuery, {
            categorySlug: "",
            limit: parseInt(limit),
            skip,
            filters
        });

        const result = {
            success: true,
            total: data.problemsetQuestionList.total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: data.problemsetQuestionList.questions
        };

        cache.set(cacheKey, result);
        res.json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint to get specific question details with parsed test cases
router.get('/questions/:titleSlug', async (req, res) => {
    try {
        const { titleSlug } = req.params;
        const cacheKey = `question-${titleSlug}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await fetchFromLeetCode(questionQuery, { titleSlug });

        if (!data.question) {
            return res.status(404).json({
                success: false,
                error: 'Question not found'
            });
        }

        const {
            questionId,
            title,
            difficulty,
            content,
            hints,
            topicTags
        } = data.question;

        // Extract description and test cases separately
        const description = extractDescription(content);
        const testCases = extractTestCasesFromDescription(content);

        const result = {
            success: true,
            data: {
                questionId,
                title,
                difficulty,
                description,
                hints,
                topics: topicTags.map(tag => tag.name),
                testCases
            }
        };

        cache.set(cacheKey, result);
        res.json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
