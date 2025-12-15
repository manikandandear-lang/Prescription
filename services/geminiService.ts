import { GoogleGenAI, Type } from "@google/genai";
import { PrescriptionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePrescription = async (base64Image: string, mimeType: string): Promise<PrescriptionData> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Analyze the attached image. Is it a medical prescription? 
    If yes, extract the details into the structured JSON format provided.
    Extract the doctor's details, patient's details, diagnosis, date, and a list of medications including their dosage, frequency, and specific instructions.
    If handwriting is difficult to read, make a best educated guess based on medical context.
    If the image is NOT a medical prescription, set 'isPrescription' to false and leave other fields empty or default.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPrescription: { type: Type.BOOLEAN, description: "True if the image is a medical prescription." },
            date: { type: Type.STRING, description: "Date of the prescription." },
            diagnosis: { type: Type.STRING, description: "Diagnosed condition or reason for visit." },
            generalAdvice: { type: Type.STRING, description: "Any general lifestyle or dietary advice mentioned." },
            followUpDate: { type: Type.STRING, description: "Date for the next visit." },
            doctor: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                specialty: { type: Type.STRING },
                licenseNumber: { type: Type.STRING },
                hospital: { type: Type.STRING },
                contact: { type: Type.STRING }
              }
            },
            patient: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                age: { type: Type.STRING },
                gender: { type: Type.STRING },
                weight: { type: Type.STRING }
              }
            },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING, description: "e.g., 500mg, 10ml" },
                  frequency: { type: Type.STRING, description: "e.g., Twice daily, every 8 hours" },
                  duration: { type: Type.STRING, description: "e.g., 5 days" },
                  instructions: { type: Type.STRING, description: "e.g., After food, before sleep" },
                  type: { type: Type.STRING, description: "e.g., Tablet, Syrup, Capsule" }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini.");
    }

    return JSON.parse(text) as PrescriptionData;

  } catch (error) {
    console.error("Error analyzing prescription:", error);
    throw error;
  }
};
