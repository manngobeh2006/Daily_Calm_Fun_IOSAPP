import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export interface AudioTrack {
  id: string;
  name: string;
  generator: "white" | "brown" | "sine432";
  duration: number; // in seconds
  category: "nature" | "ambient" | "meditation" | "focus" | "sleep";
  description: string;
  premium: boolean;
}

export interface Soundscape {
  id: string;
  name: string;
  description: string;
  tracks: string[]; // Array of track IDs that can be mixed
  category: "nature" | "ambient" | "meditation" | "focus" | "sleep";
  premium: boolean;
}

// Predefined audio tracks (bundled AAC-LC .m4a)
export const audioTracks: AudioTrack[] = [
  {
    id: "rain_gentle",
    name: "Gentle Rain",
    generator: "white",
    duration: 600,
    category: "nature",
    description: "Soft rainfall for relaxation and focus",
    premium: false
  },
  {
    id: "ocean_waves",
    name: "Ocean Waves",
    generator: "brown",
    duration: 600,
    category: "nature",
    description: "Rhythmic ocean waves for deep relaxation",
    premium: false
  },
  {
    id: "forest_birds",
    name: "Forest Birds",
    generator: "white",
    duration: 600,
    category: "nature",
    description: "Peaceful bird songs in a forest setting",
    premium: true
  },
  {
    id: "tibetan_bowls",
    name: "Tibetan Singing Bowls",
    generator: "sine432",
    duration: 900,
    category: "meditation",
    description: "Sacred bowls for deep meditation",
    premium: true
  },
  {
    id: "white_noise",
    name: "White Noise",
    generator: "white",
    duration: 600,
    category: "focus",
    description: "Pure white noise for concentration",
    premium: false
  },
  {
    id: "brown_noise",
    name: "Brown Noise",
    generator: "brown",
    duration: 600,
    category: "focus",
    description: "Deep brown noise for focus and sleep",
    premium: true
  },
  {
    id: "campfire",
    name: "Crackling Campfire",
    generator: "brown",
    duration: 600,
    category: "ambient",
    description: "Warm crackling fire sounds",
    premium: true
  },
  {
    id: "thunderstorm",
    name: "Distant Thunder",
    generator: "brown",
    duration: 600,
    category: "nature",
    description: "Gentle thunderstorm for deep sleep",
    premium: true
  }
];

// Predefined soundscapes (combinations of tracks)
export const soundscapes: Soundscape[] = [
  {
    id: "rainy_forest",
    name: "Rainy Forest",
    description: "Gentle rain with forest birds",
    tracks: ["rain_gentle", "forest_birds"],
    category: "nature",
    premium: true
  },
  {
    id: "ocean_meditation",
    name: "Ocean Meditation",
    description: "Ocean waves with Tibetan bowls",
    tracks: ["ocean_waves", "tibetan_bowls"],
    category: "meditation",
    premium: true
  },
  {
    id: "cozy_evening",
    name: "Cozy Evening",
    description: "Campfire with distant rain",
    tracks: ["campfire", "rain_gentle"],
    category: "ambient",
    premium: true
  },
  {
    id: "focus_zone",
    name: "Focus Zone",
    description: "Brown noise with subtle nature sounds",
    tracks: ["brown_noise", "forest_birds"],
    category: "focus",
    premium: true
  }
];

class AudioManager {
  private static instance: AudioManager;
  private currentSound: Audio.Sound | null = null;
  private mixedSounds: Audio.Sound[] = [];
  private currentTrack: AudioTrack | null = null;
  private currentVolume: number = 0.7;
   private isPlaying: boolean = false;
   private lastError: string | null = null;

   private async ensureDir(path: string) {
     const info = await FileSystem.getInfoAsync(path);
     if (!(info as any).exists) {
       await FileSystem.makeDirectoryAsync(path, { intermediates: true });
     }
   }

