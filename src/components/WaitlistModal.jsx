import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiUser, FiCheckCircle, FiLoader } from "react-icons/fi";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs, getCountFromServer, serverTimestamp } from "firebase/firestore";

export default function WaitlistModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success'
  const [queueNumber, setQueueNumber] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const emailLower = email.toLowerCase().trim();
      const waitlistCollection = collection(db, "broledger-waitlist");

      // 1. Check if the user is already on the waitlist
      const q = query(waitlistCollection, where("email", "==", emailLower));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Email already registered, retrieve their current queue position
        const existingData = querySnapshot.docs[0].data();
        setQueueNumber(existingData.queueNumber || 469);
        setStatus("success");
        return;
      }

      // 2. Count the total existing registrants to determine the next queue position
      const countSnapshot = await getCountFromServer(waitlistCollection);
      const totalCount = countSnapshot.data().count;
      const nextQueuePosition = totalCount + 1;

      // 3. Add user registration to Firestore database
      await addDoc(waitlistCollection, {
        name: name.trim(),
        email: emailLower,
        queueNumber: nextQueuePosition,
        createdAt: serverTimestamp()
      });

      setQueueNumber(nextQueuePosition);
      setStatus("success");
    } catch (err) {
      console.error("Firestore registration failed:", err);
      setStatus("idle");
      setErrorMsg("Registration failed. Please check your connection and try again.");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setName("");
    setEmail("");
    setErrorMsg("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#090a0f]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md rounded-3xl border border-white/8 bg-[#11131c]/90 p-8 shadow-2xl glass-panel z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/5 bg-white/2 hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <FiX size={16} />
            </button>

            {status !== "success" ? (
              <>
                <div className="text-center mb-6">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                    Native App Early Access
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-4">
                    Get Early Access to Native App
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Be among the first to experience the premium financial OS. Secure your exclusive spot today.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                    <div className="relative flex items-center">
                      <FiUser className="absolute left-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-11 pl-11 pr-4 rounded-xl text-xs text-slate-200 glass-input"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative flex items-center">
                      <FiMail className="absolute left-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full h-11 pl-11 pr-4 rounded-xl text-xs text-slate-200 glass-input"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  {errorMsg && (
                    <p className="text-rose-400 text-[10px] font-bold text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-xl">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 transition-all cursor-pointer mt-2"
                  >
                    {status === "loading" ? (
                      <>
                        <FiLoader className="animate-spin" /> Securing Spot...
                      </>
                    ) : (
                      "Request Native App Access"
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 flex flex-col items-center"
              >
                <FiCheckCircle className="text-emerald-400 mb-4 animate-bounce" size={48} />
                <h3 className="text-xl font-black text-white tracking-tight">You're on the list!</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Thanks for signing up, <span className="font-bold text-white">{name}</span>. We've reserved your access token.
                </p>

                {/* Queue Number display */}
                <div className="my-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 w-full">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Your Access Priority</span>
                  <p className="text-3xl font-black text-emerald-400 mt-1">#{queueNumber}</p>
                  <p className="text-[10px] text-slate-500 mt-1">We'll notify you at {email} when your access is ready.</p>
                </div>

                <button
                  onClick={handleClose}
                  className="px-6 h-10 rounded-full border border-white/5 bg-white/2 hover:bg-white/5 text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
