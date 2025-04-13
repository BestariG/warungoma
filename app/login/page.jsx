"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      router.push("/admin");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <input type="text" placeholder="Username" className="w-full p-2 border" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 mt-4">Login</button>
      </form>
    </div>
  );
};

export default Login;
