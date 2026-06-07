/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Calendar, Clock, Award, Sparkles, Music, 
  X, Eye, Flame, Compass, Star, ChevronRight, Share2, Info, Play,
  Cake, Gift, Smile
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminSettings } from "../types";
import { loadProgress } from "../utils/storage";

interface HomeViewProps {
  settings: AdminSettings;
  setTab: (tab: string) => void;
}

function getYouTubeEmbedUrl(url: string | undefined): string {
  if (!url) return "";
  let videoId = "";
  try {
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split(/[?#]/)[0] || "";
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split(/[?#&]/)[0] || "";
    } else if (url.includes("youtube.com/watch")) {
      const urlParts = url.split("?");
      if (urlParts.length > 1) {
        const urlParams = new URLSearchParams(urlParts[1]);
        videoId = urlParams.get("v") || "";
      }
    } else {
      videoId = url.trim();
    }
  } catch (e) {
    console.error("YouTube parsing error:", e);
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1` : "";
}

interface TimeDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function HomeView({ settings, setTab }: HomeViewProps) {
  const [timeDiff, setTimeDiff] = useState<TimeDifference | null>(null);
  const [tanismaDiff, setTanismaDiff] = useState<TimeDifference | null>(null);
  const progress = loadProgress();
  
  const p1 = settings.partnerName1 || "Derya";
  const p2 = settings.partnerName2 || "Yusuf";

  const [activeCounterTab, setActiveCounterTab] = useState<"marathon" | "p1_birthday" | "p2_birthday">("marathon");

  interface BirthdayCountdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isToday: boolean;
    age: number;
    zodiac: { name: string; emoji: string };
  }

  const [p1BirthdayCountdown, setP1BirthdayCountdown] = useState<BirthdayCountdown | null>(null);
  const [p2BirthdayCountdown, setP2BirthdayCountdown] = useState<BirthdayCountdown | null>(null);

  // Interactive Modals and Popovers
  const [showMathModal, setShowMathModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState<string | null>(null);
  const [chronoMessage, setChronoMessage] = useState<{ unit: string; body: string } | null>(null);
  const [showPhotoLightbox, setShowPhotoLightbox] = useState(false);
  const [photoFilter, setPhotoFilter] = useState<"none" | "retro" | "sepia" | "eternal_glow">("none");
  const [revealPhotoLetter, setRevealPhotoLetter] = useState(false);
  const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
  
  // Interactive Gameplay counters (Love meter & sent hearts)
  const [loveFactor, setLoveFactor] = useState(100);
  const [totalHeartsSent, setTotalHeartsSent] = useState(() => {
    try {
      const saved = localStorage.getItem("deryam_hearts_sent");
      return saved ? parseInt(saved, 10) : 108;
    } catch (_) {
      return 108;
    }
  });
  
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const heartIdCounter = useRef(0);

  // Time calculation effect
  useEffect(() => {
    const getZodiacSign = (dateStr: string): { name: string; emoji: string } => {
      if (!dateStr) return { name: "Bilinmiyor", emoji: "✨" };
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { name: "Bilinmiyor", emoji: "✨" };
      const month = d.getMonth() + 1;
      const day = d.getDate();

      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Koç", emoji: "♈" };
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Boğa", emoji: "♉" };
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "İkizler", emoji: "♊" };
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Yengeç", emoji: "♋" };
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Aslan", emoji: "♌" };
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Başak", emoji: "♍" };
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Terazi", emoji: "♎" };
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Akrep", emoji: "♏" };
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Yay", emoji: "♐" };
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Oğlak", emoji: "♑" };
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Kova", emoji: "♒" };
      return { name: "Balık", emoji: "♓" };
    };

    const getTimeDifference = (targetDate: Date, now: Date): TimeDifference => {
      let diffMs = now.getTime() - targetDate.getTime();
      const isFuture = diffMs < 0;
      if (isFuture) {
        diffMs = Math.abs(diffMs);
      }

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let years = now.getFullYear() - targetDate.getFullYear();
      let months = now.getMonth() - targetDate.getMonth();
      let days = now.getDate() - targetDate.getDate();
      let hours = now.getHours() - targetDate.getHours();
      let minutes = now.getMinutes() - targetDate.getMinutes();
      let seconds = now.getSeconds() - targetDate.getSeconds();

      if (seconds < 0) {
        minutes -= 1;
        seconds += 60;
      }
      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }
      if (hours < 0) {
        days -= 1;
        hours += 24;
      }
      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      return {
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        totalDays
      };
    };

    const calculateTime = () => {
      const now = new Date();

      const anniversary = new Date(settings.anniversaryDate);
      if (!isNaN(anniversary.getTime())) {
        setTimeDiff(getTimeDifference(anniversary, now));
      }

      const firstMet = new Date(settings.firstMetDate || settings.anniversaryDate);
      if (!isNaN(firstMet.getTime())) {
        setTanismaDiff(getTimeDifference(firstMet, now));
      }

      // Calculate Birthdays
      const getBdayDiff = (bdayStr: string | undefined): BirthdayCountdown | null => {
        if (!bdayStr) return null;
        const birthDate = new Date(bdayStr);
        if (isNaN(birthDate.getTime())) return null;

        // Calculate next occurrence
        let nextBDay = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate(), 0, 0, 0);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        
        if (nextBDay.getTime() < todayStart.getTime()) {
          nextBDay.setFullYear(now.getFullYear() + 1);
        }

        const isToday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
        const age = nextBDay.getFullYear() - birthDate.getFullYear();
        const diffTime = nextBDay.getTime() - now.getTime();

        const zodiac = getZodiacSign(bdayStr);

        if (isToday) {
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isToday: true,
            age: now.getFullYear() - birthDate.getFullYear(),
            zodiac
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
          zodiac
        };
      };

      setP1BirthdayCountdown(getBdayDiff(settings.partner1Birthday));
      setP2BirthdayCountdown(getBdayDiff(settings.partner2Birthday));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.anniversaryDate, settings.firstMetDate, settings.partner1Birthday, settings.partner2Birthday]);

  const getSafeFormattedAnniversary = () => {
    if (!settings.anniversaryDate) return "Belirtilmemiş";
    const d = new Date(settings.anniversaryDate);
    if (isNaN(d.getTime())) return "Belirtilmemiş";
    return d.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formattedAnniversary = getSafeFormattedAnniversary();

  const milestones = [
    { targetDays: 100, label: "İlk Yüz Günümüz", desc: "El ele yürüdüğümüz, gözlerimizin ilk birleştiği o heyecan dolu zamanın çiçek açışı." },
    { targetDays: 365, label: "Göz Alıcı 1. Yıl", desc: "Takvimin en güzel döngüsü, her günün altına vurduğumuz ilk altın mühür." },
    { targetDays: 500, label: "500. Birliktelik Günü", desc: "Zamanın aşkımızla nasıl su gibi aktığının, yarım bin günlük mutlu şahidiyiz." },
    { targetDays: 1000, label: "1000 Gecelik Masal", desc: "Sonsuzluğa giden yolda, bin parçadan oluşan muhteşem mozaik kraliçesi." },
    { targetDays: 2000, label: "2000 Rüya Gibi Gün", desc: "Hayat deryasında fırtınaları da sakin suları da hep el ele aşmanın görkemli zaferi." },
  ];

  // Particle creator on click
  const handleSpawnHeart = (e: React.MouseEvent) => {
    // Generate a particle where clicked, or centered on button if random
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const size = Math.floor(Math.random() * 20) + 15;
    const colorList = ["#d4af37", "#f43f5e", "#ff8da1", "#e11d48", "#fdba74"];
    const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
    
    const newHeart: FloatingHeart = {
      id: heartIdCounter.current++,
      x: clickX,
      y: clickY,
      size,
      color: randomColor
    };

    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Increment total hearts sent and save
    setTotalHeartsSent(count => {
      const next = count + 1;
      try {
        localStorage.setItem("deryam_hearts_sent", next.toString());
      } catch (_) {}
      return next;
    });

    // Clean up heart particle after 2.5 seconds
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2500);
  };

  const handleChronoClick = (unit: string) => {
    if (activeCounterTab === "p1_birthday" || activeCounterTab === "p2_birthday") {
      const activeName = activeCounterTab === "p1_birthday" ? p1 : p2;
      const bday = activeCounterTab === "p1_birthday" ? p1BirthdayCountdown : p2BirthdayCountdown;
      if (!bday) return;
      let titleMsg = "";
      let bodyMsg = "";

      switch (unit) {
        case "Yeni Yaş":
          titleMsg = `${activeName}'nın Yeni Yaşı`;
          bodyMsg = `${activeName} yeni yaşında tam ${bday.age} yaşına basacak! Her yaşın sana yepyeni mutluluklar, hayallerine giden yolları süsleyen taze güller getirmesi dileğiyle...`;
          break;
        case "Burç":
          titleMsg = `Kozmik Burç Sembolü: ${bday.zodiac.name}`;
          bodyMsg = `${activeName}, ${bday.zodiac.emoji} ${bday.zodiac.name} burcunun tüm harika ve parıltılı niteliklerini kalbinde taşıyor. Bu kozmik frekans aşkımızı daima sarsılmaz kılıyor!`;
          break;
        case "Gün":
          titleMsg = `Büyük Güne Geri Sayım`;
          bodyMsg = `Doğum gününe sadece ${bday.days} gün kaldı! Kalbimdeki tatlı heyecan her geçen an katlanarak büyüyor sevgilim.`;
          break;
        case "Saat":
          titleMsg = `Heyecanla Sayılan Saatler`;
          bodyMsg = `Sadece ${bday.hours} saat sonra yeni bir takvim yaprağı sevgilimin yeni yaşına yaklaşacak...`;
          break;
        case "Dakika":
          titleMsg = `Sabırsız Dakikalar`;
          bodyMsg = `Dakikaların (${bday.minutes} dk) su gibi akıp seni kucaklayacağım o eşsiz kutlama gününe yönelmesini bekliyoruz.`;
          break;
        case "Saniye":
          titleMsg = `Tıklayan Saniyeler`;
          bodyMsg = `Geçen her ${bday.seconds} saniye, kalbimizin aşk tınısını artırarak sevgilimin doğum gününe bir adım daha yaklaştırıyor.`;
          break;
        default:
          break;
      }
      setChronoMessage({ unit: titleMsg, body: bodyMsg });
      return;
    }

    if (!timeDiff) return;
    let titleMsg = "";
    let bodyMsg = "";

    switch (unit) {
      case "Yıl":
        titleMsg = "Aşk Dolu Yıllar";
        bodyMsg = `${timeDiff.years} harika yıldır hayatımın tam merkezindesin sevgilim. Her mevsim seninle başka bir bahara dönüştü, karlar eridi, çiçekler rüya gibi açtı...`;
        break;
      case "Ay":
        titleMsg = "Ayın Evreleri Gibi Parlayan Günler";
        bodyMsg = `Takvimlerden geçen ${timeDiff.months} muazzam ay boyunca, tıpkı aşkımızın hilalden dolunaya her gün daha parlak ve tam bir ışığa kavuşması gibi yüreğim seninle doldu.`;
        break;
      case "Gün":
        titleMsg = "Sonsuz Gündüzler";
        bodyMsg = `Birlikte geçirdiğimiz her bir gün (${timeDiff.days} gün), ömrüme eklenmiş paha biçilemez birer hazine gibidir. Seninle doğan her sabah benim miladımdır.`;
        break;
      case "Saat":
        titleMsg = "Her Saatte Sen";
        bodyMsg = `Günün her bir saatinde (${timeDiff.hours} saattir), kalbim senin sevgi frekansınla atıyor. Zamanın senin yanındayken su gibi uçması, uzağındayken asırlar sürmesi bundandır...`;
        break;
      case "Dakika":
        titleMsg = "Düşüncedeki Dakikalar";
        bodyMsg = `Aklımda senin olmadığın tek bir dakika bile yok. Şu anki saat dilimindeki ${timeDiff.minutes} dakika, sana olan sarsılmaz bağlılığımın ve sadakatimin küçük birer parçasıdır.`;
        break;
      case "Saniye":
        titleMsg = "Kardiyak Saniyeler";
        bodyMsg = `Saniyeler bir su damlası gibi akıp giderken, geçen her ${timeDiff.seconds} saniyede kalbimizden fışkıran o heyecanlı nehir, bizi sonsuz bir deryada birleştiriyor.`;
        break;
      default:
        break;
    }

    setChronoMessage({ unit: titleMsg, body: bodyMsg });
  };

  const getAstroSigns = () => {
    // Elegant static calculations for fun compatibility based on Turkish names
    const signPair = "Aşk Yıldızı Uyumu: Evrensel Frekans %100";
    const detail = "Gökyüzü haritanızda Şans Noktası ile Venüs kavuşum yapıyor! Bu aşk yalnızca tesadüfi değil, yıldızların kozmik bir fısıltısı gibi doğmuş. İkinizin haritası, sonsuz sadakat ve tutkuyla mühürlenmiş görünüyor.";
    return { title: signPair, body: detail };
  };

  // Convert total days to nice approximate counts
  const calcApproxMath = () => {
    if (!timeDiff) return { beats: 0, breaths: 0, laughs: 0, dreams: 0 };
    const exactHours = timeDiff.totalDays * 24;
    const exactMins = exactHours * 60;
    const exactSecs = exactMins * 60;
    
    // Estimations
    const beats = exactMins * 75; // 75 bpm avg heartbeat
    const breaths = exactMins * 16; // 16 breaths per min
    const laughs = timeDiff.totalDays * 8; // 8 laughs avg per day
    const dreams = timeDiff.totalDays * 4; // 4 dreams per night
    
    return {
      sec: exactSecs,
      min: exactMins,
      hours: exactHours,
      beats,
      breaths,
      laughs,
      dreams
    };
  };

  const loveMath = calcApproxMath();

  const handleShareLove = () => {
    navigator.clipboard.writeText("Bizim aşkımız sonsuz bir derya... ❤️");
    alert("Sevgi bağlantısı kopyalandı! Kalplerimiz her zaman bir arada.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-12 text-[#e1e1e1] relative">
      
      {/* 1. CINEMATIC BILLBOARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full aspect-[21/9] h-[340px] sm:h-[420px] rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.9)] border border-white/10 group bg-black"
      >
        <img 
          src={settings.homePhoto || "https://images.unsplash.com/photo-1518199266791-5375a83190b7"} 
          alt="Love Billboard" 
          className={`absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-105 transition-all duration-[10000ms] ease-out select-none ${
            photoFilter === "retro" ? "sepia brightness-[0.5] saturate-120" :
            photoFilter === "sepia" ? "sepia contrast-125 saturate-50 brightness-[0.5]" :
            photoFilter === "eternal_glow" ? "contrast-110 brightness-[0.6] saturate-150 hue-rotate-15" : ""
          }`}
        />
        {/* Netflix Gradient Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[#000000] bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 bg-gradient-to-r from-black via-black/45 to-transparent pointer-events-none" />

        {/* Billboard Contents */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 text-left space-y-3 sm:space-y-4 max-w-xl z-20">
          <div className="flex items-center gap-2">
            <span className="text-white font-black tracking-widest text-[9px] sm:text-xs bg-[#E50914] px-2.5 py-1 rounded-sm uppercase">
              ★ Orijinal Yapım
            </span>
            <span className="text-emerald-400 font-bold text-xs font-sans">
              %99.9 Aşk Eşleşmesi
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans leading-none uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {settings.partnerName1 || "Derya"} & {settings.partnerName2 || "Yusuf"}
          </h1>

          <p className="text-xs sm:text-sm text-white/70 line-clamp-3 leading-relaxed font-sans font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            "Hayat deryasında fırtınaları da sakin suları da hep el ele aşarak doğan akılalmaz bir aşk masalı. Başrollerini her günü rüya kılan {settings.partnerName1 || 'Derya'} ve {settings.partnerName2 || 'Yusuf'} paylaşıyor."
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setTab("games")}
              className="bg-white hover:bg-white/90 text-black font-sans font-black text-xs py-2.5 px-6 rounded-md uppercase tracking-wider transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current text-black" /> OYNAT
            </button>
            <button
              onClick={() => setShowMathModal(true)}
              className="bg-[#2a2a2a]/80 hover:bg-[#333333]/90 text-white font-sans font-bold text-xs py-2.5 px-6 rounded-md uppercase tracking-wider border border-white/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              🛈 DAHA FAZLA BİLGİ
            </button>
            <button
              onClick={() => setShowPhotoLightbox(true)}
              className="bg-black/60 hover:bg-black/85 text-xs text-white/60 hover:text-white px-3 py-2 rounded-md border border-white/10 ml-auto transition-all"
            >
              👁️ Filtre ve Galeri
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. LIVE MARATHON & BIRTHDAY CLOCK BAR (METRICS) */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-5 shadow-inner text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E50914]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] text-[#E50914] uppercase">
              {activeCounterTab === "marathon" && "ŞU ZAMANDAN BERİDİR BİRBİRİMİZİ TANIYORUZ"}
              {activeCounterTab === "p1_birthday" && `${p1.toUpperCase()} DOĞUM GÜNÜ SEZONU`}
              {activeCounterTab === "p2_birthday" && `${p2.toUpperCase()} DOĞUM GÜNÜ SEZONU`}
            </span>
          </div>

          {/* Tab Switcher - Tanışma vs Doğum Günü Sayacı */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setActiveCounterTab("marathon")}
              className={`px-3 py-1 text-[9px] font-mono font-extrabold tracking-wider rounded uppercase transition-all duration-200 cursor-pointer ${
                activeCounterTab === "marathon"
                  ? "bg-[#E50914] text-white shadow-md font-bold"
                  : "text-white/45 hover:text-white"
              }`}
            >
              ⏳ BİRBİRİMİZİ TANIYORUZ
            </button>
            <button
              onClick={() => setActiveCounterTab("p1_birthday")}
              className={`px-3 py-1 text-[9px] font-mono font-extrabold tracking-wider rounded uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                activeCounterTab === "p1_birthday"
                  ? "bg-[#E50914] text-white shadow-md font-bold"
                  : "text-white/45 hover:text-white"
              }`}
            >
              🎂 {p1}
            </button>
            <button
              onClick={() => setActiveCounterTab("p2_birthday")}
              className={`px-3 py-1 text-[9px] font-mono font-extrabold tracking-wider rounded uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                activeCounterTab === "p2_birthday"
                  ? "bg-[#E50914] text-white shadow-md font-bold"
                  : "text-white/45 hover:text-white"
              }`}
            >
              🎁 {p2}
            </button>
          </div>
        </div>

        {/* Content displays depending on active tab isToday check */}
        {activeCounterTab === "p1_birthday" && p1BirthdayCountdown?.isToday ? (
          <div className="bg-[#E50914]/10 border border-[#E50914]/30 p-5 rounded-xl text-center space-y-3 animate-bounce">
            <span className="text-3xl block">🎈🥳🎉🎂🧁🎁🎨👑💄💘🎈</span>
            <h4 className="text-xl font-black text-[#E50914] tracking-wide uppercase">İYİ Kİ DOĞDUN EN GÜZEL DERYAM! 🌸</h4>
            <p className="text-xs font-light text-white/80">Bugün senin günün sevgilim! Hayatımıza kattığın tüm göz kamaştırıcı ve parıldılı renkler için iyi ki varsın!</p>
          </div>
        ) : activeCounterTab === "p2_birthday" && p2BirthdayCountdown?.isToday ? (
          <div className="bg-[#E50914]/10 border border-[#E50914]/30 p-5 rounded-xl text-center space-y-3 animate-bounce">
            <span className="text-3xl block">🎈🥳🎉🎂🧁🎁🎨👑🍭💙🎈</span>
            <h4 className="text-xl font-black text-[#E50914] tracking-wide uppercase">İYİ Kİ DOĞDUN KAHRAMANIM! 🎁</h4>
            <p className="text-xs font-light text-white/80">{p2}'um, yeni yaşın bize daha çok aşk, şans ve harikulade yeni ortak hayaller fısıldasın!</p>
          </div>
        ) : (
          /* Bento grid list of clocks */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-0.5">
            {(activeCounterTab === "marathon"
              ? [
                  { key: "Yıl", value: tanismaDiff ? tanismaDiff.years : 0, sign: "Sene •" },
                  { key: "Ay", value: tanismaDiff ? tanismaDiff.months : 0, sign: "Ay •" },
                  { key: "Gün", value: tanismaDiff ? tanismaDiff.days : 0, sign: "Gün •" },
                  { key: "Saat", value: tanismaDiff ? tanismaDiff.hours : 0, sign: "Saat •" },
                  { key: "Dakika", value: tanismaDiff ? tanismaDiff.minutes : 0, sign: "Dk •" },
                  { key: "Saniye", value: tanismaDiff ? tanismaDiff.seconds : 0, sign: "Sn •", highlight: "text-[#E50914]" }
                ]
              : activeCounterTab === "p1_birthday"
              ? [
                  { key: "Yeni Yaş", value: p1BirthdayCountdown ? p1BirthdayCountdown.age : "...", sign: "YAŞ •" },
                  { key: "Burç", value: p1BirthdayCountdown ? p1BirthdayCountdown.zodiac.emoji : "✨", sign: p1BirthdayCountdown ? `${p1BirthdayCountdown.zodiac.name.toUpperCase()} •` : "BURÇ •" },
                  { key: "Gün", value: p1BirthdayCountdown ? p1BirthdayCountdown.days : 0, sign: "GÜN KALDI •" },
                  { key: "Saat", value: p1BirthdayCountdown ? p1BirthdayCountdown.hours : 0, sign: "SAAT •" },
                  { key: "Dakika", value: p1BirthdayCountdown ? p1BirthdayCountdown.minutes : 0, sign: "DK •" },
                  { key: "Saniye", value: p1BirthdayCountdown ? p1BirthdayCountdown.seconds : 0, sign: "SN •", highlight: "text-[#E50914]" }
                ]
              : [
                  { key: "Yeni Yaş", value: p2BirthdayCountdown ? p2BirthdayCountdown.age : "...", sign: "YAŞ •" },
                  { key: "Burç", value: p2BirthdayCountdown ? p2BirthdayCountdown.zodiac.emoji : "✨", sign: p2BirthdayCountdown ? `${p2BirthdayCountdown.zodiac.name.toUpperCase()} •` : "BURÇ •" },
                  { key: "Gün", value: p2BirthdayCountdown ? p2BirthdayCountdown.days : 0, sign: "GÜN KALDI •" },
                  { key: "Saat", value: p2BirthdayCountdown ? p2BirthdayCountdown.hours : 0, sign: "SAAT •" },
                  { key: "Dakika", value: p2BirthdayCountdown ? p2BirthdayCountdown.minutes : 0, sign: "DK •" },
                  { key: "Saniye", value: p2BirthdayCountdown ? p2BirthdayCountdown.seconds : 0, sign: "SN •", highlight: "text-[#E50914]" }
                ]
            ).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleChronoClick(item.key)}
                className="bg-black/50 hover:bg-black border border-white/5 hover:border-[#E50914]/40 p-3 rounded-lg text-center transition-all duration-300 hover:scale-[1.04] active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                title={`${item.key} detay fısıltısını göster!`}
              >
                <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${item.highlight || 'text-white'}`}>
                  {item.value}
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 font-mono mt-0.5">
                  {item.sign} OKU
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Live total days indicator footer */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-white/30 font-mono">
          <div className="flex items-center gap-1">
            {activeCounterTab === "marathon" ? (
              <>
                <span>Toplam tanışıklık süremiz:</span>
                <strong className="text-white font-bold">{tanismaDiff ? tanismaDiff.totalDays.toLocaleString("tr-TR") : "..."} GÜN</strong>
              </>
            ) : activeCounterTab === "p1_birthday" ? (
              <>
                <span>{p1} yeni doğum gününe kalan süre:</span>
                <strong className="text-white font-bold">{p1BirthdayCountdown ? p1BirthdayCountdown.days : "..."} GÜN</strong>
              </>
            ) : (
              <>
                <span>{p2} yeni doğum gününe kalan süre:</span>
                <strong className="text-white font-bold">{p2BirthdayCountdown ? p2BirthdayCountdown.days : "..."} GÜN</strong>
              </>
            )}
          </div>
          <button 
            onClick={() => {
              if (activeCounterTab === "marathon") {
                setShowHoroscopeModal(true);
              } else {
                setTab("birthday");
              }
            }}
            className="text-[#E50914] hover:underline hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider mt-1.5 sm:mt-0 flex items-center gap-1 cursor-pointer animate-pulse"
          >
            {activeCounterTab === "marathon" ? "★ KOZMİK YILDIZ UYUMUNU İNCELE ★" : "🎁 BÜTÜN DOĞUM GÜNÜ DİLEKLERİNİ GÖR ➜"}
          </button>
        </div>
      </div>

      {/* 🎉 YAKLAŞAN DOĞUM GÜNLERİ (PERSISTENT HIGH-POLISHED BANNER) */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide uppercase">
              Yaklaşan Doğum Günleri
            </h2>
          </div>
          <button
            onClick={() => setTab("birthday")}
            className="text-xs text-[#E50914] hover:text-white hover:underline transition-colors flex items-center gap-1 font-bold"
          >
            DİLEK DEFTERİNE GİT <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Partner 1 */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setTab("birthday")}
            className="bg-[#141414] border border-white/5 hover:border-[#E50914]/30 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg bg-gradient-to-br from-[#1c1414]/40 to-[#141414]/90"
          >
            {/* Background elements */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#E50914]/5 rounded-full blur-xl group-hover:bg-[#E50914]/10 transition-all pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E50914]/10 flex items-center justify-center border border-[#E50914]/20">
                    <Cake className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{p1}</h3>
                    <p className="text-[10px] text-white/40 tracking-wider font-mono uppercase">
                      {settings.partner1Birthday && !isNaN(new Date(settings.partner1Birthday).getTime())
                        ? new Date(settings.partner1Birthday).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })
                        : "18 Ekim"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-red-950/80 text-[#E50914] px-2 py-0.5 rounded font-mono font-black uppercase tracking-widest">
                    YENİ YAŞ: {p1BirthdayCountdown ? p1BirthdayCountdown.age : "..."}
                  </span>
                </div>
              </div>

              {/* Countdown Content */}
              {p1BirthdayCountdown ? (
                p1BirthdayCountdown.isToday ? (
                  <div className="bg-[#E50914]/10 border border-[#E50914]/40 p-3.5 rounded-lg text-center animate-pulse">
                    <p className="text-xs font-black text-[#E50914] uppercase tracking-wide">🥳 BUGÜN DOĞUM GÜNÜ! 🎉</p>
                    <p className="text-[10px] text-white/80 mt-1">İyi ki doğdun birtanem!</p>
                  </div>
                ) : (
                  <div className="bg-black/35 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Büyük Güne Kalan</p>
                      <p className="text-lg font-black text-white font-mono">{p1BirthdayCountdown.days} Gün <span className="text-[11px] text-white/50 font-normal">({p1BirthdayCountdown.hours} sa {p1BirthdayCountdown.minutes} dk {p1BirthdayCountdown.seconds} sn)</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Burç</p>
                      <p className="text-xs font-bold text-white flex items-center gap-1 justify-end">{p1BirthdayCountdown.zodiac.emoji} {p1BirthdayCountdown.zodiac.name}</p>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-xs text-white/20 italic">Doğum günü verisi hesaplanıyor...</p>
              )}
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 group-hover:text-white transition-colors">
              <span className="italic font-serif">"Hayatımıza giren en güzel derya..."</span>
              <span className="text-[#E50914] font-bold flex items-center gap-0.5">DİLEK BIRAK <ChevronRight className="w-3 h-3" /></span>
            </div>
          </motion.div>

          {/* Card 2: Partner 2 */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => setTab("birthday")}
            className="bg-[#141414] border border-white/5 hover:border-[#E50914]/30 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg bg-gradient-to-br from-[#1c1414]/40 to-[#141414]/90"
          >
            {/* Background elements */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#E50914]/5 rounded-full blur-xl group-hover:bg-[#E50914]/10 transition-all pointer-events-none" />

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E50914]/10 flex items-center justify-center border border-[#E50914]/20">
                    <Gift className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{p2}</h3>
                    <p className="text-[10px] text-white/40 tracking-wider font-mono uppercase">
                      {settings.partner2Birthday && !isNaN(new Date(settings.partner2Birthday).getTime())
                        ? new Date(settings.partner2Birthday).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })
                        : "12 Mayis"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-red-950/80 text-[#E50914] px-2 py-0.5 rounded font-mono font-black uppercase tracking-widest">
                    YENİ YAŞ: {p2BirthdayCountdown ? p2BirthdayCountdown.age : "..."}
                  </span>
                </div>
              </div>

              {/* Countdown Content */}
              {p2BirthdayCountdown ? (
                p2BirthdayCountdown.isToday ? (
                  <div className="bg-[#E50914]/10 border border-[#E50914]/40 p-3.5 rounded-lg text-center animate-pulse">
                    <p className="text-xs font-black text-[#E50914] uppercase tracking-wide">🥳 BUGÜN DOĞUM GÜNÜ! 🎉</p>
                    <p className="text-[10px] text-white/80 mt-1">Mutlu yıllar kahramanım!</p>
                  </div>
                ) : (
                  <div className="bg-black/35 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Büyük Güne Kalan</p>
                      <p className="text-lg font-black text-white font-mono">{p2BirthdayCountdown.days} Gün <span className="text-[11px] text-white/50 font-normal">({p2BirthdayCountdown.hours} sa {p2BirthdayCountdown.minutes} dk {p2BirthdayCountdown.seconds} sn)</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Burç</p>
                      <p className="text-xs font-bold text-white flex items-center gap-1 justify-end">{p2BirthdayCountdown.zodiac.emoji} {p2BirthdayCountdown.zodiac.name}</p>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-xs text-white/20 italic">Doğum günü verisi hesaplanıyor...</p>
              )}
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 group-hover:text-white transition-colors">
              <span className="italic font-serif">"Her anımıza gülüş katan limanımız..."</span>
              <span className="text-[#E50914] font-bold flex items-center gap-0.5">DİLEK BIRAK <ChevronRight className="w-3 h-3" /></span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. ROW 1: İZLEMEYE DEVAM ET (ACTIVE GAME SERIES) */}
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide uppercase">
            İzlemeye Devam Et
          </h2>
          <span className="text-xs text-white/40 font-serif lowercase italic">({settings.partnerName1 || "Derya"}'e özel serüvenler)</span>
        </div>

        {/* Swipe Row list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: "mem1",
              title: "1. Sezon: Ortak Gezilerimiz",
              desc: "Kapadokya'dan Galata'ya tüm seyahatlerimiz",
              cover: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=650&auto=format&fit=crop",
              completed: true,
              meta: "Aşk Dolu Geziler"
            },
            {
              id: "mem2",
              title: "2. Sezon: Sıcak Kafelerimiz",
              desc: "Karşılıklı sahlep ve derya sohbetlerimiz",
              cover: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=650&auto=format&fit=crop",
              completed: true,
              meta: "En Sevilen Mekanlar"
            },
            {
              id: "mem3",
              title: "3. Sezon: Doğa & Kamp Kaçamakları",
              desc: "Yıldızların altındaki o eşsiz huzur",
              cover: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=650&auto=format&fit=crop",
              completed: true,
              meta: "Huzurlu Doğa"
            },
            {
              id: "mem4",
              title: "4. Sezon: Bizim Aşk Köşemiz",
              desc: "Sadece ikimize özel o büyülü anılar",
              cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=650&auto=format&fit=crop",
              completed: true,
              meta: "Baş Başa Anlar"
            }
          ].map((movie, idx) => (
            <div 
              key={movie.id}
              onClick={() => setTab("games")}
              className="bg-[#181818] border border-white/5 hover:border-white/20 rounded-lg overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg transition-transform hover:scale-[1.03]"
            >
              {/* Card visual cover */}
              <div className="h-40 relative bg-black">
                <img 
                  src={movie.cover} 
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                />
                {/* Play Button Icon on over */}
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-11 h-11 bg-white hover:bg-[#E50914] rounded-full flex items-center justify-center transition-all">
                    <Play className="w-5 h-5 fill-current text-black group-hover:text-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[8px] font-bold bg-[#E50914] text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                    {movie.completed ? "BİTDİ" : "SÜRÜYOR"}
                  </span>
                </div>
              </div>

              {/* Card Content & Details */}
              <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide group-hover:text-[#E50914] transition-colors">{movie.title}</h4>
                  <p className="text-[10px] text-white/50">{movie.desc}</p>
                </div>

                {/* Netflix Progress bar slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                    <span>{movie.meta}</span>
                    <span className={movie.completed ? "text-emerald-400" : "text-white/30"}>
                      {movie.completed ? "%100 Tamam" : "%10 İzleme"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${movie.completed ? 'bg-emerald-400' : 'bg-[#E50914]'}`}
                      style={{ width: movie.completed ? "100%" : "15%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ROW 2: POPÜLER İÇERİKLER (ANNIVERSARY MILESTONES) */}
      <div className="space-y-4 text-left">
        <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide uppercase">
          Popüler İçerikler (Aşk Kilometre Taşlarımız)
        </h2>

        {/* Milestone Landscape Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {timeDiff && milestones.map((milestone, idx) => {
            const hasPassed = timeDiff.totalDays >= milestone.targetDays;
            const daysLeft = milestone.targetDays - timeDiff.totalDays;

            // Matching visual cover images for milestones
            const covers = [
              "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=350&q=80",
              "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=350&q=80",
              "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=350&q=80",
              "https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=350&q=80",
              "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&w=350&q=80"
            ];

            return (
              <div
                key={idx}
                onClick={() => setShowMilestoneModal(milestone.label)}
                className="bg-[#181818] border border-white/5 hover:border-white/20 rounded-md overflow-hidden flex flex-col justify-between group cursor-pointer transition-transform hover:scale-[1.03] shadow-lg text-left"
              >
                <div className="h-28 relative bg-black">
                  <img 
                    src={covers[idx] || covers[0]} 
                    alt={milestone.label} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      hasPassed ? "bg-emerald-900/80 text-emerald-300" : "bg-[#222] text-white/40"
                    }`}>
                      {hasPassed ? "YAYINDA" : "YAKINDA"}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-white font-serif font-black text-xs">
                    {milestone.targetDays} GÜN
                  </div>
                </div>

                <div className="p-2.5 space-y-1.5 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold text-[#e1e1e1] tracking-wide line-clamp-1 group-hover:text-[#E50914] transition-colors">
                      {milestone.label}
                    </h4>
                    <p className="text-[9px] text-white/45 line-clamp-2 leading-tight">
                      {milestone.desc}
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[8px] font-mono text-white/35 border-t border-white/5">
                    <span>Eşik #{idx + 1}</span>
                    <span className={hasPassed ? "text-emerald-400" : "text-[#E50914]"}>
                      {hasPassed ? "İzlendi ✓" : `${daysLeft} Gün`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ROW 3: SANA ÖZEL REKREASYON YAPIMLARI (INTERACTIVE TOOLS SERIES) */}
      <div className="space-y-4 text-left">
        <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide uppercase">
          Tavsiye Edilen Orijinal Programlar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SPECIAL 1: MUSIC CHANGER */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50914]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-[9px] font-mono text-[#E50914] uppercase tracking-widest flex items-center gap-1 font-bold">
                  <Music className="w-3 h-3 text-[#E50914]" /> Melodi Çalar (Müzikal Seri)
                </span>
                <span className="text-[8px] text-white/30 font-mono">Deryam Akustik</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">
                Bizim Aşkımızın Melodisi
              </h3>
              <p className="text-[11px] text-white/50 leading-relaxed max-w-sm">
                Buradaki oynatıcıyı başlatarak sevginin seçtiği parçaları arka planda dinle. Zaman su olup akacak!
              </p>
            </div>

            <div className="mt-4 flex-grow min-h-[140px] rounded-lg overflow-hidden bg-black/60 flex items-center justify-center border border-white/5 shadow-inner">
              {(!settings.musicType || settings.musicType === "spotify") ? (
                settings.musicEmbed && settings.musicEmbed.includes("<iframe") ? (
                  <div 
                    className="w-full h-full min-h-[120px]"
                    dangerouslySetInnerHTML={{ __html: settings.musicEmbed }} 
                  />
                ) : settings.musicEmbed && (settings.musicEmbed.startsWith("http://") || settings.musicEmbed.startsWith("https://")) ? (
                  <iframe
                    src={settings.musicEmbed}
                    className="w-full h-full min-h-[120px]"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify"
                  />
                ) : (
                  <div className="text-center p-3 text-white/50 space-y-2">
                    <p className="text-[11px] text-[#E50914] font-serif italic mb-1">"{settings.musicEmbed || "Yüzyüzeyken Konuşuruz..."}"</p>
                    <button 
                      onClick={() => setTab("admin")}
                      className="text-[9px] tracking-wider uppercase font-mono text-[#E50914] hover:text-white hover:underline cursor-pointer"
                    >
                      Müzik Kodunu Değiştirmek İçin Tıkla
                    </button>
                  </div>
                )
              ) : settings.musicType === "youtube" ? (
                settings.musicVideoUrl ? (
                  <iframe
                    src={getYouTubeEmbedUrl(settings.musicVideoUrl)}
                    className="w-full aspect-video h-full min-h-[140px] border-0"
                    allow="autoplay; encrypted-media"
                    loading="lazy"
                    title="YouTube"
                  />
                ) : (
                  <div className="text-center p-3">
                    <p className="text-xs text-[#E50914] font-serif italic mb-1">YouTube Videosu Eksik</p>
                    <p className="text-[9px] text-white/30">Yönetimden bir video linki yapıştırın.</p>
                  </div>
                )
              ) : (
                settings.musicVideoBase64 ? (
                  <video
                    src={settings.musicVideoBase64}
                    controls
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded aspect-video max-h-[160px]"
                  />
                ) : (
                  <div className="text-center p-3 text-white/30">
                    <p className="text-xs text-[#E50914] font-serif italic mb-1">Cihazdan Video Eksik</p>
                    <p className="text-[10px]">Yönetim sekmesinden cihazınızdan video yükleyin.</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* SPECIAL 2: SINERJI TESTI (LOVE METER) */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-[9px] font-mono text-[#E50914] uppercase tracking-widest flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-[#E50914] animate-bounce" /> Aşk Seviyesi Testi (İnteraktif Yarışma)
                </span>
                <span className="text-[8px] text-emerald-400 font-bold tracking-widest uppercase">CANLI</span>
              </div>
              
              <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">
                Sevgi Sinerjimizi Zirveye Taşı
              </h3>
              
              <p className="text-[11px] text-white/50 leading-relaxed">
                Tıkladıkça kalplerimizdeki o büyük sinerjiyi göklere taşı sevgilim. Seviyeye özel unvanları ortaya çıkar!
              </p>

              {/* Love progression UI */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                  <span>Mevcut Sinerji Seviyesi</span>
                  <span className="text-[#E50914] font-extrabold">%{loveFactor}</span>
                </div>
                <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div 
                    animate={{ width: `${Math.min(loveFactor, 100)}%` }}
                    className="bg-gradient-to-r from-[#b81d24] via-[#E50914] to-red-400 h-full rounded-full"
                  />
                </div>

                {/* Dynamic Love title */}
                <p className="text-center text-[11px] font-serif text-[#E50914] italic pt-1 font-semibold">
                  Unvan: {
                    loveFactor < 150 ? "Kozmik Çift ❤️" :
                    loveFactor < 250 ? "Galaksinin Koruyucuları ✨" :
                    loveFactor < 400 ? "Karadelik Çekim Merkezi 🌌" : "Deryaları Aşan Sonsuz Aşk 🔥"
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-1">
              <button
                onClick={() => setLoveFactor(prev => prev + 25)}
                className="flex-grow bg-white/5 hover:bg-[#E50914] hover:text-white border border-white/10 text-white/80 font-mono text-[9px] font-extrabold py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Enerjiyi Arttır ⚡
              </button>
              <button
                onClick={handleShareLove}
                className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
                title="Sonsuz Bağlantıyı Kopyala"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SPECIAL 3: HEART SPARK (CLICK ENGINE) */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Dynamic Flying Heart particles container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
              {floatingHearts.map(heart => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 0.9, scale: 0.5, x: heart.x, y: heart.y }}
                  animate={{ 
                    opacity: 0, 
                    scale: [0.5, 1.3, 0.8], 
                    y: heart.y - 120, // Float up
                    x: heart.x + (Math.random() * 80 - 40) // Drift left/right
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute pointer-events-none text-shadow"
                  style={{
                    fontSize: `${heart.size}px`,
                    color: heart.color,
                  }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-[9px] font-mono text-[#E50914] uppercase tracking-widest flex items-center gap-1 font-bold">
                  <Heart className="w-3 h-3 text-[#E50914] fill-[#E50914]/20 animate-pulse" /> Kalpler Köprüsü (İnteraktif Sezon)
                </span>
                <span className="text-[8px] text-[#E50914] font-bold">CANLI DESTEK</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">
                Deryamıza Sevgi Baloncuğu Uçur
              </h3>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Tıklayarak aşka can ver sevgilim! Göndereceğin her kalp, deryamızda ebediyen yüzen sevgi birikim sayacımızı yükseltir.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-1 z-20">
              <div className="text-center font-mono bg-black/50 border border-white/5 rounded-lg px-3 py-1.5 flex-grow">
                <span className="block text-lg font-bold text-red-500">{totalHeartsSent}</span>
                <span className="text-[7px] uppercase tracking-wider text-white/30 block mt-0.5">TOPLAM KALBİMİZ</span>
              </div>

              <button
                onClick={handleSpawnHeart}
                className="bg-[#E50914] hover:bg-[#b81d24] text-white font-sans font-extrabold text-[10px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-all duration-200 shadow-md transform active:scale-95 flex items-center gap-1 bg-gradient-to-r from-red-650 to-red-800"
              >
                ♥ UÇUR
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --------------------- DIALOG MODALS SECTION --------------------- */}

      {/* A. TIME MATH DETAILED MODAL */}
      <AnimatePresence>
        {showMathModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0b0b0d] border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-9 text-left space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowMathModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="space-y-2 border-b border-white/5 pb-4">
                <span className="text-[8px] tracking-[0.3em] font-mono text-gold uppercase font-bold">İstatistik Bilimi</span>
                <h3 className="text-2xl font-serif font-bold text-white leading-none">Aşkımızın Aritmetik Karnesi</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03] space-y-1">
                  <span className="text-[9px] font-mono text-white/40 uppercase">Toplam Yaklaşık Kalp Atışımız</span>
                  <span className="block text-xl font-bold font-mono text-rose-400">{loveMath.beats?.toLocaleString()}</span>
                  <p className="text-[9px] text-white/30 italic">Her tıkta senin için çarptı sevgilim.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03] space-y-1">
                  <span className="text-[9px] font-mono text-white/40 uppercase">Birlikte Alınan Nefes</span>
                  <span className="block text-xl font-bold font-mono text-gold">{loveMath.breaths?.toLocaleString()}</span>
                  <p className="text-[9px] text-white/30 italic">Aynı atmosferde, aynı sevgi nefesiyle.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03] space-y-1">
                  <span className="text-[9px] font-mono text-white/40 uppercase">Eşsiz Gülüşmelerimiz</span>
                  <span className="block text-xl font-bold font-mono text-orange-400">~{loveMath.laughs?.toLocaleString()}</span>
                  <p className="text-[9px] text-white/30 italic">Gözlerinin içi gülünce zaman durur.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/[0.03] space-y-1">
                  <span className="text-[9px] font-mono text-white/40 uppercase">Kurulan Ortak Rüyalar</span>
                  <span className="block text-xl font-bold font-mono text-indigo-400">~{loveMath.dreams?.toLocaleString()}</span>
                  <p className="text-[9px] text-white/30 italic">Bizi buluşturan uykusuz fanteziler.</p>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-gold/5 border border-gold/10 rounded-xl">
                <p className="text-xs font-serif italic text-gold leading-relaxed">
                  "Rakamlar bir deryanın dalgalarını saymaya yetmez sevgilim. Yukarıdaki tüm bu muazzam veriler, seninle geçirdiğim tek bir saniyenin yanında sadece ufak birer gölgedir."
                </p>
              </div>

              <button
                onClick={() => setShowMathModal(false)}
                className="w-full py-3 bg-gold hover:bg-gold-hover text-black uppercase tracking-widest text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Bu Mucizeyi Kabullen ❤️
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* B. COSMIC MATCH ADVERTISING MODAL (HOROSCOPE) */}
      <AnimatePresence>
        {showHoroscopeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0e0e12] border border-gold/30 rounded-2xl max-w-sm w-full p-6 sm:p-7 text-center space-y-5 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowHoroscopeModal(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30 animate-pulse">
                <Star className="w-5 h-5 text-gold fill-gold/10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-serif font-bold text-gold">{getAstroSigns().title}</h4>
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.2em]">Kozmik Yıldız Haritası Analizi</p>
              </div>

              <p className="text-xs text-white/70 font-serif leading-relaxed italic border-t border-white/5 pt-4">
                "{getAstroSigns().body}"
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-white/40">
                <div className="p-2 border border-white/5 rounded">Sevgi Hükmü: %100</div>
                <div className="p-2 border border-white/5 rounded">Sadakat: Ömür Boyu</div>
              </div>

              <button
                onClick={() => setShowHoroscopeModal(false)}
                className="w-full py-2.5 bg-gold hover:bg-gold-hover text-black uppercase tracking-widest text-[9px] font-bold rounded-lg shadow-lg transition-colors cursor-pointer"
              >
                Yıldızlara İnanıyorum ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* C. DETAILED MILESTONE POETIC DIALOG */}
      <AnimatePresence>
        {showMilestoneModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0b0b0e] border border-gold/30 rounded-2xl max-w-sm w-full p-6 sm:p-7 text-center space-y-5 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowMilestoneModal(null)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30">
                <Award className="w-5 h-5 text-gold" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-serif font-bold text-gold">{showMilestoneModal}</h4>
                <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.2em]">Aşk Yolculuğu Defteri</p>
              </div>

              <p className="text-xs text-[#d1d5db] font-serif leading-relaxed italic border-t border-white/5 pt-4">
                "{milestones.find(m => m.label === showMilestoneModal)?.desc || "Bu heyecanlı kilometre taşı bizim ortak zaferimiz!"}"
              </p>

              <div className="p-3 bg-black/40 rounded-lg text-[10px] text-white/40 border border-white/5 text-left font-mono">
                📝 <strong>Ufak Not Defterimiz:</strong> "O gün gökyüzü bir başka güzeldi sevgilim, belki de en güzel kahkahamızı orada saklamıştık."
              </div>

              <button
                onClick={() => setShowMilestoneModal(null)}
                className="w-full py-2.5 bg-gold hover:bg-gold-hover text-black uppercase tracking-widest text-[9px] font-bold rounded-lg shadow-lg transition-colors cursor-pointer"
              >
                Anıyı Onayla
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* D. INTERACTIVE PHOTO LIGHTBOX & VINTAGE FILTERS */}
      <AnimatePresence>
        {showPhotoLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[99] flex flex-col justify-between p-4"
          >
            {/* Lightbox Header toolbar */}
            <div className="flex justify-between items-center py-2 px-1 text-white z-[100]">
              <div>
                <h3 className="text-sm font-serif text-gold">Deryâmızın Hatırası</h3>
                <p className="text-[10px] text-white/30 tracking-wider">Aşkın En Saf/Filtrelenebilir karesi</p>
              </div>
              <button 
                onClick={() => setShowPhotoLightbox(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Immersive Photo Display inside focus space */}
            <div className="flex-grow flex items-center justify-center p-2 relative">
              <div className="max-w-2xl max-h-[70vh] w-full h-full relative border border-white/5 bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                <img
                  src={settings.homePhoto}
                  alt="Aşk Karesi"
                  className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                    photoFilter === "retro" ? "sepia saturate-150 brightness-90" :
                    photoFilter === "sepia" ? "sepia contrast-130 saturate-30" :
                    photoFilter === "eternal_glow" ? "contrast-110 brightness-110 saturate-150 hue-rotate-15 blur-[0.2px]" : ""
                  }`}
                />

                {/* Secret letter hidden inside photocard wax seal */}
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => setRevealPhotoLetter(prev => !prev)}
                    className="p-2 rounded-full border border-gold/40 bg-black/80 text-gold flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest hover:bg-gold hover:text-black transition-all cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current animate-pulse" /> {revealPhotoLetter ? "Mektubu Gizle" : "Mektubu Oku"}
                  </button>
                </div>

                <AnimatePresence>
                  {revealPhotoLetter && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-x-4 bottom-4 top-16 bg-black/90 backdrop-blur-md rounded-lg p-5 border border-gold/30 flex flex-col justify-between text-left"
                    >
                      <div className="space-y-3 overflow-y-auto">
                        <div className="flex items-center gap-1 text-gold">
                          <Compass className="w-4 h-4" />
                          <h4 className="text-sm font-serif font-bold">Fotoğrafın Saklı Gizemi</h4>
                        </div>
                        <p className="text-xs text-white/80 font-serif leading-relaxed italic">
                          "Derya sevgilim, bu fotoğrafa her baktığımda zaman duruyor. Senin yanındaki o dingin huzur, bana hayatın tüm telaşını unutturuyor. Seni tüm kalbimle seviyorum..."
                        </p>
                      </div>
                      <p className="text-[10px] text-gold font-mono italic text-right mt-2 border-t border-white/5 pt-2">#KalbimdekiSonsuzDerya</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick interactive filters toolbar on bottom */}
            <div className="space-y-3 pb-4 z-[100] max-w-lg mx-auto w-full">
              <p className="text-center text-[9px] font-mono text-white/40 uppercase tracking-widest">Görsel Filtreyi Değiştirerek hissi yakala sevgilim:</p>
              <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-center">
                {[
                  { id: "none", name: "Original" },
                  { id: "retro", name: "Retro Isı" },
                  { id: "sepia", name: "Nostalji" },
                  { id: "eternal_glow", name: "Ebedi Işık" }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setPhotoFilter(filter.id as any)}
                    className={`py-2 px-1 rounded border transition-all cursor-pointer uppercase text-[9px] font-semibold tracking-wider ${
                      photoFilter === filter.id
                        ? "bg-gold border-gold text-black font-extrabold shadow-lg"
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
