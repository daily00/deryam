/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MiniGame1Data {
  photo: string; // Base64 or Unsplash URL
  question: string;
  choices: string[];
  correctAnswer: string;
}

export interface MiniGame2Data {
  phraseWithBlank: string; // e.g. "Sen benim en güzel _______sin"
  choices: string[];
  correctAnswer: string;   // e.g. "rüyam"
  hint: string;
}

export interface MiniGame3Data {
  lyricsQuestion: string; // Lyrics snippet or question about the song
  choices: string[];
  correctAnswer: string;
  songUrl: string; // Spotify search or Direct Audio URL
}

export interface MiniGame4Data {
  emojis: string; // e.g. "✈️🇮🇹🍕🏰"
  choices: string[];
  correctAnswer: string; // e.g. "İtalya tatili"
  hint: string;
}

export interface AdminSettings {
  anniversaryDate: string; // ISO String format
  firstMetDate?: string; // ISO String format for first met date
  partnerName1: string;
  partnerName2: string;
  partner1Birthday: string; // YYYY-MM-DD format, e.g. "1999-10-18"
  partner2Birthday: string; // YYYY-MM-DD format, e.g. "1997-05-12"
  secretPassword: string;
  secretLetter: string;
  homePhoto: string; // Base64 or elegant Unsplash default
  musicEmbed: string; // Spotify/Youtube Embed URL or simple search text
  musicType?: "spotify" | "youtube" | "device";
  musicVideoUrl?: string; // YouTube video link orEmbed
  musicVideoBase64?: string; // Local base64 video file
  game1: MiniGame1Data;
  game2: MiniGame2Data;
  game3: MiniGame3Data;
  game4: MiniGame4Data;
}

export interface GameProgress {
  game1Completed: boolean;
  game2Completed: boolean;
  game3Completed: boolean;
  game4Completed: boolean;
  isUnlockedExplicitly: boolean;
}
