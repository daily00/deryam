import React, { useState, useEffect } from "react";
import { 
  Heart, Plus, Trash2, Download, Sparkles, Upload, X, Search, Filter, Check, Eye 
} from "lucide-react";
import { AdminSettings } from "../types";

interface Pair {
  id: string;
  title: string;
  category: "anime" | "film" | "dizi" | "cartoon" | "ozel";
  p1Image: string; // Base64 or Unsplash URL
  p2Image: string; // Base64 or Unsplash URL
  isCustom?: boolean;
}

interface CoupleProfilesViewProps {
  settings: AdminSettings;
}

const PRESEEDED_PROFILES: Pair[] = [
  {
    id: "pre-1",
    title: "Taki & Mitsuha (Your Name)",
    category: "anime",
    p1Image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&fit=crop",
    p2Image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&fit=crop",
    isCustom: false
  },
  {
    id: "pre-2",
    title: "Howl & Sophie (Howl's Moving Castle)",
    category: "anime",
    p1Image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&fit=crop",
    p2Image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop",
    isCustom: false
  },
  {
    id: "pre-3",
    title: "Spider-Man & Gwen Stacy",
    category: "film",
    p1Image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&fit=crop",
    p2Image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&fit=crop",
    isCustom: false
  },
  {
    id: "pre-4",
    title: "Jack & Rose (Titanic)",
    category: "film",
    p1Image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&h=300&fit=crop",
    p2Image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&h=300&fit=crop",
    isCustom: false
  },
  {
    id: "pre-5",
    title: "Mickey & Minnie Mouse",
    category: "cartoon",
    p1Image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=300&fit=crop",
    p2Image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=300&fit=crop",
    isCustom: false
  }
];

