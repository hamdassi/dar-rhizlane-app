
import { GoogleGenAI, Type } from "@google/genai";
import type { HotelData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    kpis: {
      type: Type.OBJECT,
      properties: {
        totalRevenue: { type: Type.STRING, description: "Total revenue formatted as a currency string, e.g., '€1,234,567.89'." },
        occupancyRate: { type: Type.STRING, description: "Overall occupancy rate as a percentage string, e.g., '85.2%'." },
        averageDailyRate: { type: Type.STRING, description: "Average daily rate (ADR) formatted as a currency string, e.g., '€250.75'." },
        analysisPeriod: { type: Type.STRING, description: "The time period covered by the report, e.g., 'June 2024' or 'Q2 2024'." },
      },
      required: ["totalRevenue", "occupancyRate", "averageDailyRate", "analysisPeriod"],
    },
    revenueDistribution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Source of revenue (e.g., 'Rooms', 'F&B', 'Spa')." },
          value: { type: Type.NUMBER, description: "Revenue amount for this source." },
        },
        required: ["name", "value"],
      },
    },
    occupancyEvolution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date or time point (e.g., 'Week 1', 'June 1')." },
          rate: { type: Type.NUMBER, description: "Occupancy rate at that point (e.g., 75.5 for 75.5%)." },
        },
        required: ["date", "rate"],
      },
    },
    adrByCategory: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Room category name (e.g., 'Standard Room', 'Suite')." },
          adr: { type: Type.NUMBER, description: "ADR for this category." },
        },
        required: ["category", "adr"],
      },
    },
    roomsSoldByCategory: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING, description: "Room category name." },
                roomsSold: { type: Type.NUMBER, description: "Number of rooms sold for this category." },
            },
            required: ["category", "roomsSold"],
        },
    },
    detailedData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Room category name." },
          roomsSold: { type: Type.NUMBER, description: "Number of rooms sold." },
          adr: { type: Type.NUMBER, description: "Average Daily Rate for the category." },
          revenue: { type: Type.NUMBER, description: "Total revenue for the category." },
        },
        required: ["category", "roomsSold", "adr", "revenue"],
      },
    },
  },
  required: ["kpis", "revenueDistribution", "occupancyEvolution", "adrByCategory", "roomsSoldByCategory", "detailedData"],
};

export const extractDataFromPdf = async (base64Pdf: string, mimeType: string): Promise<HotelData> => {
  const prompt = `You are an expert hotel data analyst for Dar Rhizlane, a luxury hotel in Marrakech. 
  Analyze the provided PDF document which contains hotel performance statistics. 
  Extract the key data points and return them as a JSON object that strictly adheres to the provided schema. 
  The data includes total revenue, occupancy rate, average daily rate (ADR), the analysis period, a breakdown of revenue by source, occupancy evolution over time, ADR by room category, and a detailed table of room sales.
  Calculate totals and averages where necessary if they are not explicitly stated in the document. Double-check all calculations, such as revenue totals and averages, to ensure their accuracy.
  Ensure all monetary values are represented as numbers, and formatted strings for KPIs are clear and professional.`;
  
  const pdfPart = {
    inlineData: {
      data: base64Pdf,
      mimeType: mimeType,
    },
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, pdfPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed data looks like HotelData
    if (!parsedData.kpis || !parsedData.detailedData) {
        throw new Error("Extracted data is missing required fields.");
    }

    return parsedData as HotelData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model could not process the document. Please ensure it's a valid statistics report and try again.");
  }
};