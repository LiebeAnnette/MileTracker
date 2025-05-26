import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import "../AuthForm.css";

const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

const AuthForm: React.FC = () => {
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [login] = useMutation(LOGIN);
  const [register] = useMutation(REGISTER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mutation = isLogin ? login : register;
      const result = await mutation({
        variables: { username, password },
      });

      const data = isLogin ? result.data.login : result.data.register;
      localStorage.setItem("username", data.user.username); // ✅ Save username!
      localStorage.setItem("token", data.token); // (optional)
      setToken(data.token);

      setUsername("");
      setPassword("");
    } catch (error: any) {
      console.error("Auth error:", error.message);
      alert("Authentication failed.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="auth-toggle"
        style={{ marginTop: "0.5rem" }}
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthForm;
