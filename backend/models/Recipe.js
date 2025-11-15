const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    prepTime: { type: String, required: true },
    servings: { type: String, required: true },
    description: String,
    image: { type: String, default: '' },
    ingredients: [{ name: String, quantity: String }],
    steps: [{ step: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recipe', recipeSchema);