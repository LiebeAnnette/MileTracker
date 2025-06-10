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
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [login] = useMutation(LOGIN);
  const [register] = useMutation(REGISTER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const mutation = isLogin ? login : register;
      const result = await mutation({ variables: { username, password } });
      const data = isLogin ? result.data.login : result.data.register;

      if (!data?.token) {
        throw new Error("No token returned.");
      }

      localStorage.setItem("username", data.user.username);
      localStorage.setItem("token", data.token);
      setToken(data.token);

      setUsername("");
      setPassword("");
    } catch (error: any) {
      console.error("Auth error:", error.message);

      if (error.message.toLowerCase().includes("user")) {
        setErrorMessage("User not found. Please register first.");
      } else if (error.message.toLowerCase().includes("already exists")) {
        setErrorMessage("User already exists. Try logging in instead.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--sky)] bg-opacity-10 p-4">
      <Card>
        <div className="flex flex-col items-center text-center space-y-4 p-4">
          <img
            src="/MileTrackerLogo.png"
            alt="MileTracker full logo"
            className="w-56 mb-2 drop-shadow"
            style={{ borderRadius: "0.5rem" }}
          />

          <h2 className="heading-xl text-[color:var(--prussian)]">
            {isLogin ? "Login" : "Register"}
          </h2>

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

            <div className="relative">
              <input
                className="w-full pr-10 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--teal)] bg-white text-black"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[color:var(--teal)]"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.992 9.992 0 012.518-4.037m1.682-1.683A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.533 3.25M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>

            {loading && (
              <p className="text-sm text-gray-500 text-center">
                Logging in... please wait
              </p>
            )}
            {errorMessage && (
              <p className="text-sm text-red-600 font-semibold text-center">
                {errorMessage}
              </p>
            )}

            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(""); // reset message when switching modes
            }}
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
