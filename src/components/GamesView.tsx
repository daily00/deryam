import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Download, Sparkles, Upload, X, Search, Heart, 
  MapPin, Calendar, Compass, Award, Star, Eye, StarHalf, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminSettings, GameProgress } from "../types";

interface Memory {
  id: string;
  title: string;
  location: string;
  date: string;
  category: "Geziler" | "Kafeler" | "Doğa" | "Kültür" | "Aşk Köşemiz";
  story: string;
  rating: number; // 1-10 hearts score
  image: string; // Base64 or Unsplash URL
  isCustom?: boolean;
}

interface GamesViewProps {
  settings: AdminSettings;
  progress: GameProgress;
  setProgress: (p: GameProgress) => void;
  setTab: (tab: string) => void;
}

const DEFAULT_MEMORIES: Memory[] = [
  {
    id: "mem-1",
    title: "Galata Kulesi Çevresinde Yağmurlu Yürüyüş",
    location: "Karaköy, İstanbul",
    date: "2024-11-23",
    category: "Geziler",
    story: "Soğuk bir sonbahar gününde yağmura hiç aldırmadan, el ele kuleye doğru tırmanışımız... Karşılıklı en sevdiğimiz kafede sıcak sahlep içerken gözlerinin içine ilk kez bu kadar derinden bakmıştım. Kalbimin ritmini orada unuttum sevgilim.",
    rating: 10,
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=650&auto=format&fit=crop",
    isCustom: false
  },
  {
    id: "mem-2",
    title: "En Sevdiğimiz Kitap Kahvesi Keşfi",
    location: "Karaköy, İstanbul",
    date: "2025-02-14",
    category: "Kafeler",
    story: "Arka fonda çalan hafif caz tınıları eşliğinde, birbirimize kitapların en sevdiğimiz satırlarını fısıldadığımız, zamanın durduğu o sakin derya akşamı. Kokun, kahve kokusuyla birbirine karışmıştı.",
    rating: 9,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=650&auto=format&fit=crop",
    isCustom: false
  },
  {
    id: "mem-3",
    title: "Kapadokya'da Büyülü Gün Doğumu",
    location: "Göreme, Nevşehir",
    date: "2025-05-18",
    category: "Doğa",
    story: "Sabahın ilk ışıklarında rengarenk dev balonların gökyüzüne süzülüşünü yan yana izlemek... Kalın bir battaniyenin altında titrerken senin bana sarılman tüm evreni ısıtmıştı sevgilim.",
    rating: 10,
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=650&auto=format&fit=crop",
    isCustom: false
  },
  {
    id: "mem-4",
    title: "Moda Sahilinde Dalga Sesleri",
    location: "Kadıköy, İstanbul",
    date: "2024-07-06",
    category: "Aşk Köşemiz",
    story: "Çimlerin üzerine uzanıp kulaklığın tekini senin o güzel kulağına taktığım an... Denizden gelen tatlı esinti eşliğinde 'bizim şarkımızı' mırıldanıp yıldızların altında kaybolmuştuk.",
    rating: 10,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=650&auto=format&fit=crop",
    isCustom: false
  }
];

