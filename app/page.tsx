"use client";
import LoadingForeground from "@/_components/loading";
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
      <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
        <p className="text-lg text-gray-600 mb-8">You are successfully authenticated.</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <a
            href="/secret-page-1"
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200"
          >
            View My Secret
          </a>
          <a
            href="/secret-page-2"
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
          >
            Add / Update Secret
          </a>
          <a
            href="/secret-page-3"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
          >
            See Other Secrets
          </a>
          <a
            href="/neodrive"
            className="flex items-center justify-center px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-lg hover:bg-pink-700 transition duration-200"
          >
            NeoDrive
          </a>
          <a
            href="/todo"
            className="flex items-center justify-center px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition duration-200"
          >
            Todo
          </a>
          <a
            href="/foodgallery"
            className="flex items-center justify-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
          >
            Food Gallery
          </a>
          <a
            href="/pokemon"
            className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-600 transition duration-200"
          >
            Pokemon
          </a>
          <a
            href="/md"
            className="flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 transition duration-200"
          >
            Markdown
          </a>
        </div>
        <button
          onClick={() => dispatch(logoutUser())}
          className="mt-4 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200"
        >
          Log Out
        </button>
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
