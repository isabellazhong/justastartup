export interface SlideContext {
    /**
     * Interface for context for the prompt 
     */
    name: string, 
    description: string,
    statstics: Map<String, number> 
    sucessPlan: string
}

export function slide_text_prompt(context: SlideContext) {
    /**
     * Formats the prompt to create text for the pitch deck 
     */
    return `
        <role>
            You are a professional in making a pitch for a business idea.
        <role/> 

        <goal>
            Generate a pitch deck that to prompte the following business: ${context.toString()}
            Format the text as so: 
                Slide 1: The title of the business and an breif description of what it is 
                Slide 2: The goal of the business and what problem it is trying to solve
                Slide 3: The product itself 
                Slide 4: Real life application examples 
                Slide 5: Financial implications and projections 
                Slide 6: Marketing plan
                Slide 7: Competition and how you are unique compared to them 
                Slide 8: Conclusion and thank you 
        <goal/>

        <sucess_criteria>
            - Keep the text concise and straight to the point 
            - Seperate text blocks with \\n
        <sucess_criteria/>

        <output>
            Return a JSON Object in the format: 
            {
                <slide_number>: <text_for_the_slide> 
            }
            Please do NOT include any preamble or postamble in your response. 
        <output/> 
    `
}