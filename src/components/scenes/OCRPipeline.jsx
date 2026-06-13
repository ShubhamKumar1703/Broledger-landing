import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize, FiCpu, FiUserPlus, FiCheck } from "react-icons/fi";

const mockReceipt = {
  merchant: "Bros Pizza & Brews",
  date: "2026-06-13",
  items: [
    { id: 1, name: "Double Cheese Pizza", price: 650 },
    { id: 2, name: "Loaded Cheese Nachos", price: 380 },
    { id: 3, name: "Craft Beer Pitcher", price: 820 },
    { id: 4, name: "Chocolate Lava Cake", price: 240 }
  ],
  gst: 90,
  serviceCharge: 120,
  total: 2300
};

export default function OCRPipeline() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1); // -1: ready, 0-100: scanning, 101: finished
  const [extractedItems, setExtractedItems] = useState([]);
  const [assignments, setAssignments] = useState({}); // itemId -> friendIndex (0, 1, 2)
  
  const friends = [
    { name: "You", color: "bg-violet-500", border: "border-violet-500" },
    { name: "Alice", color: "bg-indigo-500", border: "border-indigo-500" },
    { name: "Bob", color: "bg-emerald-500", border: "border-emerald-500" }
  ];

  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setExtractedItems([]);
    setAssignments({});
  };

  // Simulate laser scanning animation
  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Auto load extracted items
          setExtractedItems(mockReceipt.items);
          return 101;
        }
        return prev + 4;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning]);

  const toggleAssign = (itemId, friendIdx) => {
    setAssignments(prev => ({
      ...prev,
      [itemId]: prev[itemId] === friendIdx ? null : friendIdx
    }));
  };

  // Compute splits
  const computeSplits = () => {
    let splits = [0, 0, 0]; // You, Alice, Bob
    
    mockReceipt.items.forEach(item => {
      const assignedIdx = assignments[item.id];
      if (assignedIdx !== undefined && assignedIdx !== null) {
        splits[assignedIdx] += item.price;
      } else {
        // Unassigned split equally
        splits.forEach((_, idx) => {
          splits[idx] += item.price / 3;
        });
      }
    });

    // Add proportional tax and service charges
    const extraCharges = mockReceipt.gst + mockReceipt.serviceCharge;
    const itemsSum = mockReceipt.items.reduce((sum, item) => sum + item.price, 0);
    
    splits = splits.map(val => {
      const ratio = val / itemsSum;
      return Math.round(val + extraCharges * ratio);
    });

    return splits;
  };

  const currentSplits = computeSplits();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10">
      {/* Left side: The mock receipt scanner */}
      <div className="col-span-1 lg:col-span-6 flex flex-col items-center">
        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl overflow-hidden glass-panel">
          {/* Laser beam */}
          {isScanning && (
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-violet-400 shadow-[0_0_15px_rgba(139,92,246,1)] z-10"
              style={{ top: `${scanProgress}%` }}
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, ease: "linear" }}
            />
          )}

          {/* Receipt Content */}
          <div className={`transition-all duration-300 ${isScanning ? "opacity-45 filter blur-xs" : "opacity-100"}`}>
            <div className="text-center mb-6">
              <FiMaximize className="mx-auto text-violet-400 mb-2" size={24} />
              <h3 className="font-extrabold text-lg text-white uppercase tracking-wider">{mockReceipt.merchant}</h3>
              <p className="text-xs text-slate-500">Date: {mockReceipt.date}</p>
            </div>
            
            <div className="border-t border-dashed border-white/10 py-4 flex flex-col gap-3">
              {mockReceipt.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="font-semibold text-slate-100">₹{item.price}.00</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-white/10 pt-4 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>GST (Tax)</span>
                <span>₹{mockReceipt.gst}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>₹{mockReceipt.serviceCharge}.00</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/5">
                <span>TOTAL AMOUNT</span>
                <span className="text-violet-400">₹{mockReceipt.total}.00</span>
              </div>
            </div>
          </div>

          {/* Button Trigger */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={startScan}
              disabled={isScanning}
              className="px-6 h-11 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <FiCpu className={isScanning ? "animate-spin" : ""} />
              {scanProgress === -1 ? "Start OCR Scan" : isScanning ? "Extracting..." : "Scan Again"}
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Extracted splits assignment */}
      <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Active OCR Pipeline
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            Collaborative Split Session
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Click on items below to assign them. Assigning items calculates exact shares including proportional tax and service charges.
          </p>
        </div>

        {/* OCR Result Panels */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 min-h-[260px] flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {extractedItems.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500"
              >
                <FiUserPlus size={36} className="mb-3 text-white/10" />
                <p className="text-xs">No active session. Trigger the OCR scan on the receipt simulator to extract line items.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {extractedItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 gap-3 hover:border-white/10 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-violet-400/80 font-bold">₹{item.price}</p>
                    </div>
                    {/* Friends selectors */}
                    <div className="flex items-center gap-2">
                      {friends.map((friend, idx) => {
                        const isAssigned = assignments[item.id] === idx;
                        return (
                          <button
                            key={friend.name}
                            onClick={() => toggleAssign(item.id, idx)}
                            className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isAssigned 
                                ? `${friend.color} text-white border-transparent shadow-[0_0_10px_rgba(139,92,246,0.2)]` 
                                : "border-white/5 hover:border-white/15 text-slate-400"
                            }`}
                          >
                            {isAssigned && <FiCheck />}
                            {friend.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live calculated splits overview */}
        {extractedItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-violet-600/5 border border-violet-500/15"
          >
            {friends.map((friend, idx) => (
              <div key={friend.name} className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-500">{friend.name}</p>
                <p className="text-lg font-black text-white mt-0.5">₹{currentSplits[idx]}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
