const express = require('express');
const router = express.Router();
const { knowledgeBase } = require('../services/chatbotService');

// Get knowledge base categories (for admin or analytics)
router.get('/knowledge/categories', (req, res) => {
  try {
    const categories = Object.keys(knowledgeBase).filter(key => key !== 'greetings');
    res.json({
      categories: categories.map(cat => ({
        name: cat,
        keywords: knowledgeBase[cat].keywords || [],
        hasResponse: !!knowledgeBase[cat].response,
      })),
    });
  } catch (error) {
    console.error('Get knowledge categories error:', error);
    res.status(500).json({ error: 'Failed to get knowledge categories' });
  }
});

// Search knowledge base (for admin or enhanced search)
router.post('/knowledge/search', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const lowerQuery = query.toLowerCase();
    const matches = [];
    
    Object.keys(knowledgeBase).forEach(key => {
      if (key === 'greetings') return;
      
      const category = knowledgeBase[key];
      if (category.keywords) {
        const matchingKeywords = category.keywords.filter(k => lowerQuery.includes(k));
        if (matchingKeywords.length > 0) {
          matches.push({
            category: key,
            keywords: matchingKeywords,
            relevance: matchingKeywords.length,
          });
        }
      }
    });
    
    // Sort by relevance
    matches.sort((a, b) => b.relevance - a.relevance);
    
    res.json({
      query,
      matches: matches.slice(0, 5), // Top 5 matches
    });
  } catch (error) {
    console.error('Knowledge search error:', error);
    res.status(500).json({ error: 'Failed to search knowledge base' });
  }
});

module.exports = router;





