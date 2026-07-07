interface Props {
  status: string;
  priority: string;
  sortBy: string;
  order: string;
  onStatus: (v: string) => void;
  onPriority: (v: string) => void;
  onSortBy: (v: string) => void;
  onOrder: (v: string) => void;
}

// фильтры по статусу и приоритету + управление сортировкой
export default function Filters(props: Props) {
  return (
    <div className="row">
      <label>
        Статус:{" "}
        <select value={props.status} onChange={(e) => props.onStatus(e.target.value)}>
          <option value="">все</option>
          <option value="new">new</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
      </label>

      <label>
        Приоритет:{" "}
        <select value={props.priority} onChange={(e) => props.onPriority(e.target.value)}>
          <option value="">все</option>
          <option value="low">low</option>
          <option value="normal">normal</option>
          <option value="high">high</option>
        </select>
      </label>

      <label>
        Сортировать по:{" "}
        <select value={props.sortBy} onChange={(e) => props.onSortBy(e.target.value)}>
          <option value="created_at">дате создания</option>
          <option value="priority">приоритету</option>
        </select>
      </label>

      <label>
        Порядок:{" "}
        <select value={props.order} onChange={(e) => props.onOrder(e.target.value)}>
          <option value="desc">по убыванию</option>
          <option value="asc">по возрастанию</option>
        </select>
      </label>
    </div>
  );
}
