export interface MaQueueItem {
  queue_item_id: string;
  media_title: string;
  media_album_name?: string;
  media_artist?: string;
  media_content_id?: string;
  media_image?: string;
}

export type MaQueueResponse = MaQueueItem[];
