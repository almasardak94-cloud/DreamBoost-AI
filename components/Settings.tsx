
import React from 'react';
import { GenerationSettings, AspectRatio, ImageSize, VideoResolution } from '../types';

interface SettingsProps {
  settings: GenerationSettings;
  setSettings: (s: GenerationSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const update = (key: keyof GenerationSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const aspectRatios: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9', '2:3', '3:2'];
  const imageSizes: ImageSize[] = ['1K', '2K', '4K'];
  const videoResolutions: VideoResolution[] = ['720p', '1080p'];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2">Platform Settings</h2>
        <p className="text-gray-400">Configure global parameters for DreamBoost AI</p>
      </header>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Intelligence Config</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => update('useThinking', !settings.useThinking)}
            className={`p-6 rounded-2xl border transition-all text-left space-y-2 ${settings.useThinking ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 glass hover:bg-white/5'}`}
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">Deep Thinking Mode</span>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.useThinking ? 'bg-purple-600' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.useThinking ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
            <p className="text-sm text-gray-400">Enables high-budget reasoning (gemini-3-pro-preview) for complex logic and math tasks.</p>
          </button>

          <button 
            onClick={() => update('useSearch', !settings.useSearch)}
            className={`p-6 rounded-2xl border transition-all text-left space-y-2 ${settings.useSearch ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 glass hover:bg-white/5'}`}
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">Search Grounding</span>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.useSearch ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.useSearch ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
            <p className="text-sm text-gray-400">Integrates live Google Search results into responses for real-time accuracy.</p>
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Visual Generation Config</h3>
        
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-400">Global Aspect Ratio</p>
          <div className="flex flex-wrap gap-3">
            {aspectRatios.map(ar => (
              <button
                key={ar}
                onClick={() => update('aspectRatio', ar)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${settings.aspectRatio === ar ? 'bg-white text-black' : 'glass hover:bg-white/10'}`}
              >
                {ar}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-400">Image Studio Quality</p>
            <div className="flex gap-3">
              {imageSizes.map(size => (
                <button
                  key={size}
                  onClick={() => update('imageSize', size)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${settings.imageSize === size ? 'bg-blue-600' : 'glass hover:bg-white/10'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-400">Video Lab Resolution</p>
            <div className="flex gap-3">
              {videoResolutions.map(res => (
                <button
                  key={res}
                  onClick={() => update('videoResolution', res)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${settings.videoResolution === res ? 'bg-purple-600' : 'glass hover:bg-white/10'}`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8 text-center text-xs text-gray-600">
        DreamBoost AI Multi-modal Platform &copy; 2025<br/>
        Running on Gemini 3 Pro and Veo 3.1 Architectures
      </div>
    </div>
  );
};

export default Settings;
