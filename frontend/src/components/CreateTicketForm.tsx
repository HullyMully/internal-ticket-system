import { useState } from "react";

interface Props {
  onCreate: (data: { title: string; description: string; priority: string }) => void;
}

// форма создания заявки
export default function CreateTicketForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [localError, setLocalError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // простая проверка на фронте, основная всё равно на бэке
    if (title.trim().length < 3) {
      setLocalError("Название минимум 3 символа");
      return;
    }
    if (title.length > 120) {
      setLocalError("Название максимум 120 символов");
      return;
    }
    setLocalError("");
    onCreate({ title: title.trim(), description: description.trim(), priority });
    // чистим форму
    setTitle("");
    setDescription("");
    setPriority("normal");
  }

  return (
    <form onSubmit={submit}>
      <h3>Новая заявка</h3>
      {localError && <p className="error">{localError}</p>}
      <div className="row">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "250px" }}
        />
        <input
          type="text"
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "300px" }}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
        </select>
        <button type="submit">Создать</button>
      </div>
    </form>
  );
}
