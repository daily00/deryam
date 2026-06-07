/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { loadSettings, saveSettings, loadProgress, saveProgress } from "./utils/storage";
import { AdminSettings, GameProgress } from "./types";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import GamesView from "./components/GamesView";
import SecretRoomView from "./components/SecretRoomView";
import AdminView from "./components/AdminView";
import BirthdayCountdownView from "./components/BirthdayCountdownView";
import SplashIntro from "./components/SplashIntro";
import ProfilePicker from "./components/ProfilePicker";
import CoupleProfilesView from "./components/CoupleProfilesView";
import { Heart, Sparkles } from "lucide-react";

export default function App() {
  const [settings, setSettingsState] = useState<AdminSettings>(() => loadSettings());
  const [progress, setProgressState] = useState<GameProgress>(() => loadProgress());
  const [currentTab, setTab] = useState<string>("home");
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined") {
        return sessionStorage.getItem("deryam_intro_seen") !== "true";
      }
    } catch (_) {}
    return true;
  });

  const [whoIsWatching, setWhoIsWatching] = useState<string | null>(() => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem("deryaflix_profile");
      }
    } catch (_) {}
    return null;
  });

  // Sync state to localstorage when they change
  const setSettings = (newSettings: AdminSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const setProgress = (newProgress: GameProgress) => {
    setProgressState(newProgress);
    saveProgress(newProgress);
  };

  // Determine if Secret Room is unlocked
  const isAllGamesDone = progress.game1Completed && progress.game2Completed && progress.game3Completed && progress.game4Completed;
  const isUnlocked = progress.isUnlockedExplicitly || isAllGamesDone;

  if (showSplash) {
    return (
      <SplashIntro 
        settings={settings} 
        onComplete={() => {
          try {
            sessionStorage.setItem("deryam_intro_seen", "true");
          } catch (_) {}
          setShowSplash(false);
        }} 
      />
    );
  }

  if (!whoIsWatching) {
    return (
      <ProfilePicker
        partner1={settings.partnerName1}
        partner2={settings.partnerName2}
        onSelect={(p) => {
          try {
            localStorage.setItem("deryaflix_profile", p);
          } catch (_) {}
          setWhoIsWatching(p);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#e1e1e1] flex flex-col relative overflow-hidden font-sans select-none">
      {/* Visual Elegant Red Ambient Glow Elements */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle at 50% -10%, rgba(229,9,20,0.22) 0%, transparent 50%)" }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[40%] bg-[#E50914]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Sparkles decorative overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Navbar Component */}
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        isUnlocked={isUnlocked}
        settings={settings}
        whoIsWatching={whoIsWatching}
        onSwitchProfile={() => setWhoIsWatching(null)}
      />

      {/* Core Pages Dispatcher */}
      <main className="flex-grow pb-16 z-10 relative">
        {currentTab === "home" && <HomeView settings={settings} setTab={setTab} />}
        {currentTab === "games" && (
          <GamesView
            settings={settings}
            progress={progress}
            setProgress={setProgress}
            setTab={setTab}
          />
        )}
        {currentTab === "birthday" && (
          <BirthdayCountdownView
            settings={settings}
            setSettings={setSettings}
            whoIsWatching={whoIsWatching}
          />
        )}
        {currentTab === "profiles" && (
          <CoupleProfilesView settings={settings} />
        )}
        {currentTab === "secret" && (
          <SecretRoomView
            settings={settings}
            progress={progress}
            setProgress={setProgress}
          />
        )}
        {currentTab === "admin" && (
          <AdminView
            settings={settings}
            setSettings={setSettings}
            progress={progress}
            setProgress={setProgress}
          />
        )}
      </main>

      {/* Mini Elegant Footer */}
      <footer className="py-6 text-center border-t border-white/5 bg-[#0f0f12]/40 text-white/20 font-mono text-[10px] z-10 mt-auto">
        <div className="flex items-center justify-center gap-1.5 text-gold/60 mb-1">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span className="tracking-wider">DERYA & SEN — BİR ÖMÜR BOYU</span>
          <Heart className="w-3.5 h-3.5 fill-current" />
        </div>
        <p>© 2026 Deryam. Her anı sonsuz bir derya...</p>
      </footer>
    </div>
  );
}

