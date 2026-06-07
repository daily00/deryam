/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminSettings, GameProgress } from "../types";

export const DEFAULT_SETTINGS: AdminSettings = {
  anniversaryDate: "2024-05-18T20:00:00",
  firstMetDate: "2024-05-18T20:00:00",
  partnerName1: "Derya",
  partnerName2: "Yusuf",
  partner1Birthday: "1999-10-18",
  partner2Birthday: "1997-05-12",
  secretPassword: "deryam",
  secretLetter: `Sevgilim, Bitanem, Derya'm...\n\nBu mektup, kalbimin sana olan en derin köşesinden yazıldı. Seninle geçirdiğim her gün, hayatımın en değerli anısı haline geldi. \n\nGözlerindeki sıcaklıkta huzuru, gülüşünde ise yaşam enerjimi buluyorum. Yollarımız kesiştiğinden beri dünya benim için çok daha renkli ve yaşanılası bir yer oldu. İyi ki varsın, iyi ki hayatımdasın. \n\nBirlikte yaşayacağımız nice güzel yıllara, ortak yeni hayallerimize ve sonsuz sevgimize... Seni tüm kalbimle seviyorum! ❤️`,
  homePhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200",
  musicEmbed: "https://open.spotify.com/embed/track/2S86Sj0qAnk30X4N9oXh6A", // Default elegant track (e.g. romantic song)
  musicType: "spotify",
  musicVideoUrl: "https://www.youtube.com/watch?v=FjI1VbeR6qU",
  musicVideoBase64: "",
  game1: {
    photo: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=600", // A mountain/camp path
    question: "İlk kamp/tatil yolcuğumuz nerede gerçekleşmişti?",
    choices: ["Kapadokya", "Fethiye Ölüdeniz", "Bolu Abant", "Antalya Kaş"],
    correctAnswer: "Fethiye Ölüdeniz"
  },
  game2: {
    phraseWithBlank: "Sen benim karanlık gecelerimi aydınlatan gökteki tek _______sin.",
    choices: ["güneşimsin", "yıldızımsın", "nefesimsin", "ışığımsın"],
    correctAnswer: "yıldızımsın",
    hint: "Gece gökyüzünde parlayan ve yol gösteren bir şey..."
  },
  game3: {
    lyricsQuestion: "\"Seninle her şeye varım ben / Sen benim her şeyimsin\" sözleriyle bilinen, bizim için yeri çok ayrı olan şarkımızın adı nedir?",
    choices: ["Evlenir misin Benimle", "Gözlerinin Hapsindeyim", "Sen Kalbimin Sırdaşı", "Senden Daha Güzel"],
    correctAnswer: "Gözlerinin Hapsindeyim",
    songUrl: "https://www.youtube.com/watch?v=FjI1VbeR6qU"
  },
  game4: {
    emojis: "✈️ 🍕 🇮🇹 💑 🏰",
    choices: ["Roma Tatili", "Paris Kaçamağı", "Ege Tekne Turu", "Kapadokya Gezisi"],
    correctAnswer: "Roma Tatili",
    hint: "Uçakla gidilen, pizza yenen ve tarihi kalelerin olduğu o çok dilediğimiz romantik Avrupa şehri..."
  }
};

export const DEFAULT_PROGRESS: GameProgress = {
  game1Completed: false,
  game2Completed: false,
  game3Completed: false,
  game4Completed: false,
  isUnlockedExplicitly: false
};

const SETTINGS_KEY = "deryam_admin_settings_v1";
const PROGRESS_KEY = "deryam_game_progress_v1";

export function loadSettings(): AdminSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge to handle fields if structure updates
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error("Error loading settings from localStorage:", e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AdminSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings to localStorage:", e);
  }
}

export function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading progress from localStorage:", e);
  }
  return DEFAULT_PROGRESS;
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Error saving progress to localStorage:", e);
  }
}