   private bytesToBase64(bytes: Uint8Array): string {
     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
     let result = "";
     let i = 0;
     const len = bytes.length;
     while (i < len) {
       const b1 = bytes[i++] ?? 0;
       const b2 = bytes[i++] ?? 0;
       const b3 = bytes[i++] ?? 0;
       const triplet = (b1 << 16) | (b2 << 8) | b3;
       result += chars[(triplet >> 18) & 0x3f] + chars[(triplet >> 12) & 0x3f] + chars[(triplet >> 6) & 0x3f] + chars[triplet & 0x3f];
     }
     const mod = len % 3;
     if (mod) {
       result = result.slice(0, mod - 3);
       while (result.length % 4) result += "=";
     }
     return result;
   }

   private createWavPCM(samples: Float32Array, sampleRate: number = 44100): Uint8Array {
     const numChannels = 1;
     const bytesPerSample = 2; // 16-bit
     const blockAlign = numChannels * bytesPerSample;
     const byteRate = sampleRate * blockAlign;
     const dataSize = samples.length * bytesPerSample;
     const buffer = new ArrayBuffer(44 + dataSize);
     const view = new DataView(buffer);
     let offset = 0;

     const writeString = (s: string) => {
       for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
       offset += s.length;
     };

     writeString("RIFF");
     view.setUint32(offset, 36 + dataSize, true); offset += 4;
     writeString("WAVE");
     writeString("fmt ");
     view.setUint32(offset, 16, true); offset += 4; // PCM chunk size
     view.setUint16(offset, 1, true); offset += 2; // PCM format
     view.setUint16(offset, numChannels, true); offset += 2;
     view.setUint32(offset, sampleRate, true); offset += 4;
     view.setUint32(offset, byteRate, true); offset += 4;
     view.setUint16(offset, blockAlign, true); offset += 2;
     view.setUint16(offset, 16, true); offset += 2; // bits per sample
     writeString("data");
     view.setUint32(offset, dataSize, true); offset += 4;

     // samples
     let sOffset = 44;
     for (let i = 0; i < samples.length; i++) {
       let v = Math.max(-1, Math.min(1, samples[i]));
       view.setInt16(sOffset, v < 0 ? v * 0x8000 : v * 0x7fff, true);
       sOffset += 2;
     }

     return new Uint8Array(buffer);
   }

   private generateSamples(kind: "white" | "brown" | "sine432", seconds: number = 5, sampleRate: number = 44100): Float32Array {
     const total = seconds * sampleRate;
     const out = new Float32Array(total);
     if (kind === "white") {
       for (let i = 0; i < total; i++) out[i] = (Math.random() * 2 - 1) * 0.2;
     } else if (kind === "brown") {
       let last = 0;
       for (let i = 0; i < total; i++) {
         const rnd = Math.random() * 2 - 1;
         last = (last + 0.02 * rnd);
         if (last > 1) last = 1; if (last < -1) last = -1;
         out[i] = last * 0.4;
       }
     } else {
       const f = 432;
       for (let i = 0; i < total; i++) {
         const t = i / sampleRate;
         const env = Math.min(1, t / 0.1) * Math.min(1, (seconds - t) / 0.1);
         out[i] = (Math.sin(2 * Math.PI * f * t) * 0.2 + Math.sin(2 * Math.PI * f * 2 * t) * 0.1) * env;
       }
     }
     return out;
   }

   private async getLocalUriForTrack(track: AudioTrack): Promise<string> {
     const dir = FileSystem.cacheDirectory + "audio_gen/";
     await this.ensureDir(dir);
     const file = `${dir}${track.id}.wav`;
     const info = await FileSystem.getInfoAsync(file);
     if ((info as any).exists) return file;
     const samples = this.generateSamples(track.generator);
     const wav = this.createWavPCM(samples, 44100);
     const b64 = this.bytesToBase64(wav);
     await FileSystem.writeAsStringAsync(file, b64, { encoding: FileSystem.EncodingType.Base64 as any });
     return file;
   }

  private constructor() {
    this.initializeAudio();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  getLastError(): string | null {
    return this.lastError;
  }

  async playTrack(trackId: string, loop: boolean = true): Promise<boolean> {
    try {
      this.lastError = null;
      await this.stopCurrentAudio();

      const track = audioTracks.find(t => t.id === trackId);
      if (!track) {
        this.lastError = "Track not found";
        console.error("Track not found:", trackId);
        return false;
      }

      const localUri = await this.getLocalUriForTrack(track);
      const { sound } = await Audio.Sound.createAsync(
        { uri: localUri },
        {
          shouldPlay: true,
          volume: this.currentVolume,
          isLooping: loop,
        }
      );

      this.currentSound = sound;
      this.currentTrack = track;
      this.isPlaying = true;

      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish && !status.isLooping) {
          this.isPlaying = false;
        }
        if (!status.isLoaded && status.error) {
          this.lastError = status.error;
        }
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.lastError = message;
      console.error("Failed to play track:", message);
      return false;
    }
  }

