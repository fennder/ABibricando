import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a child-friendly story segment for a specific bible topic.
 */
export const generateStory = async (title: string, context: string): Promise<string> => {
  try {
    const prompt = `
      Escreva um parágrafo curto, rimado e muito alegre para uma criança de 5 anos sobre esta história da Bíblia: "${title}".
      O contexto é: ${context}.
      Use emojis. Seja entusiástico e educativo!
      O idioma deve ser Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING }
          },
          required: ["story"]
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json.story || "Algo mágico aconteceu nesta história!";
  } catch (error) {
    console.error("Error generating story:", error);
    return `Nesta parte da história, Deus fez algo incrível! (Erro ao conectar com a IA)`;
  }
};

/**
 * Generates an image representing the story topic.
 */
export const generateStoryImage = async (title: string, context: string): Promise<string | null> => {
  try {
    const prompt = `Cute, vibrant, 3d render, cartoon style illustration for children bible story. Story Topic: ${title}. Context: ${context}. Bright colors, soft lighting, magical atmosphere. High quality.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
