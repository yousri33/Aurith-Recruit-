import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Common AI functions for HR Recruit
 */

export async function analyzeCV(
  cvText: string, 
  jobDescription: string, 
  skills: string[] = [], 
  years: number = 0
) {
  if (!apiKey) {
    console.error("GOOGLE_AI_API_KEY is not set.");
    return null;
  }

  const prompt = `
    Job Description: ${jobDescription}
    Target Required Skills: ${skills.join(', ') || 'Not specified'}
    Target Years of Experience: ${years || 'Any'}
    
    CV Content (Raw Text):
    ${cvText}
    
    CRITICAL INSTRUCTION:
    The "justification" MUST be a professional, data-backed explanation of why this candidate SPECIFICALLY fits the requirements mentioned in the Job Description. 
    - Mention which specific skills from the Job Description they possess.
    - Mention how their years of experience align with the needs.
    - If they fall short, mention the risk but highlight the most valuable overlap.
    - Avoid generic praise. Be technical and precise.

    Return ONLY a JSON response:
    {
      "score": number (0-100),
      "name": "Full Name",
      "email": "Email",
      "phone": "Phone number",
      "university": "University name",
      "major": "Degree/Major",
      "position": "Extracted current title",
      "skills": ["skill1", "skill2"],
      "gaps": ["missing skill A", "missing experience B"],
      "experience": [{"role": "Role", "years": X}],
      "justification": "Strict, job-aligned justification of why this profile matches the specific Job Description provided above.",
      "analysis": "A brief technical/qualitative strategic analysis of their potential growth and fit for this specific company/role.",
      "summary": "Short recommendation"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from the AI response
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      return JSON.parse(text.substring(jsonStart, jsonEnd));
    } catch (e) {
      return { raw: text };
    }
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
}

export async function extractFromCV(base64Data: string, mimeType: string = "application/pdf", retries: number = 2) {
  if (!apiKey) {
    console.error("GOOGLE_AI_API_KEY is not set.");
    return null;
  }

  const prompt = `
    Analyze this CV/Resume document and extract the following information.
    Be extremely thorough. If a field is not found, use an empty string or empty array.
    
    Return ONLY a valid JSON object with:
    {
      "name": "Full Name",
      "email": "extracted email address",
      "phone": "extracted phone number",
      "university": "University or school name",
      "major": "Field of study or specific degree",
      "position": "Extracted current job title or position",
      "skills": ["Skill 1", "Skill 2", ...],
      "education": ["Full list of educational entries", ...],
      "experience": [{"role": "Role Name", "company": "Company Name", "years": number_of_years}],
      "raw_text": "The full plain-text content of the CV"
    }
    
    Make sure the "raw_text" property contains the entire textual content of the resume for our indexing.
  `;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      { text: prompt }
    ]);

    const response = await result.response;
    const responseText = response.text();
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const aiData = JSON.parse(responseText.substring(jsonStart, jsonEnd));
    
    // Safety fallback for raw_text if AI forgot it
    if (!aiData.raw_text) {
      aiData.raw_text = "Analysis complete. Data extracted successfully.";
    }
    
    return aiData;
  } catch (error: any) {
    if (error.status === 429 && retries > 0) {
      console.warn("Rate limited. Retrying after delay...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return extractFromCV(base64Data, mimeType, retries - 1);
    }
    console.error("AI Extraction Error:", error);
    return null;
  }
}
