"use client";
import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Form {  email: string; password: string;  }

function Field({
  label, type = "text", placeholder, value, onChange, error,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-semibold text-stone-600 font-caveat">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-4 py-2.5 bg-white font-caveat text-base text-stone-800 placeholder-stone-300 outline-none rounded transition-all border-2 border-dashed ${
          error ? "border-red-400" : focused ? "border-amber-400 bg-amber-50" : "border-stone-400"
        }`}
        style={{ boxShadow: focused ? "3px 3px 0 #1c1917" : "2px 2px 0 #d6d3d1" }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1 text-xs text-red-500 font-caveat"
          >
            ↑ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SignupPage() {
  const [form, setForm] = useState<Form>({ email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [error ,setError]=useState("")

  const router = useRouter();

  const set = (key: keyof Form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    try {
      setError("")
      setLoading(true);
    const res=  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sign-in`, {
        email: form.email,
        password: form.password,
      
      });

    localStorage.setItem("token",res.data.token)
    localStorage.setItem("user",JSON.stringify(res.data.user.username))
      router.push("/dashboard");
    } catch (err) {
    setError("Enter correct Crendentials")
    } finally {
      setLoading(false);
        setForm({  email: "", password: "" });
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap'); .font-caveat { font-family: 'Caveat', cursive; }`}</style>

      <div
        className="min-h-screen flex items-center justify-center bg-amber-50"
        style={{
          backgroundImage: "linear-gradient(rgba(180,170,150,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(180,170,150,.2) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <span className="absolute top-10 left-12 text-3xl select-none rotate-12 text-amber-400">✦</span>
        <span className="absolute bottom-12 right-16 text-2xl select-none -rotate-6 text-green-300">✦</span>
        <span className="absolute top-16 right-24 font-caveat text-stone-400 text-sm rotate-6">handcrafted 🖊</span>

        {/* Card — only meaningful animation: entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="relative w-full max-w-sm mx-4"
        >
          <div className="absolute inset-0 rounded-xl bg-stone-800 translate-x-1.5 translate-y-1.5" />

          <div className="relative bg-white rounded-xl border-2 border-dashed border-stone-800 p-7">
            <AnimatePresence mode="wait">
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-5">
                    <p className="font-caveat text-xs tracking-widest text-stone-400 mb-1">Sign In TO Your ACCOUNT</p>
                    <h1 className="font-caveat text-3xl font-bold text-stone-800 leading-tight">
                      Join the DrawHive 🎨
                    </h1>
                  </div>

             

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 border-t-2 border-dashed border-stone-200" />
                    <span className="font-caveat text-xs text-stone-300"> continue with email</span>
                    <div className="flex-1 border-t-2 border-dashed border-stone-200" />
                  </div>

                  <div>
                    <Field label="Email 📬" type="email" placeholder="ada@example.com" value={form.email} onChange={set("email")} />
                    <Field label="Password 🔒" type="password" placeholder="min. 6 characters" value={form.password} onChange={set("password")} />
                  </div>
               {error!="" && (
                <div className="text-red-500"> {error}</div>
               )}
                 
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={submit}
                    className="w-full mt-1 py-3 font-caveat text-lg font-bold text-stone-900 bg-amber-400 border-2 border-dashed border-stone-800 rounded transition-all hover:bg-amber-300 cursor-pointer"
                    style={{ boxShadow: "3px 3px 0 #1c1917" }}
                  >
                    {loading ? "✏️ SignIn..." : "SignIn to my account →"}
                  </motion.button>

                  <p className="mt-3 text-center font-caveat text-sm text-stone-400">
                    Don't have an account?{" "}
                  <Link href="/sign-up" className="text-amber-600 font-semibold underline decoration-wavy cursor-pointer"> Sign Up →
                  </Link>  
                  </p>
                </motion.div>
            
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}