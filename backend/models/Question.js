// models/Question.js
const mongoose = require('mongoose');

// Define the TopicTag schema
const topicTagSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Define the Question schema
const questionSchema = new mongoose.Schema({
    questionId: { type: String, required: true }, // Question ID as String
    title: { type: String, required: true }, // Question Title
    titleSlug: { type: String, required: true, unique: true }, // Title slug (unique)
    difficulty: { type: String, required: true }, // Difficulty level
    topicTags: { type: [topicTagSchema], required: true } // Array of topic tags
});

// Create the Question model
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
