import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import Card from "./Card";
import Button from "./Button";

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
      const result = await mutation({ variables: { username, password } });
      const data = isLogin ? result.data.login : result.data.register;

      localStorage.setItem("username", data.user.username);
      localStorage.setItem("token", data.token);
      setToken(data.token);

      setUsername("");
      setPassword("");
    } catch (error: any) {
      console.error("Auth error:", error.message);
      alert("Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--sky)] bg-opacity-10 p-4">
      <Card>
        <div className="flex flex-col items-center text-center space-y-4 p-4">
          {/* Smaller Logo */}
          <img
            src="/MileTrackerLogo.png"
            alt="MileTracker full logo"
            className="w-56 mb-2 drop-shadow"
            style={{ borderRadius: "0.5rem" }}
          />

          {/* Login/Register Heading */}
          <h2 className="heading-xl text-[color:var(--prussian)]">
            {isLogin ? "Login" : "Register"}
          </h2>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 w-full max-w-md"
          >
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--teal)] bg-white text-black"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--teal)] bg-white text-black"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-[color:var(--prussian)] hover:underline"
          >
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
