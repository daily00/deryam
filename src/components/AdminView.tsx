/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Save, RefreshCw, Upload, Sparkles, Image, Settings, Lock, HelpCircle, FileText, CheckCircle2, Youtube, Video, Music, Plus, Trash2, Download, Copy, Share2 } from "lucide-react";
import { AdminSettings, GameProgress } from "../types";
import { DEFAULT_SETTINGS, DEFAULT_PROGRESS } from "../utils/storage";

interface AdminViewProps {
  settings: AdminSettings;
  setSettings: (s: AdminSettings) => void;
  progress: GameProgress;
  setProgress: (p: GameProgress) => void;
}

export default function AdminView({ settings, setSettings, progress, setProgress }: AdminViewProps) {
  const [localSettings, setLocalSettings] = useState<AdminSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state variables
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [copied, setCopied] = useState(false);

  // Tab state within Admin Panel
  const [adminTab, setAdminTab] = useState<"general" | "letter" | "games" | "images" | "sync">("general");

  const addGame1Choice = () => {
    setLocalSettings((prev) => ({
      ...prev,
      game1: {
        ...prev.game1,
        choices: [...prev.game1.choices, ""]
      }
    }));
  };

  const removeGame1Choice = (indexToRemove: number) => {
    setLocalSettings((prev) => {
      const filtered = prev.game1.choices.filter((_, idx) => idx !== indexToRemove);
      // Fallback if we deleted the correct answer so we don't have mismatch
      const deletedVal = prev.game1.choices[indexToRemove];
      const correct = prev.game1.correctAnswer === deletedVal ? (filtered[0] || "") : prev.game1.correctAnswer;
      return {
        ...prev,
        game1: {
          ...prev.game1,
          choices: filtered,
          correctAnswer: correct
        }
      };
    });
  };

  const editGame1Choice = (indexToEdit: number, newValue: string) => {
    setLocalSettings((prev) => {
      const oldVal = prev.game1.choices[indexToEdit];
      const updatedChoices = prev.game1.choices.map((choice, idx) => idx === indexToEdit ? newValue : choice);
      const correct = prev.game1.correctAnswer === oldVal ? newValue : prev.game1.correctAnswer;
      return {
        ...prev,
        game1: {
          ...prev.game1,
          choices: updatedChoices,
          correctAnswer: correct
        }
      };
    });
  };

  const addGame3Choice = () => {
    setLocalSettings((prev) => ({
      ...prev,
      game3: {
        ...prev.game3,
        choices: [...prev.game3.choices, ""]
      }
    }));
  };

  const removeGame3Choice = (indexToRemove: number) => {
    setLocalSettings((prev) => {
      const filtered = prev.game3.choices.filter((_, idx) => idx !== indexToRemove);
      const deletedVal = prev.game3.choices[indexToRemove];
      const correct = prev.game3.correctAnswer === deletedVal ? (filtered[0] || "") : prev.game3.correctAnswer;
      return {
        ...prev,
        game3: {
          ...prev.game3,
          choices: filtered,
          correctAnswer: correct
        }
      };
    });
  };

  const editGame3Choice = (indexToEdit: number, newValue: string) => {
    setLocalSettings((prev) => {
      const oldVal = prev.game3.choices[indexToEdit];
      const updatedChoices = prev.game3.choices.map((choice, idx) => idx === indexToEdit ? newValue : choice);
      const correct = prev.game3.correctAnswer === oldVal ? newValue : prev.game3.correctAnswer;
      return {
        ...prev,
        game3: {
          ...prev.game3,
          choices: updatedChoices,
          correctAnswer: correct
        }
      };
    });
  };

  const addGame2Choice = () => {
    setLocalSettings((prev) => ({
      ...prev,
      game2: {
        ...prev.game2,
        choices: [...(prev.game2.choices || []), ""]
      }
    }));
  };

  const removeGame2Choice = (indexToRemove: number) => {
    setLocalSettings((prev) => {
      const currentChoices = prev.game2.choices || [];
      const filtered = currentChoices.filter((_, idx) => idx !== indexToRemove);
      const deletedVal = currentChoices[indexToRemove];
      const correct = prev.game2.correctAnswer === deletedVal ? (filtered[0] || "") : prev.game2.correctAnswer;
      return {
        ...prev,
        game2: {
          ...prev.game2,
          choices: filtered,
          correctAnswer: correct
        }
      };
    });
  };

  const editGame2Choice = (indexToEdit: number, newValue: string) => {
    setLocalSettings((prev) => {
      const currentChoices = prev.game2.choices || [];
      const oldVal = currentChoices[indexToEdit];
      const updatedChoices = currentChoices.map((choice, idx) => idx === indexToEdit ? newValue : choice);
      const correct = prev.game2.correctAnswer === oldVal ? newValue : prev.game2.correctAnswer;
      return {
        ...prev,
        game2: {
          ...prev.game2,
          choices: updatedChoices,
          correctAnswer: correct
        }
      };
    });
  };

  const addGame4Choice = () => {
    setLocalSettings((prev) => ({
      ...prev,
      game4: {
        ...prev.game4,
        choices: [...(prev.game4.choices || []), ""]
      }
    }));
  };

  const removeGame4Choice = (indexToRemove: number) => {
    setLocalSettings((prev) => {
      const currentChoices = prev.game4.choices || [];
      const filtered = currentChoices.filter((_, idx) => idx !== indexToRemove);
      const deletedVal = currentChoices[indexToRemove];
      const correct = prev.game4.correctAnswer === deletedVal ? (filtered[0] || "") : prev.game4.correctAnswer;
      return {
        ...prev,
        game4: {
          ...prev.game4,
          choices: filtered,
          correctAnswer: correct
        }
      };
    });
  };

  const editGame4Choice = (indexToEdit: number, newValue: string) => {
    setLocalSettings((prev) => {
      const currentChoices = prev.game4.choices || [];
      const oldVal = currentChoices[indexToEdit];
      const updatedChoices = currentChoices.map((choice, idx) => idx === indexToEdit ? newValue : choice);
      const correct = prev.game4.correctAnswer === oldVal ? newValue : prev.game4.correctAnswer;
      return {
        ...prev,
        game4: {
          ...prev.game4,
          choices: updatedChoices,
          correctAnswer: correct
        }
      };
    });
  };

  // Handle Home Photo Upload (Base64)
  const handleHomePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLocalSettings((prev) => ({
            ...prev,
            homePhoto: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Game 1 Photo Upload (Base64)
  const handleGame1PhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLocalSettings((prev) => ({
            ...prev,
            game1: {
              ...prev.game1,
              photo: reader.result as string
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Local Video Upload (Base64)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) { // Warning limit
        alert("Video boyutu çok büyük (25MB sınır)! Tarayıcı belleğinin dolmaması için lütfen küçük bir video yükleyin veya bir YouTube linki kullanın.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLocalSettings((prev) => ({
            ...prev,
            musicVideoBase64: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit and Save Settings
  const handleSaveAll = () => {
    // Ensure choices collections are not completely empty/buggy
    const cleanGame1Choices = localSettings.game1.choices.map(c => c.trim()).filter(c => c.length > 0);
    const cleanGame3Choices = localSettings.game3.choices.map(c => c.trim()).filter(c => c.length > 0);

    const updated: AdminSettings = {
      ...localSettings,
      game1: {
        ...localSettings.game1,
        choices: cleanGame1Choices.length > 0 ? cleanGame1Choices : ["Aşk Bahçesi"]
      },
      game3: {
        ...localSettings.game3,
        choices: cleanGame3Choices.length > 0 ? cleanGame3Choices : ["Sırada Sen Varsın"]
      }
    };

    setSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (window.confirm("Bütün ayarları ve özel içerikleri varsayılan örnek verilere döndürmek istediğine emin misin?")) {
      setSettings(DEFAULT_SETTINGS);
      setLocalSettings(DEFAULT_SETTINGS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Reset Game Lock / Progress
  const handleResetProgressState = () => {
    if (window.confirm("Bütün oyun tamamlama durumlarını sıfırlayarak odayı tekrar kilitlemek istiyor musun? (Test etmek için harikadır!)")) {
      setProgress(DEFAULT_PROGRESS);
      alert("Oyun ilerlemesi sıfırlandı ve sır odası tekrar kilitlendi!");
    }
  };

  // Sync / Export / Import Helper functions
  const handleExportPackage = () => {
    try {
      const savedMemories = localStorage.getItem("deryaflix_visited_memories_v1");
      const memories = savedMemories ? JSON.parse(savedMemories) : [];
      const savedProfiles = localStorage.getItem("deryaflix_couple_profiles_v1");
      const profiles = savedProfiles ? JSON.parse(savedProfiles) : null;
      
      const pkg = {
        settings: localSettings,
        memories: memories,
        profiles: profiles,
        progress: progress,
        exportedAt: new Date().toISOString()
      };
      return JSON.stringify(pkg, null, 2);
    } catch (e) {
      console.error("Aşk paketi dışa aktarılamadı:", e);
      return "";
    }
  };

  const downloadJSONFile = () => {
    const jsonStr = handleExportPackage();
    if (!jsonStr) {
      alert("Aşk paketi oluşturma başarısız oldu.");
      return;
    }
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `deryaflix_ask_paketi.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const jsonStr = handleExportPackage();
    if (!jsonStr) return;
    navigator.clipboard.writeText(jsonStr).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        alert("Kod kopyalanamadı, lütfen metin alanından el ile seçip kopyalayın.");
      }
    );
  };

  const handleImportPackage = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr.trim());
      if (parsed && typeof parsed === "object") {
        let importedAny = false;
        
        if (parsed.settings) {
          setSettings(parsed.settings);
          setLocalSettings(parsed.settings);
          importedAny = true;
        }
        
        if (parsed.memories && Array.isArray(parsed.memories)) {
          localStorage.setItem("deryaflix_visited_memories_v1", JSON.stringify(parsed.memories));
          importedAny = true;
        }

        if (parsed.profiles) {
          localStorage.setItem("deryaflix_couple_profiles_v1", JSON.stringify(parsed.profiles));
          importedAny = true;
        }
        
        if (parsed.progress) {
          setProgress(parsed.progress);
          importedAny = true;
        }
        
        if (importedAny) {
          setImportStatus({
            type: "success",
            message: "Aşk Paketi başarıyla içeri aktarıldı! Değişiklikler uygulandı ve sayfa yenileniyor."
          });
          setTimeout(() => {
            setImportStatus({ type: null, message: "" });
            window.location.reload();
          }, 2000);
        } else {
          setImportStatus({
            type: "error",
            message: "Paket içeriğinde geçerli bir aşk ayarı veya anı karesi bulunamadı."
          });
        }
      } else {
        setImportStatus({ type: "error", message: "Geçersiz veri formatı!" });
      }
    } catch (e) {
      setImportStatus({
        type: "error",
        message: "Kod çözülemedi. Lütfen geçerli, kopyalanmış bir Aşk Paketi kodu yapıştırdığınızdan emin olun."
      });
    }
  };

  const handleJSONFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          handleImportPackage(event.target.result);
        }
      };
      reader.onerror = () => {
        setImportStatus({ type: "error", message: "Dosya okunurken bir hata oluştu." });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-neutral-250">
      <div className="text-center space-y-2 pb-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gold tracking-wider">
          Uygulama Yönetim Paneli
        </h1>
        <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
          Yıldönümü, Özel Şarkılar, Oyun Soruları ve Fotoğrafları Buradan Düzenle
        </p>
      </div>

      {/* Admin Tab Buttons */}
      <div className="flex border-b border-white/5 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setAdminTab("general")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            adminTab === "general"
              ? "border-gold text-gold bg-black/40"
              : "border-transparent text-white/40 hover:text-[#e1e1e1] hover:bg-white/5"
          }`}
        >
          <Settings className="w-4 h-4 text-gold" /> Genel Ayarlar
        </button>
        <button
          onClick={() => setAdminTab("letter")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            adminTab === "letter"
              ? "border-gold text-gold bg-black/40"
              : "border-transparent text-white/40 hover:text-[#e1e1e1] hover:bg-white/5"
          }`}
        >
          <FileText className="w-4 h-4 text-gold" /> Sır Mektubu
        </button>
        <button
          onClick={() => setAdminTab("games")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            adminTab === "games"
              ? "border-gold text-gold bg-black/40"
              : "border-transparent text-white/40 hover:text-[#e1e1e1] hover:bg-white/5"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-gold" /> Oyun Düzenleme
        </button>
        <button
          onClick={() => setAdminTab("images")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            adminTab === "images"
              ? "border-gold text-gold bg-black/40"
              : "border-transparent text-white/40 hover:text-[#e1e1e1] hover:bg-white/5"
          }`}
        >
          <Image className="w-4 h-4 text-gold" /> Görseller
        </button>
        <button
          onClick={() => setAdminTab("sync")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
            adminTab === "sync"
              ? "border-gold text-[#E50914] bg-black/40"
              : "border-transparent text-[#E50914]/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Share2 className="w-4 h-4 text-[#E50914]" /> Paylaş & İçe/Dışa Aktar
        </button>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-xl p-6 space-y-6">
        {/* TAB 1: GENERAL SETTINGS */}
        {adminTab === "general" && (
          <div className="space-y-4 text-left">
            <h3 className="font-serif text-lg text-gold border-b border-white/5 pb-2">Ortak Genel Ayarlar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">1. Partner İsmi</label>
                <input
                  type="text"
                  value={localSettings.partnerName1}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, partnerName1: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">2. Partner İsmi</label>
                <input
                  type="text"
                  value={localSettings.partnerName2}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, partnerName2: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">Yıldönümü Tarihi & Saati</label>
                <input
                  type="datetime-local"
                  value={(localSettings.anniversaryDate || "").substring(0, 16)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalSettings((prev) => ({ ...prev, anniversaryDate: value }));
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">Tanışma Tarihi & Saati (Birbirimizi Tanıyoruz)</label>
                <input
                  type="datetime-local"
                  value={(localSettings.firstMetDate || localSettings.anniversaryDate || "2024-05-18T20:00:00").substring(0, 16)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalSettings((prev) => ({ ...prev, firstMetDate: value }));
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">Sır Odası Şifresi</label>
                <input
                  type="text"
                  value={localSettings.secretPassword}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, secretPassword: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">{localSettings.partnerName1 || "1. Partner"} Doğum Günü Tarihi</label>
                <input
                  type="date"
                  value={localSettings.partner1Birthday ? localSettings.partner1Birthday.substring(0, 10) : "1999-10-18"}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, partner1Birthday: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-sans tracking-wide">{localSettings.partnerName2 || "2. Partner"} Doğum Günü Tarihi</label>
                <input
                  type="date"
                  value={localSettings.partner2Birthday ? localSettings.partner2Birthday.substring(0, 10) : "1997-05-12"}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, partner2Birthday: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Song / Video Settings */}
            <div className="space-y-4 border-t border-white/5 pt-4 mt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-gold font-bold">Şarkı & Video Oynatıcı Seçenekleri</h4>
              
              {/* Toggle Buttons */}
              <div className="flex bg-black/50 p-1 rounded border border-white/5 gap-1.5 max-w-md">
                <button
                  type="button"
                  onClick={() => setLocalSettings((prev) => ({ ...prev, musicType: "spotify" }))}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    (!localSettings.musicType || localSettings.musicType === "spotify")
                      ? "bg-gold text-black shadow"
                      : "text-white/50 hover:text-[#e1e1e1]"
                  }`}
                >
                  <Music className="w-3.5 h-3.5" /> Spotify
                </button>
                <button
                  type="button"
                  onClick={() => setLocalSettings((prev) => ({ ...prev, musicType: "youtube" }))}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    localSettings.musicType === "youtube"
                      ? "bg-gold text-black shadow"
                      : "text-white/50 hover:text-[#e1e1e1]"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" /> YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setLocalSettings((prev) => ({ ...prev, musicType: "device" }))}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    localSettings.musicType === "device"
                      ? "bg-gold text-black shadow"
                      : "text-white/50 hover:text-[#e1e1e1]"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Cihazdan
                </button>
              </div>

              {/* Conditional render based on chosen option */}
              {(!localSettings.musicType || localSettings.musicType === "spotify") && (
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50 font-sans tracking-wide">Spotify Embed Kodu veya Şarkı Linki</label>
                  <input
                    type="text"
                    placeholder="Örn: https://open.spotify.com/embed/track/..."
                    value={localSettings.musicEmbed}
                    onChange={(e) => setLocalSettings((prev) => ({ ...prev, musicEmbed: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                  />
                  <p className="text-[10px] text-white/30">
                    Not: Spotify Şarkısının 'Embed' linkini kopyalayarak buraya yapıştırırsanız ana sayfada doğrudan mini çalar görünür.
                  </p>
                </div>
              )}

              {localSettings.musicType === "youtube" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50 font-sans tracking-wide">YouTube Video URL / Link</label>
                  <input
                    type="text"
                    placeholder="Örn: https://www.youtube.com/watch?v=FjI1VbeR6qU"
                    value={localSettings.musicVideoUrl || ""}
                    onChange={(e) => setLocalSettings((prev) => ({ ...prev, musicVideoUrl: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-sm text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                  />
                  <p className="text-[10px] text-white/30">
                    Not: Herhangi bir YouTube video bağlantısını buraya yapıştırabilirsiniz. Ana sayfadaki aşk melodisi alanında otomatik olarak çalacaktır (sessiz ve döngülü olarak sinematik görünür).
                  </p>
                </div>
              )}

              {localSettings.musicType === "device" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50 font-sans tracking-wide">Cihazdan Video Dosyası Yükleyin (.mp4, .mov, vb.)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded py-2.5 px-6 text-center text-xs text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-[11px] font-semibold">
                        <Upload className="w-4 h-4 text-gold" /> Video Seç & Yükle
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </label>
                      {localSettings.musicVideoBase64 && (
                        <button
                          type="button"
                          onClick={() => setLocalSettings(prev => ({ ...prev, musicVideoBase64: "" }))}
                          className="text-[10px] text-rose-450 hover:text-rose-400 font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Mevcut Videoyu Kaldır
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-white/30">
                      Öneri: Tarayıcı belleğini korumak amacıyla lütfen 25MB altı kısa aşk video klips, hatıra videoları ya da döngüler yükleyin. Daha uzun videolar için YouTube seçeneğini kullanabilirsiniz.
                    </p>
                  </div>

                  {localSettings.musicVideoBase64 && (
                    <div className="border border-white/5 rounded-lg overflow-hidden max-w-sm bg-black/40 p-2">
                      <p className="text-[10px] font-mono text-gold mb-1.5 uppercase tracking-wider">Yüklenen Video Önizleme:</p>
                      <video
                        src={localSettings.musicVideoBase64}
                        controls
                        muted
                        playsInline
                        className="w-full h-36 object-cover rounded aspect-video"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SECRET LETTER TEXT */}
        {adminTab === "letter" && (
          <div className="space-y-4 text-left">
            <h3 className="font-serif text-lg text-gold border-b border-white/5 pb-2">Sır Mektubu İçeriği</h3>
            <p className="text-xs text-white/45 leading-relaxed font-serif italic">
              Bu özel mektup, mini oyunlar başarıyla tamamlandığında veya doğru şifre girildiğinde Sır Odası kapısında açılacaktır. Sevgiline söylemek istediğin en kıymetli hislerini buraya dökebilirsin.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-sans tracking-wide">Özel Mektup Alanı</label>
              <textarea
                rows={9}
                value={localSettings.secretLetter}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, secretLetter: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm text-[#e1e1e1] font-serif leading-relaxed focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        )}

        {/* TAB 3: GAMES QUESTION DESIGN */}
        {adminTab === "games" && (
          <div className="space-y-8 text-left">
            {/* Game 1 Design */}
            <div className="space-y-5 border-b border-white/5 pb-6">
              <div className="flex justify-between items-center sm:gap-4 pb-1 border-b border-white/5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-gold font-bold">1. Oyun: Anı Parçası (Konum Tahmini)</h4>
                <p className="text-[10px] text-white/40 tracking-wider">İstediğin kadar şık/seçenek ekle</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Oyun Soru Başlığı</label>
                <input
                  type="text"
                  value={localSettings.game1.question}
                  onChange={(e) => setLocalSettings((prev) => ({
                    ...prev,
                    game1: { ...prev.game1, question: e.target.value }
                  }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Dynamic Game 1 Choices Builder */}
              <div className="space-y-3">
                <label className="text-xs text-white/50 block">Mevcut Seçenekler (Seçenekleri buraya ekleyin)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {localSettings.game1.choices.map((choice, index) => (
                    <div key={index} className="flex items-center gap-1 bg-black/30 border border-white/5 rounded-md p-1 pl-2">
                      <span className="text-[10px] font-mono text-white/30 mr-1">#{index + 1}</span>
                      <input
                        type="text"
                        value={choice}
                        placeholder={`Seçenek ${index + 1}`}
                        onChange={(e) => editGame1Choice(index, e.target.value)}
                        className="flex-grow bg-transparent text-xs text-[#e1e1e1] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeGame1Choice(index)}
                        className="p-1 px-2 text-rose-450 hover:text-rose-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Seçeneği Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1 sm:items-center justify-between">
                  <button
                    type="button"
                    onClick={addGame1Choice}
                    className="border border-dashed border-gold/40 hover:border-gold text-gold/80 hover:text-gold text-[10px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded flex items-center justify-center gap-1 bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Seçenek Ekle
                  </button>

                  {/* Dropdown to pick which of those is correct */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-white/50 whitespace-nowrap">Doğru Seçenek Hangisi?</label>
                    <select
                      value={localSettings.game1.correctAnswer}
                      onChange={(e) => setLocalSettings((prev) => ({
                        ...prev,
                        game1: { ...prev.game1, correctAnswer: e.target.value }
                      }))}
                      className="bg-black/60 border border-white/10 text-xs text-gold rounded px-3 py-1 focus:outline-none focus:border-gold"
                    >
                      <option value="">Seçin...</option>
                      {localSettings.game1.choices.filter(c => c.trim().length > 0).map((choice, idx) => (
                        <option key={idx} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Game 2 Design */}
            <div className="space-y-5 border-b border-white/5 pb-6">
              <div className="flex justify-between items-center sm:gap-4 pb-1 border-b border-white/5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-gold font-bold">2. Oyun: Aşk Sözü (Seçenek Tabanlı)</h4>
                <p className="text-[10px] text-white/40 tracking-wider">İstediğin kadar şık/seçenek ekle</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Boşluklu Cümle (Lütfen "_______" şeklinde boşluğu çizin)</label>
                <input
                  type="text"
                  value={localSettings.game2.phraseWithBlank}
                  onChange={(e) => setLocalSettings((prev) => ({
                    ...prev,
                    game2: { ...prev.game2, phraseWithBlank: e.target.value }
                  }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Dynamic Game 2 Choices Builder */}
              <div className="space-y-3">
                <label className="text-xs text-white/50 block">Mevcut Seçenekler (Seçenekleri buraya ekleyin)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(localSettings.game2.choices || []).map((choice, index) => (
                    <div key={index} className="flex items-center gap-1 bg-black/30 border border-white/5 rounded-md p-1 pl-2">
                      <span className="text-[10px] font-mono text-white/30 mr-1">#{index + 1}</span>
                      <input
                        type="text"
                        value={choice}
                        placeholder={`Seçenek ${index + 1}`}
                        onChange={(e) => editGame2Choice(index, e.target.value)}
                        className="flex-grow bg-transparent text-xs text-[#e1e1e1] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeGame2Choice(index)}
                        className="p-1 px-2 text-rose-450 hover:text-rose-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Seçeneği Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1 sm:items-center justify-between">
                  <button
                    type="button"
                    onClick={addGame2Choice}
                    className="border border-dashed border-gold/40 hover:border-gold text-gold/80 hover:text-gold text-[10px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded flex items-center justify-center gap-1 bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Seçenek Ekle
                  </button>

                  {/* Dropdown to pick which of those is correct */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-white/50 whitespace-nowrap">Doğru Seçenek Hangisi?</label>
                    <select
                      value={localSettings.game2.correctAnswer}
                      onChange={(e) => setLocalSettings((prev) => ({
                        ...prev,
                        game2: { ...prev.game2, correctAnswer: e.target.value }
                      }))}
                      className="bg-black/60 border border-white/10 text-xs text-gold rounded px-3 py-1 focus:outline-none focus:border-gold"
                    >
                      <option value="">Seçin...</option>
                      {(localSettings.game2.choices || []).filter(c => c.trim().length > 0).map((choice, idx) => (
                        <option key={idx} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Kelime İpucu</label>
                <input
                  type="text"
                  value={localSettings.game2.hint}
                  onChange={(e) => setLocalSettings((prev) => ({
                    ...prev,
                    game2: { ...prev.game2, hint: e.target.value }
                  }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Game 3 Design */}
            <div className="space-y-5 border-b border-white/5 pb-6">
              <div className="flex justify-between items-center sm:gap-4 pb-1 border-b border-white/5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-gold font-bold">3. Oyun: Bizim Şarkımız</h4>
                <p className="text-[10px] text-white/44 tracking-wider">İstediğin kadar şık/seçenek ekle</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Şarkı Sorusu / Şarkı Sözleri Sorusu</label>
                <input
                  type="text"
                  value={localSettings.game3.lyricsQuestion}
                  onChange={(e) => setLocalSettings((prev) => ({
                    ...prev,
                    game3: { ...prev.game3, lyricsQuestion: e.target.value }
                  }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Dynamic Game 3 Choices Builder */}
              <div className="space-y-3">
                <label className="text-xs text-white/50 block">Şarkı Seçenekleri (Seçenekleri buraya ekleyin)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {localSettings.game3.choices.map((choice, index) => (
                    <div key={index} className="flex items-center gap-1 bg-black/30 border border-white/5 rounded-md p-1 pl-2">
                      <span className="text-[10px] font-mono text-white/30 mr-1">#{index + 1}</span>
                      <input
                        type="text"
                        value={choice}
                        placeholder={`Şarkı Seçeneği ${index + 1}`}
                        onChange={(e) => editGame3Choice(index, e.target.value)}
                        className="flex-grow bg-transparent text-xs text-[#e1e1e1] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeGame3Choice(index)}
                        className="p-1 px-2 text-rose-450 hover:text-rose-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Seçeneği Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1 sm:items-center justify-between">
                  <button
                    type="button"
                    onClick={addGame3Choice}
                    className="border border-dashed border-gold/40 hover:border-gold text-gold/80 hover:text-gold text-[10px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded flex items-center justify-center gap-1 bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Şarkı Ekle
                  </button>

                  {/* Dropdown to pick which of those is correct */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-white/50 whitespace-nowrap">Doğru Seçenek Hangisi?</label>
                    <select
                      value={localSettings.game3.correctAnswer}
                      onChange={(e) => setLocalSettings((prev) => ({
                        ...prev,
                        game3: { ...prev.game3, correctAnswer: e.target.value }
                      }))}
                      className="bg-black/60 border border-white/10 text-xs text-gold rounded px-3 py-1 focus:outline-none focus:border-gold font-serif italic"
                    >
                      <option value="">Seçin...</option>
                      {localSettings.game3.choices.filter(c => c.trim().length > 0).map((choice, idx) => (
                        <option key={idx} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Game 4 Design */}
            <div className="space-y-5">
              <div className="flex justify-between items-center sm:gap-4 pb-1 border-b border-white/5">
                <h4 className="text-xs font-mono uppercase tracking-widest text-gold font-bold">4. Oyun: Emoji Hikayesi (Seçenek Tabanlı)</h4>
                <p className="text-[10px] text-white/40 tracking-wider">İstediğin kadar şık/seçenek ekle</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Gösterilecek Emojiler</label>
                <input
                  type="text"
                  value={localSettings.game4.emojis}
                  onChange={(e) => setLocalSettings((prev) => ({
                    ...prev,
                    game4: { ...prev.game4, emojis: e.target.value }
                  }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Dynamic Game 4 Choices Builder */}
              <div className="space-y-3">
                <label className="text-xs text-white/50 block">Tatil/Gezimiz Şık Seçenekleri (Seçenekleri buraya ekleyin)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(localSettings.game4.choices || []).map((choice, index) => (
                    <div key={index} className="flex items-center gap-1 bg-black/30 border border-white/5 rounded-md p-1 pl-2">
                      <span className="text-[10px] font-mono text-white/30 mr-1">#{index + 1}</span>
                      <input
                        type="text"
                        value={choice}
                        placeholder={`Seçenek ${index + 1}`}
                        onChange={(e) => editGame4Choice(index, e.target.value)}
                        className="flex-grow bg-transparent text-xs text-[#e1e1e1] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeGame4Choice(index)}
                        className="p-1 px-2 text-rose-450 hover:text-rose-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Seçeneği Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1 sm:items-center justify-between">
                  <button
                    type="button"
                    onClick={addGame4Choice}
                    className="border border-dashed border-gold/40 hover:border-gold text-gold/80 hover:text-gold text-[10px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded flex items-center justify-center gap-1 bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Seçenek Ekle
                  </button>

                  {/* Dropdown to pick which of those is correct */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-white/50 whitespace-nowrap">Doğru Seçenek Hangisi?</label>
                    <select
                      value={localSettings.game4.correctAnswer}
                      onChange={(e) => setLocalSettings((prev) => ({
                        ...prev,
                        game4: { ...prev.game4, correctAnswer: e.target.value }
                      }))}
                      className="bg-black/60 border border-white/10 text-xs text-gold rounded px-3 py-1 focus:outline-none focus:border-gold"
                    >
                      <option value="">Seçin...</option>
                      {(localSettings.game4.choices || []).filter(c => c.trim().length > 0).map((choice, idx) => (
                        <option key={idx} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Emoji Anlam İpucu</label>
                <input
                  type="text"
                  value={localSettings.game4.hint}
                  onChange={(e) => setLocalSettings((prev) => ({
                    ...prev,
                    game4: { ...prev.game4, hint: e.target.value }
                  }))}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-2.5 text-xs text-[#e1e1e1] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IMAGES UPLOAD (CİHAZDAN DOSYA YÜKLEME) */}
        {adminTab === "images" && (
          <div className="space-y-6 text-left">
            <h3 className="font-serif text-lg text-gold border-b border-white/5 pb-2">Fotoğraf Yükleme Ayarları</h3>
            <p className="text-xs text-white/45 leading-relaxed font-serif italic">
              Cihazınızdan yerel bir fotoğraf yükleyerek ana sayfadaki büyük kapak görselini veya Anı Parçası oyunundaki gizli fotoğrafı özelleştirebilirsiniz. Yüklenen fotoğraflar güvenli bir şekilde tarayıcınızın belleğinde saklanır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Home Main Photo Upload */}
              <div className="bg-black/30 p-4 border border-white/5 rounded-lg space-y-4">
                <h4 className="text-[11px] uppercase font-mono tracking-wider text-gold flex items-center gap-1.5 font-bold">
                  <Image className="w-4 h-4" /> Ana Sayfa Büyük Resmi
                </h4>
                
                <div className="border border-white/5 rounded overflow-hidden h-36 bg-black/40 flex items-center justify-center relative group">
                  <img
                    src={localSettings.homePhoto}
                    alt="Ana Sayfa Önizleme"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    id="admin-home-photo-preview"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono uppercase tracking-widest text-gold text-center">Önizleme</div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded py-2 px-4 text-center text-xs text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-[11px] font-semibold">
                    <Upload className="w-4 h-4 text-gold" /> Cihazdan Resim Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHomePhotoUpload}
                      className="hidden"
                      id="home-photo-file-input"
                    />
                  </label>
                  <p className="text-[10px] text-white/30 text-center">Öneri: Yatay, yüksek çözünürlüklü manzara veya ortak çift fotoğrafı.</p>
                </div>
              </div>

              {/* Game 1 Memory Photo Upload */}
              <div className="bg-black/30 p-4 border border-white/5 rounded-lg space-y-4">
                <h4 className="text-[11px] uppercase font-mono tracking-wider text-gold flex items-center gap-1.5 font-bold">
                  <Image className="w-4 h-4" /> 1. Oyun (Anı Parçası) Resmi
                </h4>

                <div className="border border-white/5 rounded overflow-hidden h-36 bg-black/40 flex items-center justify-center relative group">
                  <img
                    src={localSettings.game1.photo}
                    alt="Oyun 1 Önizleme"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    id="admin-game1-photo-preview"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono uppercase tracking-widest text-gold text-center">Önizleme</div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded py-2 px-4 text-center text-xs text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-[11px] font-semibold">
                    <Upload className="w-4 h-4 text-gold" /> Cihazdan Resim Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGame1PhotoUpload}
                      className="hidden"
                      id="game1-photo-file-input"
                    />
                  </label>
                  <p className="text-[10px] text-white/30 text-center">Öneri: Tahmin edilmesini istediğiniz ortak tatil veya anı karesi.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SYNC / SHARE / PUBLISH PANEL */}
        {adminTab === "sync" && (
          <div className="space-y-6 text-left">
            <h3 className="font-serif text-lg text-gold border-b border-white/5 pb-2 font-bold uppercase tracking-wider">Paylaş & İçe/Dışa Aktar</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Özelleştirdiğin tüm ayarları, anıları, şarkı ve video tercihlerini içeren bir <strong>"Aşk Paketi"</strong> oluşturabilirsin. Bu paket sayesinde farklı cihazlarda, tarayıcılarda veya partnerinin telefonunda tüm verileri tek tuşla senkronize edebilirsin!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* EXPORT PANEL */}
              <div className="bg-black/30 p-5 border border-white/5 rounded-xl space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-wider text-gold flex items-center gap-1.5 font-bold">
                  <Download className="w-4 h-4 text-gold animate-bounce" /> Aşk Paketini Dışarı Aktar
                </h4>
                <p className="text-[11px] text-white/40 leading-relaxed font-sans">
                  Buradan indireceğin dosya veya kopyalayacağın özel kod, yaptığın tüm düzenlemeleri (yıldönümü tarihi, doğum günleri, eklediğin anı resimleri, aşk mektubu ve özel müzik playlist) içerir.
                </p>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={downloadJSONFile}
                    className="w-full bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold py-2.5 rounded flex items-center justify-center gap-2 uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#E50914]/15"
                  >
                    <Download className="w-4 h-4" /> Dosya Olarak İndir (.json)
                  </button>

                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2.5 rounded flex items-center justify-center gap-2 uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-gold" /> {copied ? "Kopyalandı! ❤️" : "Aşk Kodunu Kopyala"}
                  </button>
                </div>
              </div>

              {/* IMPORT PANEL */}
              <div className="bg-black/30 p-5 border border-[#E50914]/10 rounded-xl space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-wider text-[#E50914] flex items-center gap-1.5 font-bold">
                  <Upload className="w-4 h-4 text-[#E50914]" /> Aşk Paketini İçeri Aktar
                </h4>
                <p className="text-[11px] text-white/40 leading-relaxed font-sans">
                  Partnerinden aldığın özel aşk paket dosyasını yükleyerek veya kopyaladığı aşk kodunu buraya yapıştırarak tüm ayarları saniyeler içinde kendi tarayıcınla senkronize edebilirsin.
                </p>

                {/* Import Status Alert banner */}
                {importStatus.type && (
                  <div className={`p-2.5 rounded text-[11px] font-semibold text-center ${
                    importStatus.type === "success" 
                      ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" 
                      : "bg-[#E50914]/15 border border-[#E50914]/30 text-rose-350"
                  }`}>
                    {importStatus.message}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  {/* File selector */}
                  <label className="cursor-pointer w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded py-2 text-center text-xs text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-[11px] font-semibold">
                    <Upload className="w-4 h-4 text-gold" /> Paket Dosyası Seç (.json)
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleJSONFileImport}
                      className="hidden"
                    />
                  </label>

                  <div className="relative">
                    <textarea
                      placeholder="Buraya partnerinin paylaştığı Aşk Kodu paketini yapıştır..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      rows={2}
                      className="w-full bg-black/60 border border-white/10 rounded p-2 text-[10px] text-white/60 focus:outline-none focus:border-[#E50914] font-mono leading-normal"
                    />
                    <button
                      type="button"
                      disabled={!importText.trim()}
                      onClick={() => handleImportPackage(importText)}
                      className="w-full mt-1 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed border border-white/5 text-white text-[10px] font-bold py-1.5 rounded uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Kodu Çöz ve Yükle
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* AI PUBLISH SYNC TIP SECTION */}
            <div className="bg-[#E50914]/5 border border-[#E50914]/15 rounded-xl p-4.5 space-y-2 mt-4 font-sans">
              <h5 className="text-[11px] font-mono tracking-widest text-[#E50914] uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-4.5 h-4.5 text-gold animate-pulse" /> DEĞİŞİKLİKLERİ YAYINLAMA & KALICI KILMA REHBERİ
              </h5>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Yaptığın her değişiklik yerel olarak sadece senin cihazındaki tarayıcı belleğinde saklanır. Siteni paylaştığında partnerinin veya başkalarının bu özelleştirmeleri <strong>hiçbir işleme gerek kalmadan doğrudan görmesi</strong> için:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-white/60 pl-2 space-y-1">
                <li>Yukarıdaki <strong className="text-white">"Aşk Kodunu Kopyala"</strong> butonuna tıkla.</li>
                <li>Kopyaladığın bu heyecan verici ve uzun kodu bu yapay zeka sohbet penceresine yapıştırarak bana gönder.</li>
                <li>Ben senin gönderdiğin kodu uygulamanın temel varsayılan değerleri yapacağım. Böylece site nerede açılırsa açılsın doğrudan senin özel bilgilerinle yüklenir! ❤️</li>
              </ol>
            </div>

          </div>
        )}

        {/* BOTTOM UTILITY ACTIONS */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={handleResetProgressState}
              className="text-[10px] uppercase tracking-wider font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gold px-3.5 py-2 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> İlerlemeyi Sıfırla
            </button>
            <button
              onClick={handleResetToDefaults}
              className="text-[10px] uppercase tracking-wider font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-rose-350 hover:text-rose-300 px-3.5 py-2 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Varsayılana Dön
            </button>
          </div>

          <button
            onClick={handleSaveAll}
            id="save-admin-settings-btn"
            className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs py-2.5 px-6 rounded uppercase tracking-widest cursor-pointer transition-all duration-300 shadow-md"
          >
            Değişiklikleri Kaydet
          </button>
        </div>

        {/* Saving visual confirmation toast */}
        {saveSuccess && (
          <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded text-center text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Bütün Ayarlar Başarıyla Kaydedildi ve Senkronize Edildi! Yepyeni anılarla hazır.
          </div>
        )}
      </div>
    </div>
  );
}
