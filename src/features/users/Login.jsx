import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../../app/services/userService.js";
import "./auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      userService.login({ username, password });
      navigate("/");
      location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Přihlášení</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          placeholder="Uživatelské jméno"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Přihlásit</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <p className="no-account-text">
        Nemáte účet? <Link to="/register">Zaregistrovat se</Link>
      </p>
    </div>
  );
}
