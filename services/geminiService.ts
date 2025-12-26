
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AspectRatio, ImageSize, VideoResolution } from "../types";

// Note: process.env.API_KEY is handled by the platform environment.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * General Text Chat with optional Search Grounding and Thinking Mode
   */
  async generateText(prompt: string, config: { 
    useThinking?: boolean, 
    useSearch?: boolean,
    image?: string 
  }) {
    const ai = getAI();
    const modelName = config.useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    const contents: any[] = [];
    if (config.image) {
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: config.image.split(',')[1]
        }
      });
    }
    contents.push({ text: prompt });

    const generationConfig: any = {
      temperature: 0.7,
    };

    if (config.useThinking) {
      generationConfig.thinkingConfig = { thinkingBudget: 32768 };
    }

    const tools: any[] = [];
    if (config.useSearch) {
      tools.push({ googleSearch: {} });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: contents },
      config: {
        ...generationConfig,
        tools: tools.length > 0 ? tools : undefined,
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })).filter((s: any) => s.uri !== '#') || [];

    return {
      text: response.text || '',
      sources
    };
  },

  /**
   * High-Quality Image Generation (Gemini 3 Pro Image)
   */
  async generateImage(prompt: string, settings: { aspectRatio: AspectRatio, imageSize: ImageSize }) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio,
          imageSize: settings.imageSize
        }
      }
    });

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return imageUrl;
  },

  /**
   * Edit Image using Gemini 2.5 Flash Image
   */
  async editImage(base64Image: string, prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
    });

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return imageUrl;
  },

  /**
   * Video Generation (Veo 3.1)
   */
  async generateVideo(prompt: string, settings: { aspectRatio: AspectRatio, resolution: VideoResolution, image?: string }) {
    const ai = getAI();
    const payload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: settings.resolution,
        aspectRatio: settings.aspectRatio,
      }
    };

    if (settings.image) {
      payload.image = {
        imageBytes: settings.image.split(',')[1],
        mimeType: 'image/png'
      };
    }

    let operation = await ai.models.generateVideos(payload);
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  /**
   * Text-to-Speech Generation
   */
  async textToSpeech(text: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio generation failed");
    return base64Audio;
  }
};
