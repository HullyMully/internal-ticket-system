interface Props {
  value: string;
  onChange: (v: string) => void;
}

// строка поиска. поиск идёт на бэке, тут просто инпут
export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Поиск по названию и описанию..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "300px" }}
    />
  );
}
