
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
    uri?: string;
    title?: string;
  };
}

export interface AIResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface AppState {
  activeStopIndex: number;
  isTestMode: boolean;
  userLocation: { lat: number; lng: number } | null;
}
