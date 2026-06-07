/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, Unlock, Key, Send, AlertCircle, Heart, Star, 
  Compass, Music, RefreshCw, Sparkles, Paintbrush, Flame 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminSettings, GameProgress } from "../types";

interface SecretRoomViewProps {
  settings: AdminSettings;
  progress: GameProgress;
  setProgress: (p: GameProgress) => void;
}

export default function SecretRoomView({ settings, progress, setProgress }: SecretRoomViewProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [letterRevealed, setLetterRevealed] = useState(false);
  
  // Interactive letter styling textures
  const [paperTexture, setPaperTexture] = useState<"parchment" | "cyber" | "royal">("parchment");

  // Determine if it should be unlocked
  const isAllGamesDone = progress.game1Completed && progress.game2Completed && progress.game3Completed && progress.game4Completed;
  const isUnlockedGlobally = progress.isUnlockedExplicitly || isAllGamesDone;

  const playSynthBeep = (freq: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  };

  const playWaxRevealSwell = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Majestic low-pass warm sweep
      const freqs = [196.0, 246.9, 293.6, 392.0]; // G major
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f * 2, ctx.currentTime + 1.2);
        
        gainNode.gain.setValueAtTime(0.005, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8 + idx * 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.5);
      });
    } catch (_) {}
  };

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMsg("Şifre boş bırakılamaz sevgilim.");
      return;
    }

    if (passwordInput.trim() === settings.secretPassword) {
      playSynthBeep(523.25); // high success beep
      setErrorMsg("");
      const newProgress = { ...progress, isUnlockedExplicitly: true };
      setProgress(newProgress);
      setPasswordInput("");
    } else {
      playSynthBeep(180.0); // low mismatch beep
      setErrorMsg("Girdiğin şifre doğru değil sevgilim, tekrar dener misin? ❤️");
    }
  };

  const handleKeypadPress = (char: string) => {
    playSynthBeep(329.63);
    setPasswordInput(prev => prev + char);
  };

  const handleKeypadClear = () => {
    playSynthBeep(220.00);
    setPasswordInput("");
  };

  const handleLockRoom = () => {
    playSynthBeep(220.00);
    const newProgress = { ...progress, isUnlockedExplicitly: false };
    setProgress(newProgress);
    setLetterRevealed(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-neutral-250">
      
      {/* 1. LOCKED ROOM VIEW WITH TACTILE CODE KEYPAD */}
      {!isUnlockedGlobally ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-card border border-white/5 rounded-2xl p-6 sm:p-9 text-center shadow-2xl relative overflow-hidden space-y-7"
        >
          {/* Subtle Ambient Gold Glow Backgrounds */}
          <div className="absolute top-0 left-1/4 w-44 h-44 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-44 h-44 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3">
            <div className="mx-auto w-14 h-14 bg-black/40 border border-gold/30 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-5.5 h-5.5 text-gold fill-gold/5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gold tracking-wide">
              Kilitli Sır Odası
            </h1>
            <p className="text-xs sm:text-sm text-white/50 font-serif italic max-w-md mx-auto leading-relaxed">
              "Bu kapı yalnızca sevgimize inananlar ve ortak şifremizi bilenler için açılır. Tüm can cana olan mini anı oyunlarını tamamlayıp mühürleri çözmeli veya sır şifresini tuşlamalısın sevgilim."
            </p>
          </div>

          {/* Quick status report */}
          <div className="bg-black/40 max-w-sm mx-auto p-4 rounded-xl border border-white/5 space-y-2">
            <p className="text-[10px] uppercase font-mono tracking-widest text-gold font-bold">Harika Anıların Durumu</p>
            <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-white/60">
              <p>📸 Anı Parçası: <span className={progress.game1Completed ? "text-emerald-400 font-semibold" : "text-white/30"}>{progress.game1Completed ? "Hazır ✓" : "Kilitli"}</span></p>
              <p>✍️ Aşk Sözü: <span className={progress.game2Completed ? "text-emerald-400 font-semibold" : "text-white/30"}>{progress.game2Completed ? "Hazır ✓" : "Kilitli"}</span></p>
              <p>🎶 Şarkımız: <span className={progress.game3Completed ? "text-emerald-400 font-semibold" : "text-white/30"}>{progress.game3Completed ? "Hazır ✓" : "Kilitli"}</span></p>
              <p>🧩 Emoji: <span className={progress.game4Completed ? "text-emerald-400 font-semibold" : "text-white/30"}>{progress.game4Completed ? "Hazır ✓" : "Kilitli"}</span></p>
            </div>
          </div>

          {/* TACTILE KEYPAD ROW - BRINGS HIGH-FIDELITY CLICKABLE INTERACTIVITY */}
          <div className="max-w-xs mx-auto space-y-3 pt-3 border-t border-white/5">
            <div className="flex flex-col text-left space-y-1.5">
              <label className="text-[10px] font-mono text-white/40 flex items-center gap-1 uppercase tracking-wider">
                <Key className="w-3.5 h-3.5 text-gold" /> Şifreyi Yazın Veya Aşağıdan Tuşlayın
              </label>
              <input
                type="text"
                readOnly
                placeholder="Şifreyi tuşlayın..."
                value={passwordInput}
                className="w-full bg-black/60 border border-white/10 hover:border-gold/30 focus:border-gold rounded-xl px-4 py-3 text-center text-sm text-gold font-mono tracking-widest focus:outline-none transition-colors"
              />
            </div>

            {/* KEYPAD GRID */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-black/30 rounded-xl border border-white/5 shadow-inner">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => handleKeypadPress(num)}
                  className="py-2 bg-white/5 hover:bg-gold hover:text-black border border-white/5 hover:border-gold rounded-lg font-mono text-xs font-bold transition-all cursor-pointer active:scale-90"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-2 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 border border-rose-550/20 rounded-lg font-mono text-[9px] font-bold transition-all cursor-pointer"
              >
                TEMİZLE
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="py-2 bg-white/5 hover:bg-gold hover:text-black border border-white/5 hover:border-gold rounded-lg font-mono text-xs font-bold transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handlePasswordSubmit()}
                className="py-2 bg-gold/25 hover:bg-gold text-white hover:text-black font-serif text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              >
                KİLİDİ AÇ
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-300 bg-rose-950/25 border border-rose-500/20 rounded-xl p-2.5 flex items-center justify-center gap-1.5 font-medium animate-pulse">
                <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" /> {errorMsg}
              </p>
            )}
          </div>
        </motion.div>
      ) : (
        
        /* 2. COMPLETELY OVERHAULED UNLOCKED SANCTUARY VIEW */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Banner info with quick Lock button */}
          <div className="bg-dark-card border border-gold/20 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-3 bg-black/40 border border-gold/30 rounded-xl shadow-inner">
                  <Unlock className="w-5.5 h-5.5 text-gold fill-gold/15 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-gold flex items-center gap-1.5">Sır Odası Açıldı <Sparkles className="w-4.5 h-4.5 text-gold" /></h2>
                  <p className="text-xs text-white/45 italic font-serif">"Bu kalpte her zaman deryalar kadar geniş, sana özel bir sır saklıdır..."</p>
                </div>
              </div>
              <button
                onClick={handleLockRoom}
                className="text-xs px-3.5 py-2 bg-white/5 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-900/30 text-white/70 rounded-xl transition-all flex items-center gap-1.5 tracking-wider uppercase text-[10px] font-semibold border border-white/10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Odayı Kapat
              </button>
            </div>
          </div>

          {/* Letter style picker panel - MAKES DESIGN FULLY CUSTOMIZABLE */}
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1">
              <Paintbrush className="w-3.5 h-3.5 text-gold" /> Mektubun Kâğıt Dokusunu Seç:
            </span>
            <div className="flex gap-2">
              {[
                { id: "parchment", name: "Parşömen" },
                { id: "cyber", name: "Siber Gül" },
                { id: "royal", name: "Kraliyet" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    playSynthBeep(329.63);
                    setPaperTexture(t.id as any);
                  }}
                  className={`text-[9px] font-mono uppercase px-2.5 py-1 rounded transition-all cursor-pointer ${
                    paperTexture === t.id 
                      ? "bg-gold text-black font-bold shadow" 
                      : "bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Custom Styled Letter Envelope */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-12 border relative transition-all duration-500 ${
              paperTexture === "parchment" 
                ? "bg-amber-950/10 border-amber-900/30 text-amber-200" 
                : paperTexture === "cyber" 
                ? "bg-rose-950/10 border-rose-900/20 text-rose-200"
                : "bg-indigo-950/10 border-purple-900/30 text-[#e1e1e1]"
            }`}
          >
            {/* Romantic embellishments corner symbols - clickable with notes */}
            <div className="absolute top-4 left-4 text-gold/15 hover:text-gold hover:scale-125 transition-all cursor-pointer" title="Sevgim"><Heart className="w-5.5 h-5.5 fill-current" /></div>
            <div className="absolute top-4 right-4 text-gold/15 hover:text-gold hover:scale-125 transition-all cursor-pointer" title="Yıldızım"><Star className="w-5.5 h-5.5 fill-current" /></div>
            <div className="absolute bottom-4 left-4 text-gold/15 hover:text-gold hover:scale-125 transition-all cursor-pointer" title="Yönüm"><Compass className="w-5.5 h-5.5" /></div>
            <div className="absolute bottom-4 right-4 text-gold/15 hover:text-gold hover:scale-125 transition-all cursor-pointer" title="Tutkum"><Flame className="w-5.5 h-5.5 fill-current" /></div>

            <div className="max-w-xl mx-auto space-y-8">
              {!letterRevealed ? (
                /* Click To break wax seal trigger */
                <div className="text-center py-10 space-y-6">
                  <p className="text-sm font-serif italic text-gold">Aşk Mektubumuzun Balmumu Mührü</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playWaxRevealSwell();
                      setLetterRevealed(true);
                    }}
                    id="wax-seal-btn"
                    className="mx-auto w-24 h-24 bg-gradient-to-b from-[#111116] to-black border-2 border-gold rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative"
                    title="Mührü basmak için tıkla"
                  >
                    <span className="absolute animate-ping h-full w-full rounded-full bg-gold/10 opacity-75"></span>
                    <Heart className="w-8 h-8 text-gold fill-gold/25 animate-pulse" />
                  </motion.button>
                  
                  <p className="text-[10px] uppercase font-mono tracking-widest text-white/30">Mührün üzerine tıklayarak mektubu deşifre et</p>
                </div>
              ) : (
                /* Styled dynamic letter contents */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center">
                    <Heart className="w-8 h-8 text-gold fill-gold/15 animate-pulse" />
                  </div>
                  
                  {/* Styled letter backdrop depending on paperTexture */}
                  <div className={`font-serif leading-relaxed text-sm sm:text-base text-left max-w-lg mx-auto whitespace-pre-line p-6 sm:p-7 rounded-2xl border shadow-inner ${
                    paperTexture === "parchment"
                      ? "bg-amber-950/20 text-[#fcedc7] border-amber-900/30"
                      : paperTexture === "cyber"
                      ? "bg-rose-950/25 text-[#fecdd3] border-rose-900/30"
                      : "bg-[#0c0c0f]/60 text-[#f3f4f6] border-white/5"
                  }`}>
                    {settings.secretLetter}
                  </div>

                  <p className="font-serif italic text-xs text-gold/80 pt-2 text-center">
                    Sonsuz aşık kalplerimizle sevgilim...
                  </p>

                  <div className="flex justify-center pt-3 border-t border-white/5">
                    <button
                      onClick={() => {
                        playSynthBeep(220.00);
                        setLetterRevealed(false);
                      }}
                      className="text-[10px] text-white/40 hover:text-white cursor-pointer uppercase font-mono tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl transition-all"
                    >
                      Mührü Tekrar Mühürle 🥀
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Music embed inside secret room for ambient vibe */}
          <div className="bg-[#0f0f12] p-4 rounded-xl border border-white/5 text-center flex items-center justify-center gap-1.5 text-xs text-white/40 italic font-serif">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" /> "Derya kalplilerden, sonsuz aşka açılan kutlu pencere..."
          </div>
        </motion.div>
      )}
    </div>
  );
}