export default function GamesView({ settings, progress, setProgress, setTab }: GamesViewProps) {
  const p1 = settings.partnerName1 || "Derya";
  const p2 = settings.partnerName2 || "Yusuf";

  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem("deryaflix_visited_memories_v1");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading saved memories:", e);
    }
    return DEFAULT_MEMORIES;
  });

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState<"Geziler" | "Kafeler" | "Doğa" | "Kültür" | "Aşk Köşemiz">("Geziler");
  const [newStory, setNewStory] = useState("");
  const [newRating, setNewRating] = useState<number>(10);
  const [newImageBase64, setNewImageBase64] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Selected for full cinematic display
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    localStorage.setItem("deryaflix_visited_memories_v1", JSON.stringify(memories));
  }, [memories]);

  // Handle custom audio synthesizer beep for modern game sound effects
  const playLovelyChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // Slide to A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) {}
  };

  // Image resizing to prevent localStorage exhaustion
  const resizeMemoryImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 350;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            resolve(dataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => reject("Resim yüklenemedi");
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject("Dosya okunamadı");
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64 = await resizeMemoryImage(file);
      setNewImageBase64(base64);
      playLovelyChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim() || !newDate || !newStory.trim() || !newImageBase64) return;

    const newMemory: Memory = {
      id: "mem-" + Date.now(),
      title: newTitle.trim(),
      location: newLocation.trim(),
      date: newDate,
      category: newCategory,
      story: newStory.trim(),
      rating: newRating,
      image: newImageBase64,
      isCustom: true
    };

    setMemories((prev) => [newMemory, ...prev]);
    playLovelyChime();

    // Reset Form
    setNewTitle("");
    setNewLocation("");
    setNewDate("");
    setNewCategory("Geziler");
    setNewStory("");
    setNewRating(10);
    setNewImageBase64("");
    setShowAddModal(false);
  };

  const handleDeleteMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDeleteMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
    setDeletingId(null);
  };

  const cancelDeleteMemory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  const handleDownloadImage = (base64OrUrl: string, fileName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement("a");
    link.href = base64OrUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMemories = memories.filter((memory) => {
    const matchesCategory = filterCategory === "all" || 
      (filterCategory === "YÜKLEDİKLERİMİZ" && memory.isCustom) ||
      memory.category === filterCategory;

    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.story.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: memories.length,
    cities: Array.from(new Set(memories.map((m) => m.location.split(",").pop()?.trim()))).length,
    custom: memories.filter((m) => m.isCustom).length,
    averageRating: (memories.reduce((acc, m) => acc + m.rating, 0) / (memories.length || 1)).toFixed(1)
  };

  // Auto unlocked Sır adası if they visited more than 3 place
  useEffect(() => {
    if (memories.length >= 3 && !progress.isUnlockedExplicitly) {
      setProgress({
        ...progress,
        game1Completed: true,
        game2Completed: true,
        game3Completed: true,
        game4Completed: true,
        isUnlockedExplicitly: true
      });
    }
  }, [memories, progress, setProgress]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 animate-fade-in text-[#e1e1e1]" id="memories-visited-places-view">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#E50914] mb-2">
            <Compass className="w-4 h-4 animate-spin-slow text-[#E50914]" />
            <span className="text-xs font-mono font-bold tracking-[0.18em] uppercase">Gezdiğimiz & Değerli Anılarımız</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans max-w-xl">
            ORTAK ANILARIMIZ
          </h1>
          <p className="text-xs sm:text-sm text-white/50 max-w-2xl mt-2 leading-relaxed">
            Seninle el ele verip geçtiğimiz yollar, yudumladığımız kahveler, tatlı derya fısıltılarımız ve iz bıraktığımız her bir eşsiz konum! Bu sayfa bizim ortak aşk haritamızdır. Cihazından özel görsellerle yeni anı parçaları ekleyebilirsin.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 self-start bg-[#E50914] hover:bg-[#b80710] text-white px-5 py-3 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-[#E50914]/15 active:scale-95 cursor-pointer"
          id="add-memory-button"
        >
          <Plus className="w-4.5 h-4.5" />
          YENİ ANI PARÇASI EKLE
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Toplam Konum</p>
          <p className="text-2xl font-black text-white mt-1">{stats.total} Anı Karesi</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Eşsiz Şehir & İlçe</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{stats.cities} Nokta</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Bizim Defterimiz</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{stats.custom} İlave</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Ortalama Mutluluk</p>
          <p className="text-2xl font-black text-gold mt-1 flex items-center gap-1">
            {stats.averageRating} <Heart className="w-5 h-5 fill-current text-gold animate-pulse text-xs shrink-0" />
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-lg w-full sm:w-auto overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: "TÜMÜ" },
            { id: "Geziler", label: "GEZİLER" },
            { id: "Kafeler", label: "KAFELER" },
            { id: "Doğa", label: "DOĞA & KAMP" },
            { id: "Aşk Köşemiz", label: "ÖZEL KÖŞEMİZ" },
            { id: "YÜKLEDİKLERİMİZ", label: "YÜKLEDİKLERİMİZ" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-wider rounded transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === tab.id 
                  ? "bg-[#E50914] text-white" 
                  : "text-white/45 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Anılarda ve yerlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#E50914] transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secret Room hint notice if they haven't explicitly unlocked it */}
      {!progress.isUnlockedExplicitly && (
        <div className="bg-[#E50914]/10 border border-[#E50914]/25 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-[#E50914] fill-current animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Sır Odası Anahtarı Yolculuğu</p>
              <p className="text-[11px] text-white/60">En az 3 adet gezdiğimiz yer veya anı karesi barındırarak Sır Odası kapısını anında aralayabilirsin sevgilim!</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-gold bg-gold/15 border border-gold/30 px-3 py-1 rounded">
            Mevcut: {memories.length}/3 Anı Karesi
          </span>
        </div>
      )}

      {/* Memories Grid Layout */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              className="bg-[#141414]/90 border border-white/5 hover:border-white/15 rounded-xl hover:bg-[#181818] transition-all duration-300 group cursor-pointer relative shadow-lg hover:shadow-2xl overflow-hidden flex flex-col h-[380px]"
            >
              
              {/* Deletion Confirmation Overlay */}
              {deletingId === memory.id && (
                <div 
                  className="absolute inset-0 bg-[#0f0f12]/98 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-4 text-center animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-8 h-8 text-[#E50914] mb-2.5 animate-bounce" />
                  <p className="text-sm font-black text-white uppercase tracking-wider mb-1">BU ANIYI SİLELİM Mİ?</p>
                  <p className="text-[11px] text-white/50 max-w-[220px] mb-4 font-sans leading-relaxed">
                    "{memory.title}" anısını günlüğümüzden tamamen silmek istediğinden emin misin?
                  </p>
                  <div className="flex items-center gap-2 w-full max-w-[200px]">
                    <button
                      onClick={(e) => cancelDeleteMemory(e)}
                      className="w-1/2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-wider py-1.5 rounded uppercase border border-white/10 transition-colors cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      onClick={(e) => confirmDeleteMemory(memory.id, e)}
                      className="w-1/2 bg-[#E50914] hover:bg-[#b80710] text-white text-[10px] font-bold tracking-wider py-1.5 rounded uppercase transition-all shadow-md shadow-[#E50914]/20 cursor-pointer"
                    >
                      Evet, Sil
                    </button>
                  </div>
                </div>
              )}

              {/* Memory Photo Banner */}
              <div className="w-full h-44 overflow-hidden relative">
                <img 
                  src={memory.image} 
                  alt={memory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Category Label */}
                <span className="absolute top-3 left-3 text-[8px] font-mono tracking-widest text-[#E50914] font-bold bg-black/75 border border-white/10 px-2 py-0.5 rounded-full uppercase">
                  {memory.category}
                </span>

                {/* Rating overlay banner */}
                <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/75 border border-white/10 px-2 py-0.5 rounded-full text-gold">
                  <Star className="w-3 h-3 fill-current text-gold shrink-0" />
                  <span className="text-[9px] font-mono font-bold">{memory.rating}</span>
                </div>

                {/* Cover dynamic darken gradient on bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent pointer-events-none" />
              </div>

              {/* Memory content portion */}
              <div className="p-4 flex-grow flex flex-col justify-between relative z-10 -mt-2">
                <div className="space-y-1.5">
                  
                  {/* Meta date and loc */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      {new Date(memory.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 max-w-[130px] truncate text-right">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {memory.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white group-hover:text-gold transition-colors line-clamp-1">
                    {memory.title}
                  </h3>

                  {/* Story preview cut-off */}
                  <p className="text-[11px] text-white/50 font-sans leading-relaxed line-clamp-3">
                    {memory.story}
                  </p>
                </div>

                {/* Bottom line layout with delete option */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-2.5">
                  <span className="text-[10px] font-mono tracking-wider text-gold flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3.5 h-3.5" /> Detayları Oku
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteMemory(memory.id, e)}
                      className="text-white/30 hover:text-red-500 p-1.5 rounded hover:bg-white/5 transition-all active:scale-95"
                      title="Anı Parçasını Günlükten Sil"
                      id={`delete-memory-${memory.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-black/30 border border-white/5 rounded-xl">
          <Compass className="w-8 h-8 text-white/10 mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-white/55 font-sans">Eşleşen anı parçası bulunamadı.</p>
          <p className="text-[11px] text-white/30 font-mono mt-1">Arama terimini değiştirebilir veya "Yeni Anı Parçası Ekle" diyerek hemen bir tatil/kafe hatırası kaydedebilirsin.</p>
        </div>
      )}

      {/* MODAL 1: Add New Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-xl overflow-hidden relative shadow-2xl z-10 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Compass className="w-4.5 h-4.5 text-[#E50914] animate-spin-slow" />
                <h3 className="text-xs font-black text-white font-mono uppercase tracking-wider">YENİ ANI PARÇASI EKLE</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMemory} className="p-5 space-y-4.5 overflow-y-auto">
              
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Anı Başlığı / Özel An</label>
                <input
                  type="text"
                  required
                  placeholder="Örnek: Moda Sahili Gün Batımı Pikniği"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>

              {/* Grid 1: Loc and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Konum (Şehir, İlçe)</label>
                  <input
                    type="text"
                    required
                    placeholder="Örnek: Kadıköy, İstanbul"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Tarih</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Grid 2: Category and Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer"
                  >
                    <option value="Geziler">Geziler</option>
                    <option value="Kafeler">Kafeler</option>
                    <option value="Doğa">Doğa & Kamp</option>
                    <option value="Kültür">Kültür & Sanat</option>
                    <option value="Aşk Köşemiz">Bizim Aşk Köşemiz</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Mutluluk Puanı ({newRating}/10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={newRating}
                    onChange={(e) => setNewRating(parseInt(e.target.value))}
                    className="w-full accent-[#E50914] text-rose-500 cursor-pointer h-7 bg-transparent rounded-lg"
                  />
                </div>
              </div>

              {/* Image upload dragzone */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Anı Görseli (Fotoğraf yükle sevgilim)</label>
                
                <div className="w-full h-36 border border-dashed border-white/10 hover:border-[#E50914]/50 rounded-lg overflow-hidden relative flex flex-col items-center justify-center bg-black/20 transition-all group">
                  {isUploading ? (
                    <span className="text-[10px] text-white/40 font-mono">Resim işleniyor...</span>
                  ) : newImageBase64 ? (
                    <>
                      <img 
                        src={newImageBase64} 
                        alt="Memory upload preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setNewImageBase64("")}
                        className="absolute right-2 top-2 bg-black/75 text-white rounded-full p-1 border border-white/10 hover:bg-[#E50914] transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-3 text-center">
                      <Upload className="w-6 h-6 text-white/30 group-hover:text-[#E50914] transition-colors mb-2" />
                      <span className="text-[11px] text-white/50 tracking-wide">Cihazından Bir Fotoğraf Seç</span>
                      <span className="text-[9px] text-white/30 mt-0.5 font-mono">JPEG veya PNG</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Story Description input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Anımızın Hikayesi / Notun</label>
                <textarea
                  required
                  rows={3}
                  placeholder={`Oraya gittiğimizde neler yaşadık, senin kalbini ne eritti? Detaylıca yaz sevgilim, aşkımızın bir hatırası olarak kalacak...`}
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs sm:text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Submit panel */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-colors"
                >
                  İPTAL
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newLocation.trim() || !newDate || !newStory.trim() || !newImageBase64}
                  className="w-1/2 bg-[#E50914] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b80710] text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-all"
                >
                  ANIYI KAYDET
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: Full Screen Cinematic Memory Details View */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0"
            onClick={() => setSelectedMemory(null)}
          />
          <div className="bg-[#111115] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden relative shadow-2xl z-10 flex flex-col max-h-[92vh]">
            
            {/* Upper bar with Close */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest text-[#E50914] font-bold bg-[#E50914]/10 border border-[#E50914]/20 px-2.5 py-0.5 rounded uppercase">
                  {selectedMemory.category.toUpperCase()} — DETAYLI ANI KARESİ
                </span>
              </div>
              <button 
                onClick={() => setSelectedMemory(null)}
                className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cinematic body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Giant Showcase picture */}
              <div className="relative w-full h-[260px] sm:h-[320px] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                <img 
                  src={selectedMemory.image} 
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Visual heart details filter banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {selectedMemory.location}
                    </span>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-xs text-rose-300 font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      {new Date(selectedMemory.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title and Rating indicators */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedMemory.title}
                  </h2>
                  <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 px-3.5 py-1.5 rounded-full text-gold shrink-0 self-start sm:self-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold">AŞK SKORU:</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Heart 
                          key={i} 
                          className={`w-3.5 h-3.5 shrink-0 ${
                            i < selectedMemory.rating 
                              ? "fill-current text-[#E50914]" 
                              : "text-white/20"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hand-written letter layout for our story snippet */}
                <div className="relative">
                  {/* Decorative quote signs */}
                  <span className="absolute -top-3 -left-3 text-5xl font-serif text-[#E50914]/20 pointer-events-none select-none">“</span>
                  <div className="bg-black/30 border-l-4 border-[#E50914] p-5 sm:p-6 rounded-r-xl italic font-serif text-white/90 text-sm leading-relaxed sm:text-base whitespace-pre-wrap">
                    {selectedMemory.story}
                  </div>
                  <span className="absolute -bottom-10 -right-2 text-5xl font-serif text-[#E50914]/20 pointer-events-none select-none">”</span>
                </div>

                {/* Romantic signature line */}
                <div className="flex items-center justify-end gap-2 text-xs font-mono text-white/40 pt-4">
                  <span>{p1}</span>
                  <Heart className="w-3 h-3 text-[#E50914] fill-current animate-pulse" />
                  <span>{p2}</span>
                </div>

              </div>

            </div>

            {/* Bottom action bar */}
            <div className="flex items-center gap-2 p-4 border-t border-white/5">
              <button
                onClick={(e) => handleDownloadImage(selectedMemory.image, `${selectedMemory.title.replace(/\s+/g, '_')}.jpg`, e)}
                className="w-1/2 flex items-center justify-center gap-1.5 bg-[#E50914]/10 hover:bg-[#E50914] text-white font-bold py-3 rounded-lg text-xs tracking-wider uppercase border border-[#E50914]/25 transition-all"
              >
                <Download className="w-4 h-4" />
                FOTOĞRAFI İNDİR
              </button>
              <button
                onClick={() => setSelectedMemory(null)}
                className="w-1/2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg text-xs tracking-wider uppercase border border-white/10 transition-all"
              >
                KAPAT
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
