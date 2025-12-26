
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GenerationSettings } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatInterfaceProps {
  settings: GenerationSettings;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !attachedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: attachedImage || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const result = await geminiService.generateText(input, {
        useThinking: settings.useThinking,
        useSearch: settings.useSearch,
        image: attachedImage || undefined,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: result.text,
        sources: result.sources,
        timestamp: Date.now(),
        isThinking: settings.useThinking,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: "I encountered an error processing your request. Please check your API configuration or try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setAttachedImage(readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const base64Audio = await geminiService.textToSpeech(text);
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) { channelData[i] = dataInt16[i] / 32768.0; }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (e) {
      console.error("TTS Error", e);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-xl font-medium">How can DreamBoost help you today?</p>
            <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
              {["Analyze code structure", "Generate a surreal landscape", "Summarize global news", "Write a marketing script"].map(suggestion => (
                <button 
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="glass p-3 rounded-lg text-sm hover:bg-white/10 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'glass'}`}>
              {m.image && (
                <img src={m.image} alt="Input" className="rounded-lg mb-3 max-w-full max-h-64 object-cover" />
              )}
              {m.isThinking && m.role === 'assistant' && (
                <div className="flex items-center text-xs text-blue-400 mb-2 font-semibold uppercase tracking-wider">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2" />
                  Deep Reasoning Applied
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              
              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 mb-2 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Sources:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((source, i) => (
                      <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-blue-400 truncate max-w-[150px]">
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {m.role === 'assistant' && (
                <button 
                  onClick={() => playTTS(m.text)}
                  className="mt-2 p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass p-4 rounded-2xl flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-sm text-gray-400">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 glass m-4 rounded-2xl border border-white/10 sticky bottom-0">
        {attachedImage && (
          <div className="mb-3 relative inline-block">
            <img src={attachedImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-blue-500" />
            <button 
              onClick={() => setAttachedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="flex items-end space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type a message or command (/code, /help)..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3"
            rows={1}
          />
          
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className={`p-3 rounded-xl transition-all ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
          <div className="flex items-center space-x-4">
            <span className={settings.useSearch ? 'text-blue-400' : ''}>
              Search: {settings.useSearch ? 'ON' : 'OFF'}
            </span>
            <span className={settings.useThinking ? 'text-purple-400' : ''}>
              Thinking: {settings.useThinking ? 'ON' : 'OFF'}
            </span>
          </div>
          <span>DreamBoost v3.1 Multimodal</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