export default function CoupleProfilesView({ settings }: CoupleProfilesViewProps) {
  const p1 = settings.partnerName1 || "Derya";
  const p2 = settings.partnerName2 || "Yusuf";

  const [pairs, setPairs] = useState<Pair[]>(() => {
    try {
      const saved = localStorage.getItem("deryaflix_couple_profiles_v1");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading saved profiles:", e);
    }
    return PRESEEDED_PROFILES;
  });

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"anime" | "film" | "dizi" | "cartoon" | "ozel">("anime");
  const [p1FileBase64, setP1FileBase64] = useState<string>("");
  const [p2FileBase64, setP2FileBase64] = useState<string>("");
  const [isUploadingP1, setIsUploadingP1] = useState(false);
  const [isUploadingP2, setIsUploadingP2] = useState(false);

  // Zoom / Preview State
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("deryaflix_couple_profiles_v1", JSON.stringify(pairs));
  }, [pairs]);

  // Image resize helper to compress to ~250x250 pixels for localStorage sanity
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
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
            // Low quality JPEG to save lots of space
            const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isP1: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isP1) {
      setIsUploadingP1(true);
      try {
        const base64 = await resizeImage(file);
        setP1FileBase64(base64);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploadingP1(false);
      }
    } else {
      setIsUploadingP2(true);
      try {
        const base64 = await resizeImage(file);
        setP2FileBase64(base64);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploadingP2(false);
      }
    }
  };

  const handleSavePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (!p1FileBase64 || !p2FileBase64) return;

    const newPair: Pair = {
      id: "custom-" + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      p1Image: p1FileBase64,
      p2Image: p2FileBase64,
      isCustom: true
    };

    setPairs((prev) => [newPair, ...prev]);
    // Reset Form
    setNewTitle("");
    setNewCategory("anime");
    setP1FileBase64("");
    setP2FileBase64("");
    setShowAddModal(false);
  };

  const handleDeletePair = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDeletePair = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPairs((prev) => prev.filter((p) => p.id !== id));
    if (selectedPair?.id === id) {
      setSelectedPair(null);
    }
    setDeletingId(null);
  };

  const cancelDeletePair = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  const handleDownloadImage = (base64OrUrl: string, fileName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Create virtual download element
    const link = document.createElement("a");
    link.href = base64OrUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPairs = pairs.filter((pair) => {
    const matchesCategory = filterCategory === "all" || 
      (filterCategory === "custom" && pair.isCustom) ||
      pair.category === filterCategory;

    const matchesSearch = pair.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 animate-fade-in text-[#e1e1e1]" id="couple-profiles-container">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#E50914] mb-2">
            <Sparkles className="w-4 h-4 fill-current text-[#E50914]" />
            <span className="text-xs font-mono font-bold tracking-[0.18em] uppercase">Netflix Ortak Profil Galerisi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans max-w-xl">
            ÇİFT PROFİLLERİMİZ
          </h1>
          <p className="text-xs sm:text-sm text-white/50 max-w-2xl mt-2 leading-relaxed">
            Seninle Discord, WhatsApp, Netflix veya dilediğimiz herhangi bir yerde birlikte kullanabileceğimiz, bizim en sevdiğimiz karakter eşleşmelerimiz! Cihazından özel görseller yükleyerek kendi arşivimizi genişletebilirsin.
          </p>
        </div>

        {/* Primary CTA: Add pair */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 self-start bg-[#E50914] hover:bg-[#b80710] text-white px-5 py-3 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-[#E50914]/15 active:scale-95 cursor-pointer relative overflow-hidden"
          id="add-profile-pair-btn"
        >
          <Plus className="w-4.5 h-4.5" />
          YENİ PROFİL ÇİFTİ EKLE
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Toplam Çift</p>
          <p className="text-2xl font-black text-white mt-1">{pairs.length} Eşleşme</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Bizim Yüklediklerimiz</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{pairs.filter(p => p.isCustom).length} Özel</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Anime Temalı</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{pairs.filter(p => p.category === "anime").length} Takım</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Film & Dizi</p>
          <p className="text-2xl font-black text-gold mt-1">{pairs.filter(p => p.category === "film" || p.category === "dizi").length} Takım</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-lg w-full sm:w-auto overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: "TÜMÜ" },
            { id: "anime", label: "ANİME" },
            { id: "film", label: "FİLM & DİZİ" },
            { id: "cartoon", label: "KARTON" },
            { id: "custom", label: "YÜKLEDİKLERİMİZ" }
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
            placeholder="Karakter çifti ara..."
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

      {/* Pairs Grid Layout */}
      {filteredPairs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPairs.map((pair) => (
            <div
              key={pair.id}
              onClick={() => setSelectedPair(pair)}
              className="bg-[#141414]/90 border border-white/5 hover:border-white/15 rounded-xl p-5 hover:bg-[#181818] transition-all duration-300 group cursor-pointer relative shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Deletion Confirmation Overlay */}
              {deletingId === pair.id && (
                <div 
                  className="absolute inset-0 bg-[#0f0f12]/98 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-4 text-center animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-8 h-8 text-[#E50914] mb-2.5 animate-bounce" />
                  <p className="text-sm font-black text-white uppercase tracking-wider mb-1">BU ÇİFTİ SİLELİM Mİ?</p>
                  <p className="text-[11px] text-white/50 max-w-[220px] mb-4 font-sans leading-relaxed">
                    "{pair.title}" profil eşleşmesini kalıcı olarak silmek istediğinden emin misin?
                  </p>
                  <div className="flex items-center gap-2 w-full max-w-[200px]">
                    <button
                      onClick={(e) => cancelDeletePair(e)}
                      className="w-1/2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-wider py-1.5 rounded uppercase border border-white/10 transition-colors cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      onClick={(e) => confirmDeletePair(pair.id, e)}
                      className="w-1/2 bg-[#E50914] hover:bg-[#b80710] text-white text-[10px] font-bold tracking-wider py-1.5 rounded uppercase transition-all shadow-md shadow-[#E50914]/20 cursor-pointer"
                    >
                      Evet, Sil
                    </button>
                  </div>
                </div>
              )}

              {/* Back ambient glow on hover */}
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#E50914]/0 via-transparent to-[#E50914]/0 group-hover:from-[#E50914]/5 transition-all duration-500 rounded-xl" />

              <div className="relative z-10">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[9px] font-mono tracking-widest text-[#E50914] font-bold bg-[#E50914]/10 border border-[#E50914]/20 px-2 py-0.5 rounded uppercase">
                    {pair.category === "ozel" ? "ÖZEL PP" : pair.category}
                  </span>
                  
                  <button
                    onClick={(e) => handleDeletePair(pair.id, e)}
                    className="text-white/30 hover:text-red-500 p-1.5 rounded bg-white/5 hover:bg-white/10 transition-all active:scale-90"
                    title="Eşleşmeyi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Character Name */}
                <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors truncate mb-5">
                  {pair.title}
                </h3>

                {/* Avatars Side-by-side Layout with matching romance design */}
                <div className="flex items-center justify-center gap-6 relative py-4">
                  
                  {/* Left avatar frame (Derya) */}
                  <div className="flex flex-col items-center gap-2 select-none relative">
                    <span className="absolute -top-1 px-1.5 py-0.5 bg-rose-500 text-[8px] font-bold text-white rounded font-mono shadow-md z-20">
                      {p1.toUpperCase()}
                    </span>
                    <div className="w-20 h-20 rounded-full border-2 border-rose-500/60 group-hover:border-rose-500 shadow-xl overflow-hidden relative group-hover:scale-105 transition-all duration-300">
                      <img 
                        src={pair.p1Image} 
                        alt={`${p1} profil`}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Connecting Heart Icon with animated wave */}
                  <div className="flex flex-col items-center justify-center relative w-12 text-white/30 group-hover:text-[#E50914] transition-colors duration-300">
                    <Heart className="w-5 h-5 fill-current animate-pulse shrink-0" />
                    <div className="h-0.5 w-12 bg-gradient-to-r from-rose-500/40 to-indigo-500/40 absolute -z-0" />
                  </div>

                  {/* Right avatar frame (Yusuf) */}
                  <div className="flex flex-col items-center gap-2 select-none relative">
                    <span className="absolute -top-1 px-1.5 py-0.5 bg-indigo-500 text-[8px] font-bold text-white rounded font-mono shadow-md z-20">
                      {p2.toUpperCase()}
                    </span>
                    <div className="w-20 h-20 rounded-full border-2 border-indigo-500/60 group-hover:border-indigo-500 shadow-xl overflow-hidden relative group-hover:scale-105 transition-all duration-300">
                      <img 
                        src={pair.p2Image} 
                        alt={`${p2} profil`}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Action indicators at bottom of card */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px] text-white/40 font-mono relative z-10 w-full">
                <span className="flex items-center gap-1.5 group-hover:text-white/60 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  Görüntüle & İndir
                </span>
                <span className="text-white/20 select-none">#deryaflix</span>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-black/30 border border-white/5 rounded-xl">
          <Heart className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/55 font-sans">Eşleşen profil bulunamadı.</p>
          <p className="text-[11px] text-white/30 font-mono mt-1">Arama terimini değiştirerek veya yeni bir çift ekleyerek deneyebilirsin.</p>
        </div>
      )}

      {/* MODAL 1: Add New Couple Profile */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-xl overflow-hidden relative shadow-2xl z-10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-[#E50914]" />
                <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">YENİ ÇİFT PROFİLİ EKLE</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePair} className="p-5 space-y-5 overflow-y-auto">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Eşleşme Adı / Karakter Bilgisi</label>
                <input
                  type="text"
                  required
                  placeholder="Örnek: Zenitsu & Nezuko (Demon Slayer)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>

              {/* Class/Category Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer"
                >
                  <option value="anime">Anime</option>
                  <option value="film">Film</option>
                  <option value="dizi">Dizi</option>
                  <option value="cartoon">Karton / Çizgi Film</option>
                  <option value="ozel">Özel Fotoğraflar</option>
                </select>
              </div>

              {/* Upload Dropzones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Partner 1 image upload (Derya) */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest font-mono bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-center self-stretch mb-1">
                    {p1} PROFİLİ (SOL)
                  </span>

                  <div className="w-full h-40 border border-dashed border-white/10 hover:border-rose-500/50 rounded-lg overflow-hidden relative flex flex-col items-center justify-center bg-black/20 transition-all group">
                    {isUploadingP1 ? (
                      <span className="text-[10px] text-white/40 font-mono">Resim işleniyor...</span>
                    ) : p1FileBase64 ? (
                      <>
                        <img 
                          src={p1FileBase64} 
                          alt="Derya preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setP1FileBase64("")}
                          className="absolute right-2 top-2 bg-black/70 text-white rounded-full p-1 border border-white/10 hover:bg-rose-500 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-3 text-center">
                        <Upload className="w-6 h-6 text-white/30 group-hover:text-rose-400 transition-colors mb-2" />
                        <span className="text-[11px] text-white/50 tracking-wide">Tıkla ve Dosya Seç</span>
                        <span className="text-[9px] text-white/30 mt-0.5">JPEG veya PNG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Partner 2 image upload (Yusuf) */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-center self-stretch mb-1">
                    {p2} PROFİLİ (SAĞ)
                  </span>

                  <div className="w-full h-40 border border-dashed border-white/10 hover:border-indigo-500/50 rounded-lg overflow-hidden relative flex flex-col items-center justify-center bg-black/20 transition-all group">
                    {isUploadingP2 ? (
                      <span className="text-[10px] text-white/40 font-mono">Resim işleniyor...</span>
                    ) : p2FileBase64 ? (
                      <>
                        <img 
                          src={p2FileBase64} 
                          alt="Yusuf preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setP2FileBase64("")}
                          className="absolute right-2 top-2 bg-black/70 text-white rounded-full p-1 border border-white/10 hover:bg-indigo-500 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-3 text-center">
                        <Upload className="w-6 h-6 text-white/30 group-hover:text-indigo-400 transition-colors mb-2" />
                        <span className="text-[11px] text-white/50 tracking-wide">Tıkla ve Dosya Seç</span>
                        <span className="text-[9px] text-white/30 mt-0.5">JPEG veya PNG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>

              {/* Info text box */}
              <div className="bg-black/35 border border-white/5 p-3 rounded-lg flex items-start gap-2">
                <Heart className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/50 tracking-wide leading-relaxed">
                  Yüklediğin fotoğraflar, tarayıcının yerel belleğinde saklanmak üzere otomatik olarak hafif bir boyuta sıkıştırılır. Böylece sayfalar hızlı açılır ve belleğin dolması engellenir!
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider"
                >
                  İPTAL
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !p1FileBase64 || !p2FileBase64}
                  className="w-1/2 bg-[#E50914] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b80710] text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-all"
                >
                  KAYDET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Cinema Mode Preview */}
      {selectedPair && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0"
            onClick={() => setSelectedPair(null)}
          />
          <div className="bg-[#0f0f12] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden relative shadow-2xl z-10 flex flex-col p-6 max-h-[95vh] text-center">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="text-left">
                <span className="text-[9px] font-mono tracking-widest text-[#E50914] font-bold bg-[#E50914]/10 border border-[#E50914]/20 px-2 py-0.5 rounded uppercase">
                  ÇİFT PROFİL AYRINTILARI
                </span>
                <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight">{selectedPair.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedPair(null)}
                className="text-white/50 hover:text-white bg-white/5 rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Showcase pair Side-by-side inside cinema aspect-ratio background */}
            <div className="flex-grow flex flex-col items-center justify-center bg-black/40 border border-white/5 p-8 rounded-xl relative py-12 mb-6 shadow-inner">
              {/* Back ambient radial red-gold flash glow */}
              <div className="absolute w-1/2 h-1/2 bg-[#E50914]/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-14 relative z-10 mb-8">
                
                {/* Left (Derya) circular frame */}
                <div className="flex flex-col items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-rose-500 text-[9px] font-bold text-white rounded font-mono shadow-md">
                    {p1.toUpperCase()}
                  </span>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-rose-500 shadow-2xl overflow-hidden group">
                    <img 
                      src={selectedPair.p1Image} 
                      alt="Derya big view" 
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                  <button
                    onClick={() => handleDownloadImage(selectedPair.p1Image, `${selectedPair.title.replace(/\s+/g, '_')}_${p1}.jpg`)}
                    className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    KULLANICI 1 İNDİR
                  </button>
                </div>

                {/* Romance connector heart */}
                <div className="flex flex-col items-center justify-center select-none text-[#E50914]">
                  <Heart className="w-8 h-8 fill-current animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono opacity-50 tracking-wide mt-1">SONSUZ AŞK</span>
                </div>

                {/* Right (Yusuf) circular frame */}
                <div className="flex flex-col items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-indigo-500 text-[9px] font-bold text-white rounded font-mono shadow-md">
                    {p2.toUpperCase()}
                  </span>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-indigo-500 shadow-2xl overflow-hidden group">
                    <img 
                      src={selectedPair.p2Image} 
                      alt="Yusuf big view" 
                      className="w-full h-full object-cover select-none"
                    />
                  </div>
                  <button
                    onClick={() => handleDownloadImage(selectedPair.p2Image, `${selectedPair.title.replace(/\s+/g, '_')}_${p2}.jpg`)}
                    className="flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/20 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    KULLANICI 2 İNDİR
                  </button>
                </div>

              </div>

              <div className="text-white/40 text-[11px] font-mono flex items-center justify-center gap-1.5 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                İndirdiğin fotoğrafları profil resmin yaparak anında uyum yakala!
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  if (window.confirm(`"${selectedPair.title}" çift pp eşleşmesini silmek istediğinden emin misin sevgilim?`)) {
                    setPairs((prev) => prev.filter((p) => p.id !== selectedPair.id));
                    setSelectedPair(null);
                  }
                }}
                className="w-1/3 bg-white/5 hover:bg-[#E50914]/10 text-rose-450 hover:text-rose-400 border border-white/5 hover:border-[#E50914]/20 py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all"
              >
                Bu Çifti Sil
              </button>
              <button
                onClick={() => setSelectedPair(null)}
                className="w-2/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg text-xs tracking-wider uppercase border border-white/10 transition-all font-sans"
              >
                CINEMA PENCERESİNİ KAPAT
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
