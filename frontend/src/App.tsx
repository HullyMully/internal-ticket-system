import { useState, useEffect } from "react";
import { Ticket, Status } from "./types";
import * as api from "./api";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import TicketList from "./components/TicketList";
import CreateTicketForm from "./components/CreateTicketForm";
import AdminLogin from "./components/AdminLogin";

const PAGE_SIZE = 10;

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  // фильтры/поиск/сортировка
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // состояния
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // админ
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // грузим список. вызывается при смене любого фильтра
  function load() {
    setLoading(true);
    setError("");
    api
      .getTickets({
        status,
        priority,
        search,
        sort_by: sortBy,
        order,
        page,
        page_size: PAGE_SIZE,
      })
      .then((data) => {
        setTickets(data.items);
        setTotal(data.total);
      })
      .catch((e) => {
        setError(e.message || "Не удалось загрузить заявки");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // перезагружаем когда что-то поменялось
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, priority, sortBy, order, page]);

  // если поменяли фильтр - возвращаемся на первую страницу
  function resetToFirst(setter: (v: string) => void) {
    return (v: string) => {
      setPage(1);
      setter(v);
    };
  }

  function handleCreate(data: { title: string; description: string; priority: string }) {
    setError("");
    api
      .createTicket(data)
      .then(() => {
        setPage(1);
        load();
      })
      .catch((e) => setError(e.message));
  }

  function handleChangeStatus(id: number, newStatus: Status) {
    setError("");
    api
      .changeStatus(id, newStatus)
      .then(() => load())
      .catch((e) => setError(e.message));
  }

  function handleDelete(id: number) {
    if (!confirm("Удалить заявку #" + id + "?")) return;
    setError("");
    api
      .deleteTicket(id, adminUser, adminPass)
      .then(() => load())
      .catch((e) => setError(e.message));
  }

  function handleLogin(user: string, pass: string) {
    setError("");
    api
      .adminLogin(user, pass)
      .then((ok) => {
        if (ok) {
          setIsAdmin(true);
          setAdminUser(user);
          setAdminPass(pass);
        } else {
          setError("Неверный логин или пароль админа");
        }
      })
      .catch(() => setError("Не удалось войти"));
  }

  function handleLogout() {
    setIsAdmin(false);
    setAdminUser("");
    setAdminPass("");
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container">
      <h1>Учёт внутренних заявок</h1>

      <div className="panel">
        <AdminLogin isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />
      </div>

      <div className="panel">
        <CreateTicketForm onCreate={handleCreate} />
      </div>

      <div className="panel">
        <div className="row" style={{ marginBottom: "10px" }}>
          <SearchBar value={search} onChange={resetToFirst(setSearch)} />
        </div>
        <Filters
          status={status}
          priority={priority}
          sortBy={sortBy}
          order={order}
          onStatus={resetToFirst(setStatus)}
          onPriority={resetToFirst(setPriority)}
          onSortBy={setSortBy}
          onOrder={setOrder}
        />
      </div>

      {error && (
        <div className="panel">
          <p className="error">Ошибка: {error}</p>
        </div>
      )}

      <div className="panel">
        {loading ? (
          <p>Загрузка...</p>
        ) : tickets.length === 0 ? (
          <p className="muted">Заявок нет</p>
        ) : (
          <TicketList
            tickets={tickets}
            isAdmin={isAdmin}
            onChangeStatus={handleChangeStatus}
            onDelete={handleDelete}
          />
        )}

        {/* пагинация */}
        <div className="row" style={{ marginTop: "10px" }}>
          <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
            Назад
          </button>
          <span>
            Страница {page} из {totalPages} (всего {total})
          </span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
            Вперёд
          </button>
        </div>
      </div>
    </div>
  );
}
