
export type AppView = 'chat' | 'images' | 'videos' | 'code' | 'settings';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string;
  videoUri?: string;
  audioUri?: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
  isThinking?: boolean;
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9' | '2:3' | '3:2';
export type ImageSize = '1K' | '2K' | '4K';
export type VideoResolution = '720p' | '1080p';

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  videoResolution: VideoResolution;
  useThinking: boolean;
  useSearch: boolean;
}
