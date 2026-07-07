import { Ticket, TicketListResponse, ListParams } from "./types";

const BASE_URL = "http://localhost:8000";

// достаём текст ошибки из ответа бэка (поле detail)
async function getError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && data.detail) {
      // detail может быть строкой или массивом (валидация pydantic)
      if (typeof data.detail === "string") return data.detail;
      return JSON.stringify(data.detail);
    }
  } catch (e) {
    // не смогли распарсить
  }
  return "Ошибка запроса (" + res.status + ")";
}

export async function getTickets(params: ListParams): Promise<TicketListResponse> {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.priority) q.set("priority", params.priority);
  if (params.search) q.set("search", params.search);
  if (params.sort_by) q.set("sort_by", params.sort_by);
  if (params.order) q.set("order", params.order);
  if (params.page) q.set("page", String(params.page));
  if (params.page_size) q.set("page_size", String(params.page_size));

  const res = await fetch(BASE_URL + "/tickets?" + q.toString());
  if (!res.ok) {
    throw new Error(await getError(res));
  }
  return res.json();
}

export async function createTicket(data: {
  title: string;
  description: string;
  priority: string;
}): Promise<Ticket> {
  const res = await fetch(BASE_URL + "/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await getError(res));
  }
  return res.json();
}

export async function changeStatus(id: number, status: string): Promise<Ticket> {
  const res = await fetch(BASE_URL + "/tickets/" + id + "/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(await getError(res));
  }
  return res.json();
}

// для админских запросов кидаем Basic Auth
function authHeader(user: string, pass: string): string {
  return "Basic " + btoa(user + ":" + pass);
}

export async function deleteTicket(id: number, user: string, pass: string): Promise<void> {
  const res = await fetch(BASE_URL + "/tickets/" + id, {
    method: "DELETE",
    headers: { Authorization: authHeader(user, pass) },
  });
  if (!res.ok) {
    throw new Error(await getError(res));
  }
}

// проверка кред админа при логине
export async function adminLogin(user: string, pass: string): Promise<boolean> {
  const res = await fetch(BASE_URL + "/admin/me", {
    headers: { Authorization: authHeader(user, pass) },
  });
  return res.ok;
}
