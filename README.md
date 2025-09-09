# Daily Calm & Fun - iOS Meditation & Wellness App

<div align="center">

![Daily Calm & Fun Logo](https://img.shields.io/badge/Daily%20Calm%20%26%20Fun-Meditation%20App-purple?style=for-the-badge)

[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.9-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*A comprehensive meditation and wellness React Native app with activity-specific UX, gamification, and premium features*

[Features](#features) • [Installation](#installation) • [Contributing](#contributing) • [License](#license)

</div>

## 🌟 Overview

Daily Calm & Fun is a feature-rich meditation and wellness app built with React Native and Expo. It offers personalized daily activities, gamification elements, and premium features to help users build healthy mindfulness habits.

### ✨ Key Highlights

- **10+ Activity Types**: Progressive Muscle Relaxation, Box Breathing, Body Scan, Attention Training, and more
- **Activity-Specific UX**: Each activity has custom animations, sound effects, and interactive elements
- **Gamification System**: Streaks, badges, progress tracking, and achievement celebrations
- **Premium Features**: Advanced activities, mood tracking, relaxation library, and ad-free experience
- **Cross-Platform**: iOS, Android, and Web support through Expo
- **Modern Tech Stack**: React Native, TypeScript, Zustand, NativeWind, and Lottie animations

## 🎯 Features

### 🧘 Core Activities

#### Relaxation Activities
- **Progressive Muscle Relaxation**: Step-by-step muscle tension release with PMR animation
- **Box Breathing**: Military-grade breathing technique with bubble pop sound effects
- **Body Scan**: Synchronized animation with guided body awareness steps
- **Panic Attack SOS**: Emergency calming technique with soothing animations
- **Quick Anxiety Reset**: Fast anxiety relief with journaling and animation

#### Learning Activities
- **Attention Training**: Go/No-Go mini-game with performance analytics (⭐ targets vs ●▲■ distractors)
- **Mental Clarity Practice**: Cognitive enhancement exercises
- **Mindfulness Education**: Interactive learning with quizzes and facts

#### Creative Activities
- **Gratitude Reflection**: Enhanced journaling with keyboard-aware interface
- **5-4-3-2-1 Grounding**: Multi-field sensory grounding exercise
- **Afternoon Energy Revival**: Movement-based energy building with step guidance

### 🎮 Gamification System

- **Daily Streaks**: Visual streak tracking with milestone celebrations
- **Achievement Badges**: 10+ different badges for various accomplishments
- **Progress Analytics**: Detailed statistics and completion tracking
- **Spin Wheel Rewards**: Daily rewards for premium users

### 💎 Premium Features

- **Subscription Plans**: Monthly ($1.99), Yearly ($19.99), Lifetime ($29.99)
- **7-Day Free Trial**: Risk-free premium experience
- **Relaxation Library**: Extended meditation library with background music
- **Mood Tracker**: Daily mood logging with insights and PDF export
- **Advanced Tools**: Enhanced features and ad-free experience

### 🔧 Technical Features

- **Sound System**: Global and per-activity sound preferences with real-time toggles
- **Keyboard Handling**: Smart keyboard avoidance with auto-scroll to active inputs
- **Visual Feedback**: Lottie animations synchronized with activity content
- **Progress Tracking**: Step-by-step guidance with visual progress indicators
- **Persistent Storage**: Activity preferences and journal entries saved locally

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher) or **Bun** (recommended)
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Simulator** (macOS) or **Android Studio** (for Android development)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP.git
   cd Daily_Calm_Fun_IOSAPP
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys (see Environment Variables section)
   ```

4. **Start the development server**
   ```bash
   bun start
   # or
   npm start
   ```

5. **Run on your preferred platform**
   - **iOS**: Press `i` in the terminal or `bun ios`
   - **Android**: Press `a` in the terminal or `bun android`
   - **Web**: Press `w` in the terminal or `bun web`

## 🔑 Environment Variables

The app requires several API keys for full functionality. Copy `.env.example` to `.env` and fill in your keys:

```bash
# OpenAI API Key for content generation
EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key for Claude AI integration
EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Grok API Key for X.AI integration
EXPO_PUBLIC_VIBECODE_GROK_API_KEY=your_grok_api_key_here

# Google API Key for additional services
EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY=your_google_api_key_here

# ElevenLabs API Key for text-to-speech features
EXPO_PUBLIC_VIBECODE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Where to Get API Keys

- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **Grok**: [console.x.ai](https://console.x.ai/)
- **Google**: [console.cloud.google.com](https://console.cloud.google.com/)
- **ElevenLabs**: [elevenlabs.io](https://elevenlabs.io/)

> **Note**: The app will work with limited features if some keys are missing. Core meditation activities will still function without API keys.

## 📁 Project Structure

```
Daily_Calm_Fun_IOSAPP/
├── src/
│   ├── api/                    # API integrations and services
│   │   ├── anthropic.ts        # Claude AI integration
│   │   ├── openai.ts          # OpenAI GPT integration
│   │   ├── chat-service.ts    # Unified chat service
│   │   └── ...
│   ├── components/            # Reusable UI components
│   │   ├── activities/        # Activity-specific components
│   │   │   ├── RelaxActivity.tsx
│   │   │   ├── LearnActivity.tsx
│   │   │   └── CreateActivity.tsx
│   │   ├── KeyboardAwareContainer.tsx
│   │   ├── StepList.tsx
│   │   ├── GoNoGoGame.tsx
│   │   └── ...
│   ├── screens/               # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── ActivitiesScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   └── ...
│   ├── navigation/            # Navigation configuration
│   ├── state/                 # Zustand stores
│   │   ├── userStore.ts       # User preferences and settings
│   │   ├── activitiesStore.ts # Activity data and progress
│   │   └── ...
│   ├── data/                  # Static data and configurations
│   │   ├── expandedActivities.ts
│   │   └── badges.ts
│   ├── utils/                 # Utility functions
│   │   ├── soundEffectsManager.ts
│   │   └── ...
│   └── types/                 # TypeScript type definitions
├── assets/                    # Static assets
│   ├── anim/                  # Lottie animations
│   ├── audio/                 # Audio files
│   ├── sfx/                   # Sound effects
│   └── animations/            # Additional animations
├── App.tsx                    # Main app component
├── package.json
└── README.md
```

## 🛠️ Development

### Available Scripts

- `bun start` - Start the Expo development server
- `bun ios` - Run on iOS simulator
- `bun android` - Run on Android emulator
- `bun web` - Run on web browser
- `bun lint` - Run ESLint
- `bun lint:fix` - Fix ESLint issues
- `bun type-check` - Run TypeScript type checking

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **NativeWind** for styling (Tailwind CSS for React Native)

### State Management

The app uses **Zustand** with AsyncStorage persistence:
- `userStore.ts` - User preferences, subscription status, sound settings
- `activitiesStore.ts` - Daily activities, completion tracking, streaks
- `moodStore.ts` - Mood tracking data
- `gamificationStore.ts` - Badges, achievements, progress

## 🎨 Design System

### Styling
- **NativeWind + Tailwind CSS** for consistent styling
- **Apple Human Interface Guidelines** compliance
- **Responsive design** for various screen sizes
- **Dark mode support** (planned)

### Animations
- **Lottie animations** for activity-specific visuals
- **React Native Reanimated v3** for smooth transitions
- **Gesture handling** with react-native-gesture-handler

### Audio System
- **Expo AV** for audio playback
- **Sound effects manager** with preloading and volume control
- **User-configurable** sound preferences per activity

## 🧪 Testing

Currently, the project uses manual testing. Planned testing improvements:
- **Jest** for unit testing
- **React Native Testing Library** for component testing
- **Detox** for E2E testing
- **GitHub Actions** for CI/CD

## 📱 Platform Support

- **iOS** (Primary target)
- **Android** (Full support)
- **Web** (Limited support via Expo Web)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun lint && bun type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Areas for Contribution

- 🎨 **UI/UX improvements**
- 🧘 **New meditation activities**
- 🎵 **Audio content and sound effects**
- 🎮 **Gamification features**
- 🧪 **Testing and quality assurance**
- 📚 **Documentation improvements**
- 🌐 **Internationalization**
- ♿ **Accessibility enhancements**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing React Native framework
- **Lottie** for beautiful animations
- **OpenAI, Anthropic, and other AI providers** for content generation
- **React Native Community** for excellent libraries and tools
- **Contributors** who help make this app better

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/issues)
- **Discussions**: [GitHub Discussions](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/discussions)
- **Email**: [Create an issue](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/issues/new) for support requests

---

<div align="center">

**Made with ❤️ for mental wellness and mindfulness**

[⭐ Star this repo](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP) if you find it helpful!

</div>