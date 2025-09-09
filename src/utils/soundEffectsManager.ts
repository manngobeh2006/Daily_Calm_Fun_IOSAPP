import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export interface SoundEffect {
  id: string;
  name: string;
  file: string;
  sound?: Audio.Sound;
}

class SoundEffectsManager {
  private static instance: SoundEffectsManager;
  private soundEffects: Map<string, Audio.Sound> = new Map();
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): SoundEffectsManager {
    if (!SoundEffectsManager.instance) {
      SoundEffectsManager.instance = new SoundEffectsManager();
    }
    return SoundEffectsManager.instance;
  }

  private soundEffectsList: SoundEffect[] = [
    {
      id: "pop",
      name: "Bubble Pop",
      file: "pop.wav"
    }
  ];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      // Preload all sound effects
      for (const sfx of this.soundEffectsList) {
        try {
          let assetModule;
          
          // Map sound effect files to their require paths
          switch (sfx.file) {
            case "pop.wav":
              assetModule = require("../../assets/sfx/pop.wav");
              break;
            default:
              console.warn(`Unknown sound effect file: ${sfx.file}`);
              continue;
          }
          
          const asset = Asset.fromModule(assetModule);
          await asset.downloadAsync();
          
          const { sound } = await Audio.Sound.createAsync(
            { uri: asset.localUri || asset.uri },
            {
              shouldPlay: false,
              volume: 0.7,
              isLooping: false,
            }
          );
          
          this.soundEffects.set(sfx.id, sound);
        } catch (error) {
          console.warn(`Failed to preload sound effect ${sfx.id}:`, error);
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize SoundEffectsManager:", error);
    }
  }

  async playSound(soundId: string, volume: number = 0.7): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const sound = this.soundEffects.get(soundId);
      if (!sound) {
        console.warn(`Sound effect ${soundId} not found`);
        return false;
      }

      // Reset to beginning and play
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      await sound.playAsync();
      
      return true;
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error);
      return false;
    }
  }

  async setVolume(soundId: string, volume: number): Promise<void> {
    try {
      const sound = this.soundEffects.get(soundId);
      if (sound) {
        await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      }
    } catch (error) {
      console.error(`Failed to set volume for sound ${soundId}:`, error);
    }
  }

  async stopSound(soundId: string): Promise<void> {
    try {
      const sound = this.soundEffects.get(soundId);
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error(`Failed to stop sound ${soundId}:`, error);
    }
  }

  async stopAllSounds(): Promise<void> {
    try {
      for (const sound of this.soundEffects.values()) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error("Failed to stop all sounds:", error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      for (const sound of this.soundEffects.values()) {
        await sound.unloadAsync();
      }
      this.soundEffects.clear();
      this.isInitialized = false;
    } catch (error) {
      console.error("Failed to cleanup SoundEffectsManager:", error);
    }
  }

  getAvailableSounds(): SoundEffect[] {
    return this.soundEffectsList;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export default SoundEffectsManager;