"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    let result;

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      alert(result.error.message);
    } else {
      alert(isLogin ? "Login successful!" : "Signup successful!");
      router.push("/chat"); // Redirect to chat after login/signup
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h1>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="border p-2 rounded mb-2 w-64"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="border p-2 rounded mb-2 w-64"
      />
      <button 
        onClick={handleAuth} 
        disabled={loading} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
      </button>

      <button 
        onClick={() => setIsLogin(!isLogin)} 
        className="mt-4 text-blue-500 underline"
      >
        {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}
