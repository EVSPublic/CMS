export interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  userId: string;
  userName: string;
  resourceType?: string;
  resourceId?: string;
  brandId?: number;
  brandName?: string;
  level: 'info' | 'warning' | 'error' | 'success';
  metadata?: Record<string, any>;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type LogAction =
  | 'user_login'
  | 'user_logout'
  | 'content_save'
  | 'content_publish'
  | 'content_unpublish'
  | 'image_upload'
  | 'image_delete'
  | 'brand_switch'
  | 'user_create'
  | 'user_update'
  | 'user_delete'
  | 'page_view'
  | 'export_data'
  | 'settings_change'
  | 'media_upload'
  | 'media_update'
  | 'media_delete'
  | 'folder_create'
  | 'folder_update'
  | 'folder_delete'
  | 'static_page_create'
  | 'static_page_update'
  | 'static_page_delete'
  | 'static_page_publish'
  | 'announcement_create'
  | 'announcement_update'
  | 'announcement_delete'
  | 'announcement_publish'
  | 'partner_create'
  | 'partner_update'
  | 'partner_delete'
  | 'partner_reorder'
  | 'partner_toggle_status'
  | 'station_create'
  | 'station_update'
  | 'station_delete'
  | 'charger_status_update';