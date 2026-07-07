import { Ticket, Status } from "../types";

interface Props {
  tickets: Ticket[];
  isAdmin: boolean;
  onChangeStatus: (id: number, status: Status) => void;
  onDelete: (id: number) => void;
}

// форматируем дату попроще
function fmtDate(s: string): string {
  const d = new Date(s + "Z"); // бэк отдаёт utc без таймзоны, дописываем Z
  return d.toLocaleString();
}

export default function TicketList({ tickets, isAdmin, onChangeStatus, onDelete }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Приоритет</th>
          <th>Создана</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.title}</td>
            <td className="muted">{t.description || "-"}</td>
            <td>
              {/* поменять статус прямо из списка. для done селект блокируем */}
              <select
                value={t.status}
                disabled={t.status === "done"}
                onChange={(e) => onChangeStatus(t.id, e.target.value as Status)}
              >
                <option value="new">new</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </select>
            </td>
            <td>
              <span className="badge">{t.priority}</span>
            </td>
            <td className="muted">{fmtDate(t.created_at)}</td>
            <td>
              {isAdmin ? (
                <button onClick={() => onDelete(t.id)} disabled={t.status === "done"}>
                  Удалить
                </button>
              ) : (
                <span className="muted">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
