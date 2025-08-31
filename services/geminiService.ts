import { GoogleGenAI } from "@google/genai";
import type { AspectRatio, ImageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type ImageInput = Pick<ImageData, 'data' | 'mimeType'>;

export const generateVideo = async (
  prompt: string,
  aspectRatio: AspectRatio,
  image: ImageInput | null
): Promise<string> => {
  try {
    console.log("Starting video generation with prompt:", prompt, "and aspect ratio:", aspectRatio);

    const generateVideosParams: {
        model: string;
        prompt: string;
        image?: { imageBytes: string; mimeType: string };
        config: {
            numberOfVideos: number;
            // @ts-ignore
            aspectRatio: AspectRatio;
        }
    } = {
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        // The VEO API documentation is sparse, but aspect ratio is a standard param.
        // We will include it based on common media generation API patterns.
        // @ts-ignore - Assuming aspectRatio is a valid but possibly undocumented parameter for video.
        aspectRatio: aspectRatio,
      }
    };

    if (image) {
        console.log("Including reference image with mime type:", image.mimeType);
        generateVideosParams.image = {
            imageBytes: image.data,
            mimeType: image.mimeType,
        };
    }

    let operation = await ai.models.generateVideos(generateVideosParams);

    console.log("Video generation operation started:", operation.name);

    while (!operation.done) {
      console.log("Polling for video status... Current state:", operation.metadata?.state);
      // Wait for 10 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    console.log("Video generation operation finished.");

    if (operation.error) {
        console.error("Operation failed:", operation.error);
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Could not retrieve video download link from the API response.");
    }
    
    console.log("Fetching video from download link:", downloadLink);

    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Failed to download video file. Status: ${response.statusText}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    console.log("Video successfully downloaded and available at:", videoUrl);
    return videoUrl;

  } catch (error) {
    console.error("An error occurred during video generation:", error);
    if (error instanceof Error) {
        const lowerCaseMessage = error.message.toLowerCase();
        if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('rate limit')) {
            throw new Error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
        }
        if (lowerCaseMessage.includes('quota')) {
            throw new Error("Kuota API telah habis. Silakan periksa langganan Anda.");
        }
        throw new Error(`An error occurred: ${error.message}`);
    }
    throw new Error("An unknown error occurred during video generation.");
  }
};