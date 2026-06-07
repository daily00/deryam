/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Volume2, VolumeX } from "lucide-react";
import { AdminSettings } from "../types";

interface SplashIntroProps {
  settings: AdminSettings;
  onComplete: () => void;
}

export default function SplashIntro({ settings, onComplete }: SplashIntroProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealMainWord, setRevealMainWord] = useState(false);

  // Synthesize a majestic Netflix-like "TUDUM" heartbeat with chord sweep
  const playCinematicTudum = () => {
    if (isMuted) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      
      // Node 1: Double Thump Heartbeat (Double Resonant Sub-Bass)
      const playThump = (time: number, freq: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        // Quick pitch drop
        osc.frequency.exponentialRampToValueAtTime(12, time + 0.35);
        
        gainNode.gain.setValueAtTime(gainVal, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.38);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.4);
      };

      // Play the rhythmic double thump
      playThump(ctx.currentTime + 0.1, 85, 0.95);
      playThump(ctx.currentTime + 0.32, 72, 1.0);

      // Node 2: Majestic Romantic Ambient String Sweep
      // We synthesize a lovely major chord (e.g. F# major or Eb major) that swells beautifully
      const chords = [196.00, 293.66, 392.00, 493.88, 587.33]; // G major orchestral spread
      
      chords.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.3);
        
        // Gentle vibrato
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        mod.frequency.setValueAtTime(5.5, ctx.currentTime);
        modGain.gain.setValueAtTime(2, ctx.currentTime);
        mod.connect(modGain);
        modGain.connect(osc.frequency);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(200, ctx.currentTime + 0.3);
        filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 1.2);
        
        // Volume swell and fade long tail
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.8 + (index * 0.05));
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);
        
        osc.connect(filter);
        filter.connect(gainNode);
        
        // Dynamic panning for cinematic spaciousness
        const pannerClass = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (pannerClass) {
          pannerClass.pan.setValueAtTime((index % 2 === 0 ? -0.6 : 0.6), ctx.currentTime);
          pannerClass.pan.linearRampToValueAtTime((index % 2 === 0 ? 0.4 : -0.4), ctx.currentTime + 2.5);
          gainNode.connect(pannerClass);
          pannerClass.connect(ctx.destination);
        } else {
          gainNode.connect(ctx.destination);
        }
        
        mod.start(ctx.currentTime);
        osc.start(ctx.currentTime + 0.3);
        osc.stop(ctx.currentTime + 3.5);
        mod.stop(ctx.currentTime + 3.5);
      });

    } catch (e) {
      console.warn("Web Audio API not allowed or failed to compile:", e);
    }
  };

  useEffect(() => {
    // Stage trigger timings
    const wordTimer = setTimeout(() => {
      setRevealMainWord(true);
    }, 1000);

    const autoCompleteTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(wordTimer);
      clearTimeout(autoCompleteTimer);
    };
  }, [onComplete]);

  const handleStartIntro = () => {
    setHasStarted(true);
    playCinematicTudum();
  };

  const initialLetter = settings.partnerName1 ? settings.partnerName1.charAt(0).toUpperCase() : "D";

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-[#e1e1e1] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Dynamic ambient grid background */}
      <div className="absolute inset-0 bg-[#050508] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Light bars that shoot vertically like standard Netflix intro style */}
      <AnimatePresence>
        {hasStarted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Cinematic Red/Gold Laser Light trails in center */}
            <motion.div 
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1.2, 0.4, 0], opacity: [0, 0.9, 0.4, 0], x: ["-50%", "-51%", "-48%", "-50%"] }}
              transition={{ duration: 3, times: [0, 0.15, 0.8, 1], ease: "easeInOut" }}
              className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-[#E50914] to-transparent origin-center blur-[1px] -translate-x-1/2"
            />
            <motion.div 
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 0.3, 0], opacity: [0, 0.7, 0.2, 0], x: ["-50%", "-47%", "-52%", "-50%"] }}
              transition={{ duration: 3, times: [0, 0.2, 0.75, 1], ease: "easeInOut" }}
              className="absolute left-1/2 top-0 bottom-0 w-[8px] bg-gradient-to-b from-transparent via-[#b81d24] to-transparent origin-center blur-[3px] -translate-x-1/2"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_transparent_40%,_#000000_100%)" />
          </div>
        )}
      </AnimatePresence>

      {/* START INSTRUCTIONS OVERLAY */}
      {!hasStarted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 text-center space-y-6 max-w-sm px-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-[#E50914]/10 border border-[#E50914]/40 flex items-center justify-center shadow-lg animate-pulse">
            <Heart className="w-7 h-7 text-[#E50914] fill-[#E50914]/10" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-sans font-extrabold tracking-wider text-white">DERYAFLIX</h1>
            <p className="text-xs text-white/60 font-serif italic">
              "Bir derya kadar derin, bir ömür kadar sonsuz..."
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartIntro}
              id="start-intro-splash-btn"
              className="w-full bg-[#E50914] hover:bg-[#b81d24] text-white font-extrabold text-xs py-3.5 px-6 rounded uppercase tracking-widest shadow-2xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              SİNEMATİK BAŞLAT
            </button>
            <p className="text-[10px] text-white/30 mt-2 font-mono">
              Not: Sinematik ses efekti için sesi açmayı unutmayın.
            </p>
          </div>
        </motion.div>
      ) : (
        /* ACTUAL NETFLIX CINEMATIC INTRO */
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          {/* Top Mute / Sound indicator */}
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className="absolute top-6 right-6 z-50 p-2 text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300"
            title={isMuted ? "Sesi Aç" : "Sesi Kıs"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Golden Netflix-Style Transforming Initial Letter */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, filter: "zoom-in" }}
              animate={{ 
                scale: [0.6, 1.15, 12], 
                opacity: [0, 1, 1, 0],
                filter: ["blur(4px)", "blur(0px)", "blur(18px)"]
              }}
              transition={{ 
                duration: 4.2, 
                times: [0, 0.22, 0.95, 1], // Stays in focus then zooms through past the camera
                ease: "easeIn" 
              }}
              className="text-9xl sm:text-[14rem] font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff323d] via-[#E50914] to-[#7a040b] tracking-tighter drop-shadow-[0_0_24px_rgba(229,9,20,0.6)] relative"
            >
              {initialLetter}

              {/* Dynamic light bar overlap in the letter for Netflix split illusion */}
              <motion.div 
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 mix-blend-overlay pointer-events-none"
              />
            </motion.div>

            {/* Sub-Tagline revealing later */}
            <AnimatePresence>
              {revealMainWord && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.8, times: [0, 0.1, 0.82, 1], ease: "easeOut" }}
                  className="absolute bottom-1/4 text-center space-y-2 px-4 pointer-events-none"
                >
                  <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-[0.22em] text-[#e1e1e1] uppercase drop-shadow-lg">
                    {settings.partnerName1} & {settings.partnerName2}
                  </h2>
                  <div className="flex items-center justify-center gap-1 text-[#E50914]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] font-light text-white/50">
                      YIL DÖNÜMÜ SUNAR...
                    </p>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mini Skip Button */}
          <button
            onClick={onComplete}
            id="skip-netflix-intro-btn"
            className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.2em] px-4 py-2 bg-black/60 hover:bg-black/90 text-white/50 hover:text-white border border-white/10 hover:border-gold rounded transition-all duration-300 cursor-pointer"
          >
            Sinematiği Geç
          </button>
        </div>
      )}
    </div>
  );
}
