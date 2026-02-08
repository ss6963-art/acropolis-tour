
export interface TourStop {
  id: string;
  time: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export interface AIResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface AppState {
  currentStopIndex: number;
  isTourStarted: boolean;
  messages: Array<{ role: 'user' | 'assistant'; text: string; links?: GroundingChunk[] }>;
  isLoading: boolean;
}
