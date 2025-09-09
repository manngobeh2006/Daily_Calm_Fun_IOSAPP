import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

export class FeedbackUtils {
  private static soundEnabled = true;
  private static hapticEnabled = true;

  // Haptic feedback methods
  static async lightHaptic() {
    if (this.hapticEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }

  static async mediumHaptic() {
    if (this.hapticEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }

  static async heavyHaptic() {
    if (this.hapticEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }

  static async successHaptic() {
    if (this.hapticEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }

  static async warningHaptic() {
    if (this.hapticEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }

  static async errorHaptic() {
    if (this.hapticEnabled) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }

  // Sound effect methods
  static async playButtonSound() {
    if (this.soundEnabled) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/bubble-pop.wav')
        );
        await sound.setVolumeAsync(0.3);
        await sound.playAsync();
        
        // Unload sound after playing
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.log('Sound playback failed');
      }
    }
  }

  static async playSuccessSound() {
    if (this.soundEnabled) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/bubble-pop.wav')
        );
        await sound.setVolumeAsync(0.5);
        await sound.playAsync();
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.log('Sound playback failed');
      }
    }
  }

  // Combined feedback methods
  static async buttonPress() {
    await Promise.all([
      this.lightHaptic(),
      this.playButtonSound()
    ]);
  }

  static async activityComplete() {
    await Promise.all([
      this.successHaptic(),
      this.playSuccessSound()
    ]);
  }

  static async cardPress() {
    await this.mediumHaptic();
  }

  static async navigationPress() {
    await this.lightHaptic();
  }

  // Settings methods
  static setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  static setHapticEnabled(enabled: boolean) {
    this.hapticEnabled = enabled;
  }

  static getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  static getHapticEnabled(): boolean {
    return this.hapticEnabled;
  }
}