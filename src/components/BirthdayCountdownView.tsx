import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cake, Gift, Calendar, Heart, Send, Sparkles, 
  Trash, PartyPopper, Clock, Smile, Star, Quote, ListPlus, Edit2, Check
} from "lucide-react";
import { AdminSettings } from "../types";

interface BirthdayCountdownViewProps {
  settings: AdminSettings;
  setSettings?: (s: AdminSettings) => void;
  whoIsWatching: string | null;
}

interface WishItem {
  id: string;
  sender: string;
  target: "Derya" | "Yusuf" | "İkisi";
  content: string;
  date: string;
  iconType: "cake" | "heart" | "gift" | "star";
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  age: number;
  targetDate: Date;
}

export default function BirthdayCountdownView({ settings, setSettings, whoIsWatching }: BirthdayCountdownViewProps) {
  const p1 = settings.partnerName1 || "Derya";
  const p2 = settings.partnerName2 || "Yusuf";

  const [t1Countdown, setT1Countdown] = useState<CountdownState | null>(null);
  const [t2Countdown, setT2Countdown] = useState<CountdownState | null>(null);

  // Birthday edit state
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [editP1Date, setEditP1Date] = useState(settings.partner1Birthday || "1999-10-18");
  const [editP2Date, setEditP2Date] = useState(settings.partner2Birthday || "1997-05-12");
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  useEffect(() => {
    setEditP1Date(settings.partner1Birthday || "1999-10-18");
    setEditP2Date(settings.partner2Birthday || "1997-05-12");
  }, [settings.partner1Birthday, settings.partner2Birthday]);

  // Confetti and balloon particle states
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; type: "balloon" | "confetti" | "sparkle"; delay: number }>>([]);
  const [wishText, setWishText] = useState("");
  const [wishTarget, setWishTarget] = useState<"Derya" | "Yusuf" | "İkisi">("İkisi");
  const [wishIcon, setWishIcon] = useState<"cake" | "heart" | "gift" | "star">("heart");
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [showCelebrationOverlay, setShowCelebrationOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | typeof p1 | typeof p2>("all");

  // Load birthday countdowns
  const calculateCountdowns = () => {
    const getCountdown = (bdayStr: string): CountdownState => {
      const defaultValue: CountdownState = { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, age: 0, targetDate: new Date() };
      if (!bdayStr) return defaultValue;

      const birthDate = new Date(bdayStr);
      if (isNaN(birthDate.getTime())) return defaultValue;

      const now = new Date();
      // Calculate next occurrence
      let nextBDay = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 0, 0, 0);
      
      // If it's already passed this year, look at next year
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      if (nextBDay.getTime() < todayStart.getTime()) {
        nextBDay.setFullYear(now.getFullYear() + 1);
      }

      const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
      const age = nextBDay.getFullYear() - birthDate.getFullYear();

      const diffTime = nextBDay.getTime() - now.getTime();

      if (isToday) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: true,
          age: now.getFullYear() - birthDate.getFullYear(),
          targetDate: nextBDay
        };
      }

      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        isToday,
        age,
        targetDate: nextBDay
      };
    };

    setT1Countdown(getCountdown(settings.partner1Birthday));
    setT2Countdown(getCountdown(settings.partner2Birthday));
  };

  // Setup loop
  useEffect(() => {
    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [settings.partner1Birthday, settings.partner2Birthday]);

  // Load saved wishes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("deryam_birthday_wishes_v1");
      if (saved) {
        setWishes(JSON.parse(saved));
      } else {
        // Seed initial sweet wishes
        const initialWishes: WishItem[] = [
          {
            id: "seed-1",
            sender: p2,
            target: "Derya",
            content: "Yeni yaşında da her sabah senin o güzel gülüşünle uyanmak ve gözlerinin içindeki o dingin deryada kaybolmak dileğiyle sol yanım... ❤️",
            date: new Date().toLocaleDateString("tr-TR"),
            iconType: "heart"
          },
          {
            id: "seed-2",
            sender: p1,
            target: "Yusuf",
            content: "Yusuf'um, her yeni yaşın bize daha çok huzur, her anımıza daha çok kahkaha getirsin. Kalbimin en güvenli limanı iyi ki doğdun!",
            date: new Date().toLocaleDateString("tr-TR"),
            iconType: "cake"
          }
        ];
        setWishes(initialWishes);
        localStorage.setItem("deryam_birthday_wishes_v1", JSON.stringify(initialWishes));
      }
    } catch (_) {}
  }, []);

  const handleShareWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    const newWish: WishItem = {
      id: "wish_" + Date.now(),
      sender: whoIsWatching || "Misafir",
      target: wishTarget,
      content: wishText.trim(),
      date: new Date().toLocaleDateString("tr-TR"),
      iconType: wishIcon
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    setWishText("");
    try {
      localStorage.setItem("deryam_birthday_wishes_v1", JSON.stringify(updated));
    } catch (_) {}

    // Trigger celebration effects for successful post
    handleSpawnCelebration();
  };

  const handleDeleteWish = (id: string) => {
    const filtered = wishes.filter(w => w.id !== id);
    setWishes(filtered);
    try {
      localStorage.setItem("deryam_birthday_wishes_v1", JSON.stringify(filtered));
    } catch (_) {}
  };

  const handleSpawnCelebration = () => {
    const colors = ["#E50914", "#FFC107", "#2196F3", "#4CAF50", "#E91E63", "#9C27B0", "#FF5722"];
    const newParticles: any[] = [];
    
    // Create random particles
    for (let i = 0; i < 45; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * (window.innerWidth || 800),
        y: (window.innerHeight || 600) + Math.random() * 100, // Spawn from bottom
        size: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: i % 3 === 0 ? "balloon" : i % 3 === 1 ? "confetti" : "sparkle",
        delay: Math.random() * 1.5
      });
    }
    setParticles(newParticles);
    setShowCelebrationOverlay(true);

    // Auto clear particles from DOM after transition
    setTimeout(() => {
      setParticles([]);
      setShowCelebrationOverlay(false);
    }, 7000);
  };

  // Render correct icon
  const renderWishIcon = (type: string) => {
    switch (type) {
      case "cake": return <Cake className="w-5 h-5 text-amber-400" />;
      case "gift": return <Gift className="w-5 h-5 text-emerald-400" />;
      case "star": return <Star className="w-5 h-5 text-yellow-300 fill-yellow-300/10" />;
      default: return <Heart className="w-5 h-5 text-[#E50914] fill-[#E50914]/20" />;
    }
  };

  const filteredWishes = wishes.filter(w => {
    if (activeTab === "all") return true;
    return w.target === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 text-[#e1e1e1] relative">
      
      {/* Dynamic Celebration Floating Space Overlay - Confetti/Balloons */}
      <AnimatePresence>
        {showCelebrationOverlay && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ 
                  opacity: 0.9, 
                  x: p.x, 
                  y: p.y, 
                  scale: 0.6 
                }}
                animate={{ 
                  opacity: [0.9, 0.9, 0],
                  y: -100,
                  x: p.x + (Math.sin(p.id) * 150),
                  scale: [0.6, 1.2, 0.5],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: Math.random() * 4 + 3, 
                  delay: p.delay,
                  ease: "easeOut"
                }}
                className="absolute text-center select-none"
                style={{
                  fontSize: `${p.size}px`,
                  color: p.color,
                }}
              >
                {p.type === "balloon" ? "🎈" : p.type === "confetti" ? "🎉" : "✨"}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 1. HERO TITLE BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="text-left space-y-3">
          <span className="text-white font-extrabold tracking-widest text-xs bg-[#E50914] px-2.5 py-1 rounded-sm uppercase">
            ÖZEL ETKİNLİK SÜRÜMÜ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            DOĞUM GÜNÜ SEZONU
          </h1>
          <p className="text-sm text-white/50 max-w-2xl">
            Sevgililerin hayata adımlarını attığı en görkemli ve en kutsal günleri! Burada her ikinizin de doğum gününe kalan süreleri takip edebilir, dilek defterine sürpriz notlar bırakabilir ve sanal şenliği başlatabilirsiniz.
          </p>
        </div>
        <button
          onClick={() => setIsEditingDates(!isEditingDates)}
          className="flex items-center gap-1.5 px-4 py-2 bg-black/40 border border-white/10 hover:border-[#E50914] hover:bg-[#E50914]/5 rounded text-xs tracking-wider uppercase font-extrabold text-white transition-all cursor-pointer self-start md:self-auto shrink-0 shadow-lg active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5 text-[#E50914]" /> TARİHLERİ DÜZENLE
        </button>
      </div>

      {/* COLLAPSIBLE BIRTHDAY DATE EDITOR */}
      <AnimatePresence>
        {isEditingDates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-[#141414] border border-[#E50914]/30 rounded-2xl p-5 sm:p-6 space-y-5 text-left bg-gradient-to-br from-[#1c1414] to-[#141414] shadow-[0_4px_30px_rgba(229,9,20,0.1)]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Calendar className="w-5 h-5 text-[#E50914]" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Doğum Günü Tarihlerini ve Yıllarını Düzenle</h3>
                  <p className="text-[10px] text-white/40">Sistem doğum yılı ve tarihlerini anında güncelleyerek yaş hesaplamalarının yeni dönemlere uyum sağlamasını sağlayın.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                {/* Partner 1 (Derya) Birthday */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">{p1} Doğum Tarihi (Yıl-Ay-Gün)</label>
                  <input
                    type="date"
                    value={editP1Date}
                    onChange={(e) => setEditP1Date(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-[#E50914] rounded-md px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                  />
                  <p className="text-[9px] text-[#E50914]/60 font-mono">
                    Şu anki değer: {settings.partner1Birthday || "Belirtilmemiş"} ({settings.partner1Birthday && !isNaN(new Date(settings.partner1Birthday).getTime()) ? new Date(settings.partner1Birthday).getFullYear() : ""} yılı)
                  </p>
                </div>

                {/* Partner 2 (Yusuf) Birthday */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">{p2} Doğum Tarihi (Yıl-Ay-Gün)</label>
                  <input
                    type="date"
                    value={editP2Date}
                    onChange={(e) => setEditP2Date(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-[#E50914] rounded-md px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                  />
                  <p className="text-[9px] text-[#E50914]/60 font-mono">
                    Şu anki değer: {settings.partner2Birthday || "Belirtilmemiş"} ({settings.partner2Birthday && !isNaN(new Date(settings.partner2Birthday).getTime()) ? new Date(settings.partner2Birthday).getFullYear() : ""} yılı)
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    if (setSettings) {
                      setSettings({
                        ...settings,
                        partner1Birthday: editP1Date,
                        partner2Birthday: editP2Date
                      });
                      setIsSavedSuccessfully(true);
                      setTimeout(() => setIsSavedSuccessfully(false), 3000);
                      setIsEditingDates(false);
                      // Trigger celebration sparkle
                      handleSpawnCelebration();
                    }
                  }}
                  className="w-full sm:w-auto bg-[#E50914] hover:bg-red-700 text-white font-sans font-extrabold text-xs py-2.5 px-6 rounded-md uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" /> DEĞİŞİKLİKLERİ KAYDET
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditP1Date(settings.partner1Birthday || "1999-10-18");
                    setEditP2Date(settings.partner2Birthday || "1997-05-12");
                    setIsEditingDates(false);
                  }}
                  className="w-full sm:w-auto hover:bg-white/5 text-white/40 hover:text-white border border-white/10 font-sans font-extrabold text-xs py-2.5 px-6 rounded-md uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  İPTAL
                </button>

                {isSavedSuccessfully && (
                  <span className="text-xs font-mono text-emerald-400 font-bold ml-2 animate-pulse">
                    ✓ Değişiklikler başarıyla kaydedildi!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DUAL COUNTDOWNS BENTO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: PARTNER 1 (DERYA) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-[#141414] border rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
            whoIsWatching === p1 
              ? "border-[#E50914] shadow-[0_4px_25px_rgba(229,9,20,0.15)] bg-gradient-to-br from-[#1c1414] to-[#141414]" 
              : "border-white/10 shadow-lg"
          }`}
        >
          {whoIsWatching === p1 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/25 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-extrabold uppercase animate-pulse">
              <Smile className="w-3 h-3" /> Senin Profilin
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-650/10 flex items-center justify-center border border-rose-500/20">
                <Cake className="w-6 h-6 text-[#E50914]" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black tracking-tight text-white uppercase">{p1}'nın Doğum Günü</h3>
                <p className="text-xs text-white/40 font-mono">
                  {settings.partner1Birthday && !isNaN(new Date(settings.partner1Birthday).getTime())
                    ? new Date(settings.partner1Birthday).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })
                    : "Belirtilmemiş"}
                </p>
              </div>
            </div>

            {/* Live Count blocks */}
            {t1Countdown ? (
              t1Countdown.isToday ? (
                <div className="bg-[#E50914]/10 border border-[#E50914]/40 p-5 rounded-xl text-center space-y-3 animate-bounce">
                  <span className="text-3xl block">🎈🎉🥳🎂 🎉🎈</span>
                  <h4 className="text-xl font-black text-[#E50914] tracking-wide uppercase">İYİ Kİ DOĞDUN EN GÜZEL DERYAM!</h4>
                  <p className="text-sm font-light text-white/80">Bugün senin günün sevgilim. Hayata kattığın bütün güzellikler için sonsuz teşekkürler!</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{t1Countdown.days}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#E50914] font-medium font-mono">GÜN</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{t1Countdown.hours}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium font-mono">SAAT</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{t1Countdown.minutes}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium font-mono">DK</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-rose-500">{t1Countdown.seconds}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#E50914] font-medium font-mono">SN</span>
                  </div>
                </div>
              )
            ) : (
              <p className="text-sm text-white/30 italic">Bir sonraki yaş dönemi hesaplanıyor...</p>
            )}

            {!t1Countdown?.isToday && t1Countdown && (
              <p className="text-xs text-white/50 text-left font-serif italic">
                {p1} yeni yaşında <strong className="text-white font-bold">{t1Countdown.age}</strong> yaşına basacak ve bu hayat yolculuğuna fener tutmaya devam edecek.
              </p>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                setWishTarget(p1);
                setWishIcon("heart");
                const element = document.getElementById("wish-form-anchor");
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-[#E50914] hover:text-white transition-colors uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> {p1}'ya Sürpriz Not Yaz
            </button>
            <span className="text-[10px] text-white/30 font-mono tracking-wider">#DeryaÖzel</span>
          </div>
        </motion.div>

        {/* CARD 2: PARTNER 2 (YUSUF) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-[#141414] border rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
            whoIsWatching?.includes(p2) 
              ? "border-[#E50914] shadow-[0_4px_25px_rgba(229,9,20,0.15)] bg-gradient-to-br from-[#1c1414] to-[#141414]" 
              : "border-white/10 shadow-lg"
          }`}
        >
          {whoIsWatching?.includes(p2) && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/25 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-extrabold uppercase animate-pulse">
              <Smile className="w-3 h-3" /> Senin Profilin
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-650/10 flex items-center justify-center border border-rose-500/20">
                <Gift className="w-6 h-6 text-[#E50914]" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black tracking-tight text-white uppercase">{p2}'un Doğum Günü</h3>
                <p className="text-xs text-white/40 font-mono">
                  {settings.partner2Birthday && !isNaN(new Date(settings.partner2Birthday).getTime())
                    ? new Date(settings.partner2Birthday).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })
                    : "Belirtilmemiş"}
                </p>
              </div>
            </div>

            {/* Live Count blocks */}
            {t2Countdown ? (
              t2Countdown.isToday ? (
                <div className="bg-[#E50914]/10 border border-[#E50914]/40 p-5 rounded-xl text-center space-y-3 animate-bounce">
                  <span className="text-3xl block">🎈🎉🥳🎂 🎉🎈</span>
                  <h4 className="text-xl font-black text-[#E50914] tracking-wide uppercase">İYİ Kİ DOĞDUN SEVGİLİM!</h4>
                  <p className="text-sm font-light text-white/80">Yusuf'um, yeni yaşınla birlikte hayallerimize bir adım daha yaklaştık. Mutlu yıllar kahramanım!</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{t2Countdown.days}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#E50914] font-medium font-mono">GÜN</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{t2Countdown.hours}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium font-mono">SAAT</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-white">{t2Countdown.minutes}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/40 font-medium font-mono">DK</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg">
                    <span className="block text-2xl sm:text-3xl font-mono font-bold text-rose-500">{t2Countdown.seconds}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#E50914] font-medium font-mono">SN</span>
                  </div>
                </div>
              )
            ) : (
              <p className="text-sm text-white/30 italic">Bir sonraki yaş dönemi hesaplanıyor...</p>
            )}

            {!t2Countdown?.isToday && t2Countdown && (
              <p className="text-xs text-white/50 text-left font-serif italic">
                {p2} yeni yaşında <strong className="text-white font-bold">{t2Countdown.age}</strong> yılı geride bırakarak hayatına yepyeni parıltılı anılar katacak.
              </p>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                setWishTarget(p2);
                setWishIcon("heart");
                const element = document.getElementById("wish-form-anchor");
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-[#E50914] hover:text-white transition-colors uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> {p2}'a Sürpriz Not Yaz
            </button>
            <span className="text-[10px] text-white/30 font-mono tracking-wider">#YusufÖzel</span>
          </div>
        </motion.div>
      </div>

      {/* 3. SHENLIK CELEBRATION BUTTON (BIG FULL PANEL EXCLUSIVE) */}
      <div className="bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-white/10 rounded-xl p-6 text-center space-y-4 shadow-xl">
        <Sparkles className="w-8 h-8 text-[#E50914] animate-spin-slow mx-auto" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-white uppercase">Doğum Günü Sanal Şenliğini Başlat</h3>
          <p className="text-xs text-white/40 max-w-lg mx-auto">
            Hemen aşağıdaki butona basarak tüm ekranda renkli doğum günü balonları uçurabilir ve konfeti yağmuru fırlatarak sayfamızı şenlendirebilirsin!
          </p>
        </div>
        <div>
          <button
            onClick={handleSpawnCelebration}
            className="bg-[#E50914] hover:bg-red-700 text-white text-xs font-black tracking-widest py-3 px-8 rounded-md uppercase transition-all flex items-center gap-2 mx-auto cursor-pointer active:scale-95 shadow-lg"
          >
            <PartyPopper className="w-4 h-4" /> ŞENLİĞİ BAŞLAT 🎉🎈
          </button>
        </div>
      </div>

      {/* 4. DILEK DEFTERI SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4" id="wish-form-anchor">
        
        {/* WISH FORM BLOCK */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5 h-fit shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <ListPlus className="w-5 h-5 text-[#E50914]" />
            <div className="text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Yeni Dilek & Sürpriz Notu</h3>
              <p className="text-[10px] text-white/40 font-mono">Deryaflix Ziyaretçi Defteri</p>
            </div>
          </div>

          <form onSubmit={handleShareWish} className="space-y-4 text-left">
            {/* Sender identity */}
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Gönderen Profil</label>
              <div className="block w-full bg-black/50 border border-white/5 rounded-md px-3 py-2 text-xs text-white font-bold select-none cursor-not-allowed">
                👤 {whoIsWatching || "Misafir"}
              </div>
            </div>

            {/* Target Select */}
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">Kim İçin Dilek Bırakıyorsun?</label>
              <div className="grid grid-cols-3 gap-2">
                {([p1, p2, "İkisi"] as const).map(target => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setWishTarget(target)}
                    className={`py-2 px-1 rounded border text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      wishTarget === target 
                        ? "bg-[#E50914] text-white border-transparent" 
                        : "bg-black/45 text-white/50 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {target}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">Sembol Seç</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: "heart", icon: <Heart className="w-3.5 h-3.5" /> },
                  { type: "cake", icon: <Cake className="w-3.5 h-3.5" /> },
                  { type: "gift", icon: <Gift className="w-3.5 h-3.5" /> },
                  { type: "star", icon: <Star className="w-3.5 h-3.5" /> }
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setWishIcon(item.type as any)}
                    className={`py-2 rounded border flex justify-center items-center transition-all cursor-pointer ${
                      wishIcon === item.type 
                        ? "bg-[#E50914]/20 text-white border-[#E50914]" 
                        : "bg-black/45 text-white/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Sevgi Dileğin & Dilek Notun</label>
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                rows={4}
                required
                maxLength={400}
                placeholder="Örn: Birlikte kocayacağımız nice harika yıllara cancağızım, deryamsın..."
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-[#E50914] rounded-md px-3.5 py-3 text-xs text-white focus:outline-none placeholder-white/25 resize-none transition-all"
              />
              <p className="text-[9px] text-white/30 text-right mt-1">Maksimum 400 karakter</p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E50914] hover:bg-red-700 text-white font-sans font-extrabold text-xs py-2.5 rounded-md uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> DİLEK VE NOTU EKLE
            </button>
          </form>
        </div>

        {/* WISHLIST BOARD DISPATCHER (2/3 GRIDS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-2.5">
            <h2 className="text-lg font-bold tracking-wide uppercase text-white">Doğum Günü Dilek Defteri</h2>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5">
              {[
                { type: "all", label: "HEPSİ" },
                { type: p1, label: p1.toUpperCase() },
                { type: p2, label: p2.toUpperCase() }
              ].map(btn => (
                <button
                  key={btn.type}
                  onClick={() => setActiveTab(btn.type as any)}
                  className={`px-3 py-1.5 rounded text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                    activeTab === btn.type
                      ? "bg-white text-black"
                      : "bg-[#181815] text-white/50 hover:text-white border border-white/5"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* List display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredWishes.length > 0 ? (
                filteredWishes.map((w, idx) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-[#141414] border border-white/5 rounded-xl p-4.5 text-left flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Shadow glow indicator based on sender */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/2 rounded-full blur-2xl pointer-events-none" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center border border-white/10">
                            {renderWishIcon(w.iconType)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white tracking-wide truncate">{w.sender}</p>
                            <p className="text-[8px] text-white/30 font-mono">Dilek Sahibi</p>
                          </div>
                        </div>

                        {/* Tag details */}
                        <div className="text-right">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
                            w.target === p1 ? "bg-red-950/80 text-red-400" :
                            w.target === p2 ? "bg-blue-950/80 text-blue-400" : "bg-purple-950/80 text-purple-400"
                          }`}>
                            🎯 {w.target}
                          </span>
                        </div>
                      </div>

                      {/* Content block with quotation sign */}
                      <p className="text-xs text-white/70 font-sans italic leading-relaxed break-words whitespace-pre-wrap pl-1">
                        "{w.content}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20 relative z-10">
                      <span>Eklenme Tarihi: {w.date}</span>
                      <button
                        onClick={() => handleDeleteWish(w.id)}
                        className="p-1 px-1.5 hover:bg-white/5 hover:text-rose-500 rounded text-white/40 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Dileği Sil"
                      >
                        <Trash className="w-3 h-3" /> Sil
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 py-10 text-center bg-[#141414] rounded-xl border border-dashed border-white/10 space-y-2">
                  <Quote className="w-8 h-8 text-white/15 mx-auto" />
                  <p className="text-xs text-white/40">Henüz bu kategoride eklenmiş doğum günü dileği yok.</p>
                  <p className="text-[10px] text-white/25">Yan taraftaki formu kullanarak ilk sürpriz kelamı söyle sevgilim!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
    </div>
  );
}
