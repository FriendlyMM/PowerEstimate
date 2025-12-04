import { GoogleGenAI } from "@google/genai";
import { SystemConfiguration, UserRequirements } from "../types";

const createClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeSystem = async (
  config: SystemConfiguration,
  requirements: UserRequirements
): Promise<string> => {
  const ai = createClient();
  if (!ai) return "Gemini API key is missing. Unable to generate analysis.";

  const energyInfo = requirements.energyReqKWh 
    ? `Calculated Energy Need: ${requirements.energyReqKWh.toFixed(1)} kWh (based on specific appliance run times)`
    : `Estimated Energy Need: ${(requirements.peakLoadKW * requirements.backupHours).toFixed(1)} kWh`;

  const prompt = `
    You are an expert Solar Energy Consultant. 
    Review the following solar hybrid system configuration for a customer.
    
    Customer Needs:
    - Backup Load to Support: ${requirements.peakLoadKW} kW
    - Desired Backup Time: ${requirements.backupHours} hours
    - ${energyInfo}
    - Grid Connection: ${requirements.gridType}

    Proposed System:
    - Inverters: ${config.inverterCount} x ${config.inverterType.name} (Total: ${config.totalPowerKW.toFixed(1)} kW)
    - Batteries: ${config.batteryCount} x ${config.batteryType.name} (Total: ${config.totalCapacityKWh.toFixed(1)} kWh)
    - Estimated Real Autonomy at full backup load: ${config.estimatedAutonomy.toFixed(1)} hours

    Task:
    Provide a concise, friendly, and professional assessment (max 150 words). 
    1. Confirm if this meets their backup load and time requirements.
    2. Explain practically what appliances they can run during a blackout based on this capacity. Use bullet points.
    3. Give one tip for optimizing this specific setup (e.g., load management).
    
    IMPORTANT LANGUAGE INSTRUCTIONS:
    - The response MUST be in Myanmar (Burmese) language.
    - CRITICAL: You MUST keep all specific Appliance names (e.g., "Air Conditioner", "Fridge", "Water Pump", "TV", "Lights") and Technical terms/units (e.g., "kW", "kWh", "Inverter", "Battery", "Amp-hour") in English. Do NOT translate these specific words into Burmese.
    - Format the response using clear bullet points (•) for lists to improve readability.
    
    Tone: Encouraging, knowledgeable, and clear.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis could not be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, our AI consultant is currently offline. Please try again later.";
  }
};