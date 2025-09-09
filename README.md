# Daily Calm & Fun - iOS Meditation & Wellness App 🧘‍♀️

<div align="center">

![Daily Calm & Fun Logo](https://img.shields.io/badge/Daily%20Calm%20%26%20Fun-Meditation%20App-purple?style=for-the-badge&logo=meditation)

[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.9-black.svg?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AI Powered](https://img.shields.io/badge/AI%20Powered-OpenAI%20%7C%20Anthropic-green.svg)](#ai-integration)

*A comprehensive meditation and wellness React Native app with AI-powered content, activity-specific UX, gamification, and premium features*

[🌟 Features](#-features) • [🚀 Quick Start](#-quick-start) • [📱 Screenshots](#-screenshots) • [🤖 AI Integration](#-ai-integration) • [🤝 Contributing](#-contributing)

</div>

## 🌟 Overview

Daily Calm & Fun is a feature-rich meditation and wellness app built with React Native and Expo. It combines the power of AI-generated personalized content with beautifully crafted user experiences to help users build sustainable mindfulness habits.

### ✨ Key Highlights

- **🤖 AI-Powered Content**: Dynamic content generation using OpenAI, Anthropic Claude, and Grok AI
- **🎯 10+ Activity Types**: Progressive Muscle Relaxation, Box Breathing, Body Scan, Attention Training, and more
- **🎨 Activity-Specific UX**: Each activity has custom Lottie animations, sound effects, and interactive elements
- **🏆 Gamification System**: Daily streaks, achievement badges, progress tracking, and milestone celebrations
- **💎 Premium Features**: Advanced activities, mood tracking, relaxation library, and ad-free experience
- **📱 Cross-Platform**: iOS, Android, and Web support through Expo
- **⚡ Modern Tech Stack**: React Native 0.79, TypeScript, Zustand, NativeWind, and Lottie animations
- **🎵 Rich Audio Experience**: Nature sounds, guided meditations, and interactive sound effects

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

## 📱 Screenshots

> **Note**: Screenshots will be added soon. The app features a beautiful purple/pink gradient design with smooth animations and intuitive navigation.

### App Flow Preview
- **Onboarding**: Welcome → Value Proposition → Premium Trial
- **Daily Use**: Home Dashboard → Activity Selection → Guided Experience
- **Progress**: Streak Tracking → Badge Collection → Analytics
- **Premium**: Relaxation Library → Mood Tracker → Advanced Tools

## 🤖 AI Integration

This app leverages multiple AI services to provide personalized, dynamic content:

### Supported AI Providers
- **🔵 OpenAI GPT-4**: Content generation, personalized activities
- **🟣 Anthropic Claude**: Thoughtful wellness guidance, meditation scripts
- **🔴 Grok AI**: Creative and engaging activity variations
- **🟡 Google AI**: Additional content enhancement
- **🎙️ ElevenLabs**: Text-to-speech for guided meditations

### AI-Powered Features
- **Dynamic Activities**: AI generates unique daily content
- **Personalized Guidance**: Tailored meditation and wellness advice
- **Content Variety**: Endless variations of activities to prevent monotony
- **Smart Recommendations**: AI suggests activities based on user patterns

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) or **Bun** (recommended for faster builds)
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Simulator** (macOS) or **Android Studio** (for Android development)
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP.git
   cd Daily_Calm_Fun_IOSAPP
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended - faster than npm)
   bun install
   
   # Or using npm
   npm install
   
   # Or using Yarn
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env and add your API keys
   nano .env  # or use your preferred editor
   ```
   > **⚠️ Important**: The app will work with limited features if API keys are missing, but for the full experience, add your API keys.

4. **Start the development server**
   ```bash
   # Start Expo development server
   bun start
   # or
   expo start --clear
   ```

5. **Run on your preferred platform**
   ```bash
   # iOS (requires macOS and Xcode)
   bun ios          # or press 'i' in Expo CLI
   
   # Android (requires Android Studio)
   bun android      # or press 'a' in Expo CLI
   
   # Web Browser
   bun web          # or press 'w' in Expo CLI
   ```

## 🔑 Environment Variables

The app uses multiple AI services for dynamic content generation. Create a `.env` file with your API keys:

```bash
# 🔵 OpenAI API Key for content generation and GPT integration
EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY=sk-your_openai_api_key_here

# 🟣 Anthropic API Key for Claude AI integration
EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 🔴 Grok API Key for X.AI integration
EXPO_PUBLIC_VIBECODE_GROK_API_KEY=your_grok_api_key_here

# 🟡 Google API Key for additional AI services
EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY=your_google_api_key_here

# 🎙️ ElevenLabs API Key for text-to-speech features
EXPO_PUBLIC_VIBECODE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Where to Get API Keys

- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **Grok**: [console.x.ai](https://console.x.ai/)
- **Google**: [console.cloud.google.com](https://console.cloud.google.com/)
- **ElevenLabs**: [elevenlabs.io](https://elevenlabs.io/)

### 🔒 API Key Security
- **Never commit API keys** to version control
- **Use environment variables** for all sensitive data
- **Rotate keys regularly** for production apps
- **Monitor usage** to prevent unexpected charges

> **💡 Tip**: The app will work with limited features if some keys are missing. Core meditation activities and basic functionality will still work without API keys, but AI-powered content generation will be disabled.

## 📁 Project Structure

```
Daily_Calm_Fun_IOSAPP/
├── 📁 src/                           # Source code
│   ├── 🤖 api/                       # AI & API integrations
│   │   ├── anthropic.ts              # Claude AI service
│   │   ├── openai.ts                # GPT integration
│   │   ├── grok.ts                  # X.AI Grok service
│   │   ├── chat-service.ts          # Unified AI chat
│   │   ├── content-generator.ts     # Dynamic content creation
│   │   ├── transcribe-audio.ts      # Audio transcription
│   │   └── subscription-service.ts  # Premium features
│   ├── 🧩 components/               # Reusable UI components
│   │   ├── activities/              # Activity-specific UI
│   │   │   ├── RelaxActivity.tsx    # Meditation & breathing
│   │   │   ├── LearnActivity.tsx    # Educational content
│   │   │   ├── CreateActivity.tsx   # Creative exercises
│   │   │   └── MeditationActivity.tsx
│   │   ├── AudioPlayer.tsx          # Sound system
│   │   ├── SpinWheel.tsx           # Gamification
│   │   ├── GoNoGoGame.tsx          # Attention training
│   │   ├── KeyboardAwareContainer.tsx
│   │   └── StepList.tsx            # Progress tracking
│   ├── 📱 screens/                  # App screens
│   │   ├── HomeScreen.tsx           # Dashboard
│   │   ├── ActivitiesScreen.tsx     # Daily activities
│   │   ├── ProgressScreen.tsx       # Stats & badges
│   │   ├── MoodTrackerScreen.tsx    # Mood logging
│   │   ├── PremiumScreen.tsx        # Subscription
│   │   └── onboarding/              # Welcome flow
│   ├── 🗺️ navigation/               # App navigation
│   │   ├── AppNavigator.tsx         # Main navigation
│   │   └── OnboardingNavigator.tsx  # Welcome flow
│   ├── 🎪 state/                    # State management (Zustand)
│   │   ├── userStore.ts             # User data & preferences
│   │   ├── activitiesStore.ts       # Activity tracking
│   │   ├── moodStore.ts             # Mood data
│   │   └── gamificationStore.ts     # Badges & streaks
│   ├── 📊 data/                     # Static content
│   │   ├── expandedActivities.ts    # Activity definitions
│   │   ├── sampleActivities.ts      # Fallback content
│   │   └── badges.ts                # Achievement system
│   ├── 🔧 utils/                    # Helper functions
│   │   ├── audioManager.ts          # Sound system
│   │   ├── soundEffectsManager.ts   # Audio effects
│   │   ├── personalizationEngine.ts # AI personalization
│   │   └── feedbackUtils.ts         # User feedback
│   └── 📝 types/                    # TypeScript definitions
│       ├── navigation.ts            # Navigation types
│       └── ai.ts                    # AI service types
├── 🎨 assets/                       # Static assets
│   ├── 🎭 anim/                     # Lottie animations
│   │   ├── breathing.json           # Breathing guides
│   │   ├── meditation.json          # Meditation visuals
│   │   └── progress.json            # Achievement animations
│   ├── 🎵 audio/                    # Audio files
│   │   ├── nature sounds/           # Ocean, rain, forest
│   │   └── guided meditations/      # Voice guides
│   └── 🔊 sfx/                      # Sound effects
│       └── interaction sounds/      # UI feedback
├── ⚛️ App.tsx                       # Main app entry point
├── 📦 package.json                  # Dependencies & scripts
├── 🔧 metro.config.js              # Bundler configuration
├── 🎨 tailwind.config.js           # Styling configuration
└── 📚 README.md                     # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Development
bun start          # Start Expo development server
bun ios            # Run on iOS simulator
bun android        # Run on Android emulator  
bun web            # Run on web browser

# Code Quality
bun lint           # Run ESLint
bun lint:fix       # Fix ESLint issues automatically
bun type-check     # Run TypeScript type checking
bun format         # Format code with Prettier

# Building
bun build:ios      # Build for iOS
bun build:android  # Build for Android
bun build:web      # Build for web
```

### Development Workflow

1. **🔥 Hot Reload**: Changes are reflected instantly
2. **🐛 Debugging**: Use Flipper or React Native Debugger
3. **📱 Device Testing**: Test on physical devices via Expo Go
4. **🧪 Testing**: Run unit tests and E2E tests
5. **📦 Building**: Create production builds for app stores

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

## 🎨 Design System & Architecture

### 🎨 Visual Design
- **🎨 NativeWind + Tailwind CSS** for consistent, utility-first styling
- **📱 Apple Human Interface Guidelines** compliance for iOS
- **📱 Material Design** principles for Android
- **📱 Responsive design** optimized for all screen sizes
- **🌙 Dark mode support** (coming soon)
- **♿ Accessibility** with proper contrast ratios and screen reader support

### 💫 Animations & Interactions
- **🎭 Lottie animations** for beautiful, lightweight activity visuals
- **⚡ React Native Reanimated v3** for 60fps smooth transitions
- **👆 Gesture handling** with react-native-gesture-handler
- **🎪 Micro-interactions** for enhanced user engagement
- **📈 Progress animations** for visual feedback

### 🎵 Audio System
- **🎼 Expo AV** for high-quality audio playback
- **🔊 Sound effects manager** with intelligent preloading and caching
- **🎚️ User-configurable** volume and sound preferences per activity
- **🌊 Nature sounds**: Ocean, rain, forest, campfire, and more
- **🎯 Interactive audio**: Bubble pops, completion chimes, etc.

### 🏗️ Technical Architecture
- **⚛️ React Native 0.79** with latest performance optimizations
- **📘 TypeScript** for type safety and better developer experience
- **🐻 Zustand** for lightweight, efficient state management
- **💾 AsyncStorage** with automatic data persistence
- **🔄 Hot reloading** for rapid development cycles

## 🧪 Testing & Quality Assurance

### Current Testing Status
- **✅ Manual Testing**: Comprehensive manual testing across platforms
- **✅ Type Safety**: Full TypeScript coverage for compile-time safety
- **✅ Linting**: ESLint + Prettier for code quality
- **✅ Performance**: React Native performance monitoring

### Planned Testing Improvements
- **🧪 Jest**: Unit testing for utility functions and business logic
- **📱 React Native Testing Library**: Component testing with realistic user interactions
- **🤖 Detox**: End-to-end testing for complete user flows
- **⚡ GitHub Actions**: Automated CI/CD pipeline
- **📊 Code Coverage**: Comprehensive coverage reporting
- **🔍 Visual Regression Testing**: UI consistency across updates

### Testing Philosophy
We believe in **testing the user experience**, not just the code. Our testing approach focuses on:
- **User-centric scenarios**: Testing real user workflows
- **Cross-platform consistency**: Ensuring identical behavior on iOS/Android
- **Performance benchmarks**: Maintaining 60fps and quick load times
- **Accessibility compliance**: Testing with screen readers and accessibility tools

## 📱 Platform Support

- **iOS** (Primary target)
- **Android** (Full support)
- **Web** (Limited support via Expo Web)

### 🔄 Roadmap & Next Steps

#### 🚀 Version 1.0 (Production Ready)
- [ ] **💰 RevenueCat Integration**: Replace mock subscription service
- [ ] **🎵 Audio Content Library**: Add professional meditation recordings
- [ ] **🎨 Advanced Drawing Tools**: Full canvas with react-native-svg
- [ ] **📱 Push Notifications**: Smart reminder system
- [ ] **📊 Analytics Integration**: User behavior insights
- [ ] **🎪 App Store Optimization**: Icons, screenshots, metadata

#### 🌟 Version 2.0 (Enhanced Features)
- [ ] **🌙 Dark Mode**: Complete UI theme system
- [ ] **🌍 Internationalization**: Multi-language support
- [ ] **👥 Social Features**: Friend connections, shared goals
- [ ] **🎯 Advanced Personalization**: ML-driven recommendations
- [ ] **⚡ Offline Mode**: Full app functionality without internet
- [ ] **🔊 Custom Audio**: User-generated guided meditations

#### 🔮 Future Vision
- [ ] **🧠 Biometric Integration**: Heart rate, stress monitoring
- [ ] **🤖 Advanced AI**: Personalized meditation coach
- [ ] **🎮 VR/AR Support**: Immersive meditation experiences
- [ ] **🏥 Healthcare Integration**: Partner with wellness platforms

## 🤝 Contributing

We welcome contributions from the community! Whether you're a developer, designer, or wellness enthusiast, there are many ways to help improve this app.

### 🚀 Quick Contribution Steps

1. **🍴 Fork** the repository
2. **🌟 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **✨ Make** your changes following our coding standards
4. **🧪 Test** your changes (`bun lint && bun type-check`)
5. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
7. **🔄 Open** a Pull Request with a detailed description

### 💡 Areas for Contribution

#### 🎨 Design & UX
- **UI/UX improvements** and modern design patterns
- **Accessibility enhancements** for inclusive design
- **Dark mode implementation**
- **Animation improvements** and micro-interactions

#### 🧘 Content & Features
- **New meditation activities** and wellness techniques
- **Audio content creation** (guided meditations, nature sounds)
- **AI prompt optimization** for better content generation
- **Gamification features** (new badges, challenges)

#### 🛠️ Technical
- **Performance optimizations** and code improvements
- **Testing** (unit tests, E2E tests, accessibility tests)
- **Documentation** improvements and tutorials
- **Internationalization** (i18n) support
- **Platform-specific features** (iOS/Android)

#### 🌍 Community
- **Wellness expertise** input on meditation techniques
- **User feedback** and feature suggestions
- **Bug reports** with detailed reproduction steps
- **Community support** and user assistance

## 📄 License & Legal

### 📋 Software License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 🔐 Privacy & Data Protection
- **🛡️ Privacy-First Design**: Minimal data collection, maximum user control
- **🔒 Local Storage**: Sensitive data stored locally on device
- **🚫 No Tracking**: No unnecessary user behavior tracking
- **📱 GDPR Compliant**: European privacy regulation compliance
- **🇺🇸 CCPA Compliant**: California privacy rights support

### ⚖️ Terms of Use
- **🏥 Not Medical Advice**: App is for wellness, not medical treatment
- **📝 User Responsibility**: Users responsible for their wellness journey
- **🤝 Community Guidelines**: Respectful, inclusive community standards
- **🔄 Updates**: Terms may be updated with app improvements

## 🙏 Acknowledgments & Credits

### 🛠️ Technology Partners
- **⚛️ [Expo Team](https://expo.dev)** for the incredible React Native development platform
- **🎭 [Lottie](https://lottiefiles.com)** for beautiful, lightweight animations
- **🎨 [NativeWind](https://nativewind.dev)** for bringing Tailwind CSS to React Native
- **🐻 [Zustand](https://zustand-demo.pmnd.rs)** for simple, efficient state management

### 🤖 AI & Content Partners  
- **🔵 [OpenAI](https://openai.com)** for GPT-powered content generation
- **🟣 [Anthropic](https://anthropic.com)** for Claude AI integration
- **🔴 [X.AI](https://x.ai)** for Grok AI capabilities
- **🎙️ [ElevenLabs](https://elevenlabs.io)** for text-to-speech technology

### 🎵 Audio & Design Resources
- **🌊 Freesound Community** for nature sound effects
- **🎼 Creative Commons** audio contributors
- **🎨 Design inspiration** from leading meditation apps
- **📱 Apple Human Interface Guidelines** for iOS design standards

### 👥 Community & Contributors
- **🤝 Open Source Community** for libraries and tools
- **🧘 Wellness Experts** for meditation technique guidance  
- **👨‍💻 Contributors** who help improve the app
- **🙏 Beta Testers** for valuable feedback and bug reports

### 💝 Special Thanks
*To everyone working to make mental wellness accessible and technology more human* 🌟

## 📞 Support & Community

### 🆘 Getting Help
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/issues/new?template=bug_report.md)
- **💡 Feature Requests**: [GitHub Issues](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/issues/new?template=feature_request.md)
- **💬 Discussions**: [GitHub Discussions](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/discussions)
- **📧 Direct Contact**: [Create an issue](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/issues/new) for private support

### 🤗 Community Guidelines
- **Be respectful** and inclusive in all interactions
- **Search existing issues** before creating new ones
- **Provide detailed information** when reporting bugs
- **Follow our code of conduct** and contribution guidelines

### 🏥 Wellness Disclaimer
This app is designed for general wellness and relaxation purposes. It is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for mental health concerns.

---

<div align="center">

**Made with ❤️ for mental wellness and mindfulness**

### 🌟 Show Your Support

If this app helps you on your wellness journey, please consider:

[![⭐ Star this repo](https://img.shields.io/badge/⭐-Star%20this%20repo-yellow.svg?style=for-the-badge)](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP)
[![🍴 Fork](https://img.shields.io/badge/🍴-Fork-blue.svg?style=for-the-badge)](https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP/fork)
[![🤝 Contribute](https://img.shields.io/badge/🤝-Contribute-green.svg?style=for-the-badge)](#-contributing)

### 📱 Ready to Start Your Wellness Journey?

1. **📥 Clone the repo** and set up your development environment
2. **🔑 Add your API keys** for AI-powered features  
3. **🚀 Run the app** and start exploring meditation activities
4. **🤝 Join our community** and help make wellness accessible to everyone

---

*Transform your daily routine with mindfulness, one breath at a time* 🧘‍♀️✨

</div>
