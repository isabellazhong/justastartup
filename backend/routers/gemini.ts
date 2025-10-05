import { Router, Request, Response } from 'express';
import gemini from '../llm/gemini.js';

const router = Router();

/**
 * @route GET /api/gemini/related-words
 * @desc Get exactly 3 words closely related to a business proposal based on product name and idea
 * @access Public
 */
router.get('/related-words', async (req: Request, res: Response) => {
    try {
        const { name, idea } = req.query;
        
        if (!name || !idea) {
            return res.status(400).json({
                success: false,
                message: 'Both name and idea parameters are required'
            });
        }
        
        const prompt = `
        Given a product name "${name}" and business idea "${idea}", 
        provide exactly 3 single words that are most closely related to this business proposal.
        These should be keywords that capture the essence of the product and idea.
        Return ONLY these 3 words separated by commas, with no additional text, explanation, or formatting.
        Example output format: "word1,word2,word3"
        `;
        
        const response = await gemini.ask(prompt);
        
        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate related words'
            });
        }
        
        // Clean up any potential extra whitespace or line breaks
        const cleanResponse = response.trim().replace(/\s+/g, ' ');
        
        res.json({
            success: true,
            relatedWords: cleanResponse
        });
    } catch (error) {
        console.error('Error generating related words:', error);
        
        // Handle specific error types
        if (error instanceof Error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        
        // Generic error handler
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while generating related words'
        });
    }
});

export default router;