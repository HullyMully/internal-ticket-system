import { useState } from "react";

interface Props {
  isAdmin: boolean;
  onLogin: (user: string, pass: string) => void;
  onLogout: () => void;
}

// вход в аккаунт админа. админ нужен чтобы удалять заявки
export default function AdminLogin({ isAdmin, onLogin, onLogout }: Props) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  if (isAdmin) {
    return (
      <div className="row">
        <span>Вы вошли как админ</span>
        <button onClick={onLogout}>Выйти</button>
      </div>
    );
  }

  return (
    <div className="row">
      <input
        type="text"
        placeholder="логин (admin)"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="пароль (admin)"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={() => onLogin(user, pass)}>Войти как админ</button>
    </div>
  );
}
