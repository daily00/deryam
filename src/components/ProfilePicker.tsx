import React from "react";
import { motion } from "motion/react";
import { Smile, Crown, Heart, Plus } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface ProfilePickerProps {
  onSelect: (profile: string) => void;
  partner1: string;
  partner2: string;
}

export default function ProfilePicker({ onSelect, partner1, partner2 }: ProfilePickerProps) {
  const p1 = partner1 || "Deryam";
  const p2 = partner2 || "Yusuf";

  const profiles: Profile[] = [
    {
      id: "partner1",
      name: p1,
      color: "from-rose-500 to-red-650 shadow-[0_4px_20px_rgba(229,9,20,0.4)]",
      icon: <Crown className="w-14 h-14 text-white" />,
    },
    {
      id: "partner2",
      name: `${p2}'um`,
      color: "from-blue-500 to-indigo-600 shadow-[0_4px_20px_rgba(59,130,246,0.3)]",
      icon: <Smile className="w-14 h-14 text-white" />,
    },
    {
      id: "both",
      name: "İkimiz",
      color: "from-purple-500 via-pink-500 to-rose-500 shadow-[0_4px_20px_rgba(236,72,153,0.35)]",
      icon: <Heart className="w-14 h-14 text-white fill-white/25" />,
    },
  ];

  const playSynthesizedTone = (idx: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, start: number, duration: number, type: OscillatorType = "sine") => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      if (idx === 0) {
        // High royal melody for Derya
        playTone(392, 0, 0.25, "triangle");
        playTone(523.25, 0.15, 0.45, "sine");
      } else if (idx === 1) {
        // Tech rhythmic smile tone for Yusuf
        playTone(329.63, 0, 0.2, "sine");
        playTone(493.88, 0.12, 0.4, "sine");
      } else {
        // Grand romantic combined swell chord
        playTone(261.63, 0, 0.5, "triangle");
        playTone(329.63, 0.05, 0.5, "triangle");
        playTone(392, 0.1, 0.5, "triangle");
        playTone(523.25, 0.15, 0.6, "sine");
      }
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-[80000] bg-black text-[#e1e1e1] flex flex-col items-center justify-center font-sans select-none animate-fade-in">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <span className="font-sans text-[#E50914] text-3xl sm:text-4xl font-extrabold tracking-widest uppercase drop-shadow-[0_0_12px_rgba(229,9,20,0.5)]">
          {p1.toUpperCase()}FLIX
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl px-6 text-center space-y-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium text-white tracking-wide">
          Kim izliyor?
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-6">
          {profiles.map((profile, index) => (
            <div key={profile.id} className="flex flex-col items-center group">
              <button
                onClick={() => {
                  playSynthesizedTone(index);
                  onSelect(profile.name);
                }}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-gradient-to-br ${profile.color} flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 border-2 border-transparent group-hover:border-white focus:outline-none cursor-pointer relative overflow-hidden`}
              >
                {profile.icon}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <span className="mt-3.5 text-sm sm:text-base text-white/60 group-hover:text-white transition-colors tracking-wide font-sans">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Locked / Custom Secret Profile Profile */}
          <div className="flex flex-col items-center group opacity-55 hover:opacity-100 transition-all">
            <button
              onClick={() => {
                try {
                  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                  const ctx = new AudioContextClass();
                  const osc = ctx.createOscillator();
                  osc.frequency.setValueAtTime(220, ctx.currentTime);
                  const gain = ctx.createGain();
                  gain.gain.setValueAtTime(0.15, ctx.currentTime);
                  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                  osc.connect(gain);
                  gain.connect(ctx.destination);
                  osc.start();
                  osc.stop(ctx.currentTime + 0.15);
                } catch (_) {}
                alert("Özel profil ekleme yakında! Şimdilik sevgiline ayrılmış profillerden birini seç birtanem.");
              }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg border-2 border-dashed border-white/20 hover:border-white/50 bg-[#141414] flex items-center justify-center transition-all duration-300 transform focus:outline-none cursor-pointer"
            >
              <Plus className="w-10 h-10 text-white/30 group-hover:text-white/60" />
            </button>
            <span className="mt-3.5 text-sm sm:text-base text-white/30 group-hover:text-white/50 tracking-wide font-sans">
              Profil Ekle
            </span>
          </div>
        </div>

        <div className="pt-10">
          <button
            onClick={() => {
              playSynthesizedTone(2);
              onSelect("Deryam");
            }}
            className="border border-white/40 hover:border-white text-white/60 hover:text-white font-sans text-xs tracking-[0.2em] font-medium py-2 px-6 uppercase rounded-sm bg-transparent hover:bg-white/5 transition-all cursor-pointer"
          >
            Profilleri Yönet
          </button>
        </div>
      </motion.div>
    </div>
  );
}
