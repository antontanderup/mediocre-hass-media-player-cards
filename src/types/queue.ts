export type QueueItem = {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  artworkUrl?: string;
  playlistIndex: number;
  isPlaying: boolean;
  isFirst: boolean;
  isLast: boolean;
  moveItem?: (toIndex: number) => Promise<void>;
  moveItemUp?: () => Promise<void>;
  moveItemDown?: () => Promise<void>;
  skipToItem: () => Promise<void>;
  deleteItem: () => Promise<void>;
};
