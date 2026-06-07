/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart, Lock, Unlock, Settings, Home, Gamepad2, Users, LogOut, ChevronDown, Calendar } from "lucide-react";
import { AdminSettings } from "../types";
import { useState } from "react";

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isUnlocked: boolean;
  settings: AdminSettings;
  whoIsWatching?: string | null;
  onSwitchProfile?: () => void;
}

export default function Navbar({ 
  currentTab, 
  setTab, 
  isUnlocked, 
  settings, 
  whoIsWatching, 
  onSwitchProfile 
}: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const p1 = settings.partnerName1 || "Deryam";
  const p2 = settings.partnerName2 || "Yusuf";

  // Match avatar to user
  const getAvatarStyle = () => {
    if (whoIsWatching === p1) {
      return "from-rose-500 to-red-650";
    } else if (whoIsWatching?.includes(p2)) {
      return "from-blue-500 to-indigo-650";
    } else {
      return "from-purple-500 via-pink-500 to-rose-500";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#000000]/85 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-2xl transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <button
          onClick={() => setTab("home")}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          id="nav-logo-btn"
        >
          <span className="font-sans text-xl sm:text-2xl font-black tracking-widest text-[#E50914] uppercase hover:scale-105 transition-transform duration-300">
            {p1.toUpperCase()}FLIX
          </span>
          <Heart className="w-4 h-4 text-[#E50914] fill-[#E50914] animate-pulse shrink-0 hidden sm:inline" />
        </button>

        {/* Center: Main Navigation List */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Home Tab */}
          <button
            onClick={() => setTab("home")}
            id="tab-home-btn"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs sm:text-sm transition-all duration-300 relative font-medium ${
              currentTab === "home"
                ? "text-white font-extrabold"
                : "text-white/55 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4 shrink-0 sm:hidden" />
            <span className="tracking-wider text-[10px] sm:text-xs">ANA SAYFA</span>
            {currentTab === "home" && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E50914]" />
            )}
          </button>

          {/* Games Tab */}
          <button
            onClick={() => setTab("games")}
            id="tab-games-btn"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs sm:text-sm transition-all duration-300 relative font-medium ${
              currentTab === "games"
                ? "text-white font-extrabold"
                : "text-white/55 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-4 h-4 shrink-0 sm:hidden" />
            <span className="tracking-wider text-[10px] sm:text-xs">ANILARIMIZ</span>
            {currentTab === "games" && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E50914]" />
            )}
          </button>

          {/* Birthday Tab */}
          <button
            onClick={() => setTab("birthday")}
            id="tab-birthday-btn"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs sm:text-sm transition-all duration-300 relative font-medium ${
              currentTab === "birthday"
                ? "text-white font-extrabold"
                : "text-white/55 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0 sm:hidden" />
            <span className="tracking-wider text-[10px] sm:text-xs">DOĞUM GÜNÜ</span>
            {currentTab === "birthday" && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E50914]" />
            )}
          </button>

          {/* Couple Profiles PP Tab */}
          <button
            onClick={() => setTab("profiles")}
            id="tab-profiles-btn"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs sm:text-sm transition-all duration-300 relative font-medium ${
              currentTab === "profiles"
                ? "text-white font-extrabold"
                : "text-white/55 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 shrink-0 sm:hidden" />
            <span className="tracking-wider text-[10px] sm:text-xs">ÇİFT PP'LER</span>
            {currentTab === "profiles" && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E50914]" />
            )}
          </button>

          {/* Secret Tab */}
          <button
            onClick={() => setTab("secret")}
            id="tab-secret-btn"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs sm:text-sm transition-all duration-300 relative font-medium ${
              currentTab === "secret"
                ? "text-white font-extrabold"
                : "text-white/55 hover:text-white"
            }`}
          >
            {isUnlocked ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-white/40 shrink-0" />
            )}
            <span className="tracking-wider text-[10px] sm:text-xs">SIR ODASI</span>
            {currentTab === "secret" && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E50914]" />
            )}
            {!isUnlocked && (
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E50914]"></span>
              </span>
            )}
          </button>

          {/* Admin Tab */}
          <button
            onClick={() => setTab("admin")}
            id="tab-admin-btn"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs sm:text-sm transition-all duration-300 relative font-medium ${
              currentTab === "admin"
                ? "text-white font-extrabold"
                : "text-white/55 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 sm:hidden" />
            <span className="tracking-wider text-[10px] sm:text-xs">YÖNETİM</span>
            {currentTab === "admin" && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#E50914]" />
            )}
          </button>
        </div>

        {/* Right Side: Active Netflix Profile Dropdown */}
        {whoIsWatching && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center gap-1.5 focus:outline-none cursor-pointer group hover:opacity-90"
              id="toolbar-profile-btn"
            >
              {/* Profile Icon Avatar Grid */}
              <div className={`w-8 h-8 rounded bg-gradient-to-br ${getAvatarStyle()} flex items-center justify-center font-bold text-white text-[10px] shadow-md border border-white/10 group-hover:border-white transition-colors`}>
                {whoIsWatching.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)} 
                />
                <div 
                  className="absolute right-0 mt-2.5 w-44 bg-[#141414] border border-white/10 rounded-md shadow-2xl z-50 py-1.5 divide-y divide-white/5"
                  id="profile-dropdown"
                >
                  <div className="px-3.5 py-2 text-left">
                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">İzleyen Profil</p>
                    <p className="text-sm font-semibold text-[#e1e1e1] truncate">{whoIsWatching}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (onSwitchProfile) onSwitchProfile();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2 font-medium"
                    >
                      <Users className="w-3.5 h-3.5 text-[#E50914]" />
                      Profili Değiştir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
