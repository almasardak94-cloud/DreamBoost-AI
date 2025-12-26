
import React, { useState } from 'react';
import { GenerationSettings } from '../types';
import { geminiService } from '../services/geminiService';

interface VideoStudioProps {
  settings: GenerationSettings;
}

const VideoStudio: React.FC<VideoStudioProps> = ({ settings }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() && !sourceImage) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setLoadingStep("Initializing Veo 3.1 Neural Engine...");
    
    try {
      const interval = setInterval(() => {
        const steps = [
          "Analyzing temporal consistency...",
          "Mapping latent vectors...",
          "Synthesizing high-res frames...",
          "Applying fluid motion physics...",
          "Refining cinematic quality..."
        ];
        setLoadingStep(steps[Math.floor(Math.random() * steps.length)]);
      }, 8000);

      const url = await geminiService.generateVideo(prompt, {
        aspectRatio: settings.aspectRatio,
        resolution: settings.videoResolution,
        image: sourceImage || undefined
      });
      
      clearInterval(interval);
      setVideoUrl(url);
    } catch (error) {
      console.error(error);
      alert("Video generation failed. Please ensure your API key supports Veo models.");
    } finally {
      setIsGenerating(false);
      setLoadingStep("");
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
    <div className="p-6 h-full overflow-y-auto space-y-8 max-w-6xl mx-auto">
      <header className="text-center space-y-2">
        <h2 className="text-4xl font-black gradient-text">Veo Cinematic Lab</h2>
        <p className="text-gray-400">Generate professional-grade video from text and images</p>
      </header>

      <div className="glass p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold mb-2 block uppercase tracking-wider text-blue-400">Prompt</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 h-40 focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                placeholder="A futuristic cyber-city with neon rain reflecting on chrome streets, cinematic camera sweep..."
              />
            </label>
            <div className="flex items-center space-x-4">
               <div className="flex-1">
                 <span className="text-xs text-gray-500 mb-1 block">Aspect Ratio</span>
                 <div className="glass p-2 rounded-lg text-center font-bold">{settings.aspectRatio}</div>
               </div>
               <div className="flex-1">
                 <span className="text-xs text-gray-500 mb-1 block">Resolution</span>
                 <div className="glass p-2 rounded-lg text-center font-bold">{settings.videoResolution}</div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-sm font-semibold mb-2 block uppercase tracking-wider text-blue-400">Initial Frame (Optional)</span>
            <div 
              className={`aspect-video border-2 border-dashed ${sourceImage ? 'border-blue-500' : 'border-white/10'} rounded-2xl overflow-hidden relative group cursor-pointer`}
              onClick={() => document.getElementById('video-source-upload')?.click()}
            >
              <input type="file" id="video-source-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
              {sourceImage ? (
                <>
                  <img src={sourceImage} className="w-full h-full object-cover" alt="Source" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-semibold">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p>Upload a starting photo</p>
                </div>
              )}
            </div>
            {sourceImage && (
              <button onClick={() => setSourceImage(null)} className="text-xs text-red-400 hover:underline">Remove source image</button>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-2xl font-bold text-xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating ({loadingStep})</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
              <span>Create Cinematic Video</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-12 space-y-6">
        <h3 className="text-2xl font-bold">Latest Creation</h3>
        {videoUrl ? (
          <div className="glass rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video max-w-4xl mx-auto border border-white/10">
            <video src={videoUrl} controls autoPlay loop className="w-full h-full" />
            <div className="p-4 bg-white/5 flex justify-between items-center">
              <span className="text-sm text-gray-400 italic">Generated using Veo 3.1 Neural Engine</span>
              <a href={videoUrl} download="dreamboost-video.mp4" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Download MP4
              </a>
            </div>
          </div>
        ) : (
          <div className="aspect-video glass rounded-3xl flex flex-col items-center justify-center opacity-40 border-dashed border-2 border-white/10">
            <svg className="w-20 h-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" /></svg>
            <p className="text-xl">No generation yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStudio;
