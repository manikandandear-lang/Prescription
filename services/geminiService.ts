import { GoogleGenAI, Type } from "@google/genai";
import { PrescriptionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePrescription = async (base64Image: string, mimeType: string): Promise<PrescriptionData> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Analyze the attached image. Is it a medical prescription? 
    If yes, extract the details into the structured JSON format provided.
    
    CRITICAL: The user requires the MEDICATION DETAILS (Dosage, Frequency, etc.) to be in TAMIL language.
    
    For the 'medications' list, strictly follow these translation rules:
    1. 'name': Keep the BRAND name in ENGLISH (as it appears on the paper).
    2. 'genericName': Extract the GENERIC/SCIENTIFIC name in ENGLISH (e.g., if 'Dolo' is written, infer 'Paracetamol'). This is for image search purposes.
    3. 'dosage': Translate units to Tamil (e.g., "500 mg" -> "500 மி.கி", "10 ml" -> "10 மி.லி").
    4. 'frequency': Translate into clear Tamil (e.g., "Twice a day" -> "தினமும் இரு முறை", "Morning/Night" -> "காலை / இரவு").
    5. 'duration': Translate to Tamil (e.g., "5 days" -> "5 நாட்கள்").
    6. 'instructions': Translate specific instructions to Tamil (e.g., "After food" -> "உணவுக்குப் பின்").
    7. 'type': Translate to Tamil (e.g., "Tablet" -> "மாத்திரை", "Syrup" -> "சிரப்").

    Extract the doctor's details and patient's details in English (or as they appear).
    Diagnosis and General Advice can be in English.
    
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
                  genericName: { type: Type.STRING, description: "Scientific name in English for image search" },
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