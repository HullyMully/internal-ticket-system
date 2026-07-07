export type Status = "new" | "in_progress" | "done";
export type Priority = "low" | "normal" | "high";

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
  page: number;
  page_size: number;
}

// параметры для списка
export interface ListParams {
  status?: string;
  priority?: string;
  search?: string;
  sort_by?: string;
  order?: string;
  page?: number;
  page_size?: number;
}
