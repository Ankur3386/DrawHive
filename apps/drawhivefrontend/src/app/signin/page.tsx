"use client";

import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { data } from "framer-motion/client";

interface Form { email: string; password: string }
interface Errors { email?: string; password?: string }

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

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

export default function LoginPage() {
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof Form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

const submit = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      `${process.env.BACKEND_URL}/signin`,
      {
        email: form.email,
        password: form.password,
      }
    );
     localStorage.setItem("token",res.data.token)
   
    setDone(true);

    setForm({ email: "", password: "" });

  } catch (err) {
    console.error(err);
    alert("Login failed");
  } finally {
    setLoading(false);
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
        {/* Decorations */}
        <span className="absolute top-10 left-12 text-3xl select-none rotate-12 text-amber-400">✦</span>
        <span className="absolute bottom-12 right-16 text-2xl select-none -rotate-6 text-green-300">✦</span>
        <span className="absolute bottom-16 left-20 font-caveat text-stone-400 text-sm -rotate-3">welcome back! 👋</span>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 0.5 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="relative w-full max-w-sm mx-4"
        >
          {/* Sketch shadow */}
          <div className="absolute inset-0 rounded-xl bg-stone-800 translate-x-1.5 translate-y-1.5" />

          {/* Card body */}
          <div className="relative bg-white rounded-xl border-2 border-dashed border-stone-800 p-7">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* Header */}
                  <motion.div {...fade(0.05)} className="mb-5">
                    <p className="font-caveat text-xs tracking-widest text-stone-400 mb-1">WELCOME BACK</p>
                    <h1 className="font-caveat text-3xl font-bold text-stone-800 leading-tight">
                      Log back in 🔑
                    </h1>
                    <p className="font-caveat text-stone-400 text-sm mt-1">Missed you around here!</p>
                  </motion.div>

                  {/* Social */}
                  <motion.div {...fade(0.1)} className="grid grid-cols-2 gap-2 mb-4">
                    {[["🌐", "Google"], ["🐙", "GitHub"]].map(([icon, name]) => (
                      <button key={name}
                        className="font-caveat text-base font-semibold border-2 border-dashed border-stone-400 rounded py-2 flex items-center justify-center gap-1.5 text-stone-700 hover:bg-amber-50 hover:border-amber-400 transition-colors"
                        style={{ boxShadow: "2px 2px 0 #d6d3d1" }}
                      >
                        {icon} {name}
                      </button>
                    ))}
                  </motion.div>

                  {/* Divider */}
                  <motion.div {...fade(0.15)} className="flex items-center gap-2 mb-4">
                    <div className="flex-1 border-t-2 border-dashed border-stone-200" />
                    <span className="font-caveat text-xs text-stone-300">or use email</span>
                    <div className="flex-1 border-t-2 border-dashed border-stone-200" />
                  </motion.div>

                  {/* Fields */}
                  <motion.div {...fade(0.2)}>
                    <Field label="Email 📬" type="email" placeholder="ada@example.com" value={form.email} onChange={set("email")} error={errors.email} />
                    <Field label="Password 🔒" type="password" placeholder="your password" value={form.password} onChange={set("password")} error={errors.password} />
                  </motion.div>

                  {/* Forgot password */}
                  <motion.div {...fade(0.22)} className="text-right -mt-2 mb-4">
                    <span className="font-caveat text-xs text-amber-600 underline decoration-wavy cursor-pointer hover:text-amber-500">
                      forgot password?
                    </span>
                  </motion.div>

                  {/* Submit */}
                  <motion.button
                    {...fade(0.25)}
                    onClick={submit}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 font-caveat text-lg font-bold text-stone-900 bg-amber-400 border-2 border-dashed border-stone-800 rounded transition-all hover:bg-amber-300"
                    style={{ boxShadow: "3px 3px 0 #1c1917" }}
                  >
                    {loading ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }} className="inline-block">
                        ✏️
                      </motion.span>
                    ) : "Log me in →"}
                  </motion.button>

                  <motion.p {...fade(0.3)} className="mt-3 text-center font-caveat text-sm text-stone-400">
                    No account yet?{" "}
                    <span className="text-amber-600 font-semibold underline decoration-wavy cursor-pointer">Sign up →</span>
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl mb-3"
                  >👋</motion.div>
                  <h2 className="font-caveat text-2xl font-bold text-stone-800">You&apos;re back!</h2>
                  <p className="font-caveat text-stone-400 mt-1">Taking you to your dashboard ✨</p>
                  <div className="mt-4 border-t-2 border-dashed border-amber-300 w-2/3 mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}