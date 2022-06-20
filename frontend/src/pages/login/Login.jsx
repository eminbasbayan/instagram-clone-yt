import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress, TextField } from "@mui/material";
import "./login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall({ email, password }, dispatch);
    navigate("/");
  };

  return (
    <div className="auth-page">
      <h1>Welcome to Social Media App</h1>
      <form onSubmit={handleSubmit} className="form">
        <h2>Login</h2>
        <div className="form-input">
          <TextField
            required
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </div>
        <div className="form-input">
          <TextField
            required
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
        </div>
        <Link to="/register" className="back-login">
          Register
        </Link>
        <Button variant="contained" color="success" type="submit">
          {isFetching ? (
            <CircularProgress
              style={{ width: "25px", height: "25px" }}
              color="inherit"
            />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
};
