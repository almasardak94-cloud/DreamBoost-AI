
import React, { useState } from 'react';
import { GenerationSettings } from '../types';
import { geminiService } from '../services/geminiService';

interface ImageLabProps {
  settings: GenerationSettings;
}

const ImageLab: React.FC<ImageLabProps> = ({ settings }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      let url = '';
      if (sourceImage) {
        // Use Image Editing (Gemini 2.5 Flash Image)
        url = await geminiService.editImage(sourceImage, prompt);
      } else {
        // Use Generation (Gemini 3 Pro Image)
        url = await geminiService.generateImage(prompt, {
          aspectRatio: settings.aspectRatio,
          imageSize: settings.imageSize
        });
      }
      setGeneratedImages(prev => [url, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => setSourceImage(re.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Image Studio</h2>
          <p className="text-gray-400">High-fidelity visual generation and AI editing</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="font-semibold text-lg">Creation Mode</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-400 mb-2 block">Prompt</span>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Describe your vision or an edit instruction..."
                />
              </label>

              <div>
                <span className="text-sm text-gray-400 mb-2 block">Source Image (for editing)</span>
                <div className={`border-2 border-dashed ${sourceImage ? 'border-blue-500' : 'border-white/10'} rounded-xl p-4 text-center cursor-pointer hover:bg-white/5 transition-colors`}
                     onClick={() => document.getElementById('image-upload')?.click()}>
                  <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  {sourceImage ? (
                    <img src={sourceImage} className="max-h-32 mx-auto rounded-lg" alt="Source" />
                  ) : (
                    <div className="py-4">
                      <svg className="w-8 h-8 mx-auto text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-xs text-gray-500">Click to upload source image</p>
                    </div>
                  )}
                </div>
                {sourceImage && (
                  <button onClick={() => setSourceImage(null)} className="text-xs text-red-400 mt-2">Clear Source</button>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>{sourceImage ? 'Edit with Flash' : 'Generate with Pro'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="font-semibold text-lg mb-4">Specs</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Aspect Ratio</p>
                <p className="font-medium">{settings.aspectRatio}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-gray-500 text-xs">Resolution</p>
                <p className="font-medium">{settings.imageSize}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isGenerating && (
              <div className="aspect-square glass rounded-2xl flex items-center justify-center animate-pulse">
                <p className="text-gray-500 italic">Visualizing concepts...</p>
              </div>
            )}
            {generatedImages.map((img, i) => (
              <div key={i} className="group relative aspect-square glass rounded-2xl overflow-hidden shadow-2xl">
                <img src={img} className="w-full h-full object-cover" alt="Generated" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <a href={img} download={`dream-boost-${i}.png`} className="p-2 bg-blue-600 rounded-full hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                </div>
              </div>
            ))}
            {generatedImages.length === 0 && !isGenerating && (
              <div className="col-span-2 aspect-video glass rounded-3xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center opacity-30">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-lg">Your generated masterpiece will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLab;
