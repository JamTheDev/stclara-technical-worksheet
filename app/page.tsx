"use client";
import LoadingForeground from "@/_components/loading-foreground";
import {
  checkUserLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/actions/auth.actions";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Home() {
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, checkingAuthStatus, status } = useAppSelector(
    (state) => state.auth
  );
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(checkUserLoggedIn());
  }, []);

  useEffect(() => {
    setError("");
  }, [mode]);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const result = await dispatch(
      loginUser({ email: email as string, password: password as string })
    );

    if (result.meta.requestStatus === "fulfilled") {
      console.log("Login successful");
    } else {
      setError(result.payload as string);
      console.error(result.payload);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const result = await dispatch(
      registerUser({
        name: name as string,
        email: email as string,
        password: password as string,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      console.log("Register successful");
    } else {
      setError(result.payload as string);
      console.error(result.payload);
    }
  };

  function Login() {
    return (
      <form
        className="mt-8 space-y-6"
        onSubmit={handleLoginSubmit}
        method="POST"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            disabled={status === "loading"}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Sign in
          </button>
          {error && (
            <p className="text-red-500 text-center pt-4 text-sm">{error}</p>
          )}
        </div>

        <div className="text-sm text-center">
          <a
            href="#"
            onClick={() => setMode("register")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Need an account? Register here.
          </a>
        </div>
      </form>
    );
  }

  function Register() {
    return (
      <form
        className="mt-8 space-y-6"
        onSubmit={handleRegisterSubmit}
        method="POST"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            disabled={status === "loading"}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Register
          </button>
          {error && (
            <p className="text-red-500 text-center pt-4 text-sm">{error}</p>
          )}
        </div>
        <div className="text-sm text-center">
          <a
            href="#"
            onClick={() => setMode("login")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Login here.
          </a>
        </div>
      </form>
    );
  }

  function HomePage() {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
        <span className="text-black text-4xl mb-8">You are authenticated!</span>
        <div className="flex space-x-4">
          <a
            href="/secret-page-1"
            className="px-5 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition duration-200"
          >
            View My Secret
          </a>
          <a
            href="/secret-page-2"
            className="px-5 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition duration-200"
          >
            Add / Update Secret
          </a>
          <a
            href="/secret-page-3"
            className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            See other Secrets
          </a>
        </div>

        <button
          onClick={() => dispatch(logoutUser())}
          className="mt-8 px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition duration-200">Log Out from Account</button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {checkingAuthStatus == "loading" || checkingAuthStatus == "idle" ? (
        <LoadingForeground />
      ) : (
        <div>
          {status === "loading" ? <LoadingForeground /> : <div />}
          {isAuthenticated ? (
            <HomePage />
          ) : (
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
              {mode === "login" ? <Login /> : <Register />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