  async playSoundscape(soundscapeId: string, loop: boolean = true): Promise<boolean> {
    try {
      this.lastError = null;
      await this.stopCurrentAudio();

      const soundscape = soundscapes.find(s => s.id === soundscapeId);
      if (!soundscape) {
        this.lastError = "Soundscape not found";
        console.error("Soundscape not found:", soundscapeId);
        return false;
      }

      const promises = soundscape.tracks.map(async (trackId) => {
         const track = audioTracks.find(t => t.id === trackId);
         if (!track) return null;
         const localUri = await this.getLocalUriForTrack(track);
         const { sound } = await Audio.Sound.createAsync(
           { uri: localUri },
           {
             shouldPlay: true,
             volume: this.currentVolume * 0.7,
             isLooping: loop,
           }
         );
         return sound;
      });

      const sounds = await Promise.all(promises);
      this.mixedSounds = sounds.filter(Boolean) as Audio.Sound[];
      this.isPlaying = this.mixedSounds.length > 0;
      return this.isPlaying;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.lastError = message;
      console.error("Failed to play soundscape:", message);
      return false;
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.currentSound) await this.currentSound.pauseAsync();
      for (const s of this.mixedSounds) await s.pauseAsync();
      this.isPlaying = false;
    } catch (error) {
      console.error("Failed to pause audio:", error);
    }
  }

  async resume(): Promise<void> {
    try {
      if (this.currentSound) await this.currentSound.playAsync();
      for (const s of this.mixedSounds) await s.playAsync();
      this.isPlaying = true;
    } catch (error) {
      console.error("Failed to resume audio:", error);
    }
  }

  async stop(): Promise<void> {
    await this.stopCurrentAudio();
  }

  private async stopCurrentAudio(): Promise<void> {
    try {
      if (this.currentSound) {
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      for (const s of this.mixedSounds) await s.unloadAsync();
      this.mixedSounds = [];
      this.isPlaying = false;
      this.currentTrack = null;
    } catch (error) {
      console.error("Failed to stop audio:", error);
    }
  }

  async setVolume(volume: number): Promise<void> {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    try {
      if (this.currentSound) await this.currentSound.setVolumeAsync(this.currentVolume);
      for (const s of this.mixedSounds) await s.setVolumeAsync(this.currentVolume * 0.7);
    } catch (error) {
      console.error("Failed to set volume:", error);
    }
  }

  getVolume(): number {
    return this.currentVolume;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }

  resolveAlias(idOrAlias: string): string {
    const map: Record<string, string> = {
      gentle_waves: "ocean_waves",
      focus_tones: "white_noise",
      sleep_sounds: "rain_gentle",
      forest_sounds: "forest_birds",
      gentle_bells: "tibetan_bowls",
    };
    return map[idOrAlias] || idOrAlias;
  }

  getAvailableTracks(category?: string, premiumOnly?: boolean): AudioTrack[] {
    let tracks = audioTracks;
    if (category) tracks = tracks.filter(t => t.category === category);
    if (premiumOnly !== undefined) tracks = tracks.filter(t => t.premium === premiumOnly);
    return tracks;
  }

  getAvailableSoundscapes(category?: string, premiumOnly?: boolean): Soundscape[] {
    let scapes = soundscapes;
    if (category) scapes = scapes.filter(s => s.category === category);
    if (premiumOnly !== undefined) scapes = scapes.filter(s => s.premium === premiumOnly);
    return scapes;
  }

  async playWithTimer(trackId: string, durationMinutes: number): Promise<void> {
    const ok = await this.playTrack(trackId, true);
    if (!ok) return;
    setTimeout(async () => {
      await this.stop();
    }, durationMinutes * 60 * 1000);
  }
}

export default AudioManager;
