# Contributing to Daily Calm & Fun

Thank you for your interest in contributing to Daily Calm & Fun! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

We welcome various types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- ✨ **Feature Requests**: Suggest new features or improvements
- 🧘 **New Activities**: Create new meditation and wellness activities
- 🎨 **UI/UX Improvements**: Enhance the user interface and experience
- 🎵 **Audio Content**: Contribute sound effects, music, or guided meditations
- 📚 **Documentation**: Improve or add documentation
- 🧪 **Testing**: Write tests or help with quality assurance
- 🌐 **Internationalization**: Add support for new languages
- ♿ **Accessibility**: Improve accessibility features

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) or **Bun** (recommended)
- **Expo CLI**: `npm install -g @expo/cli`
- **Git** for version control
- **iOS Simulator** (macOS) or **Android Studio**

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Daily_Calm_Fun_IOSAPP.git
   cd Daily_Calm_Fun_IOSAPP
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/manngobeh2006/Daily_Calm_Fun_IOSAPP.git
   ```

4. **Install dependencies**:
   ```bash
   bun install  # or npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (optional for basic development)
   ```

6. **Start the development server**:
   ```bash
   bun start
   ```

## 📋 Development Workflow

### Branch Strategy

- **main**: Stable, production-ready code
- **develop**: Integration branch for new features
- **feature/**: Feature branches (e.g., `feature/new-breathing-exercise`)
- **bugfix/**: Bug fix branches (e.g., `bugfix/audio-crash-fix`)
- **hotfix/**: Critical fixes for production

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   bun lint          # Check code style
   bun type-check    # Check TypeScript types
   # Test on iOS/Android simulators
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new breathing exercise with animation"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Convention

We use conventional commits for clear history:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add progressive muscle relaxation activity
fix: resolve audio playback crash on Android
docs: update installation instructions
style: format code with prettier
refactor: extract common animation logic
test: add unit tests for sound manager
chore: update dependencies
```

## 🎯 Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Define proper interfaces and types
- Avoid `any` type - use specific types or `unknown`
- Use strict TypeScript configuration

### React Native / Expo

- Use **functional components** with hooks
- Follow React Native best practices
- Use **Expo SDK** features when available
- Optimize for both iOS and Android

### Styling

- Use **NativeWind** (Tailwind CSS for React Native)
- Follow consistent spacing and color schemes
- Ensure responsive design for different screen sizes
- Test on both iOS and Android

### State Management

- Use **Zustand** for state management
- Keep stores focused and modular
- Use AsyncStorage for persistence when needed
- Follow existing store patterns

### Code Organization

```
src/
├── components/          # Reusable UI components
│   ├── activities/      # Activity-specific components
│   └── common/          # Shared components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── state/             # Zustand stores
├── api/               # API integrations
├── utils/             # Utility functions
├── types/             # TypeScript definitions
└── data/              # Static data
```

### File Naming

- Use **PascalCase** for components: `MyComponent.tsx`
- Use **camelCase** for utilities: `myUtility.ts`
- Use **kebab-case** for assets: `my-animation.json`

## 🧘 Adding New Activities

### Activity Structure

Each activity should include:

1. **Component**: React component in `src/components/activities/`
2. **Data**: Activity configuration in `src/data/expandedActivities.ts`
3. **Assets**: Animations, sounds, or images in `assets/`
4. **Types**: TypeScript interfaces if needed

### Activity Types

- **Relax**: Breathing exercises, muscle relaxation, calming activities
- **Learn**: Educational content, mindfulness training, attention exercises
- **Create**: Journaling, drawing, creative expression

### Example Activity Addition

1. **Create the component**:
   ```typescript
   // src/components/activities/MyNewActivity.tsx
   import React from 'react';
   import { View, Text } from 'react-native';
   
   interface MyNewActivityProps {
     content: any;
     activity?: ExpandedActivity;
     onComplete: () => void;
   }
   
   export default function MyNewActivity({ content, activity, onComplete }: MyNewActivityProps) {
     // Activity implementation
   }
   ```

2. **Add to activity data**:
   ```typescript
   // src/data/expandedActivities.ts
   {
     id: "my_new_activity",
     type: "relax",
     category: "breathing",
     title: "My New Activity",
     description: "A new relaxing activity",
     // ... other properties
   }
   ```

3. **Add assets** (if needed):
   - Animations: `assets/anim/my-activity.json`
   - Sounds: `assets/sfx/my-sound.wav`

## 🎨 Design Guidelines

### Visual Design

- Follow **Apple Human Interface Guidelines**
- Use consistent color palette
- Maintain proper contrast ratios
- Design for accessibility

### Animations

- Use **Lottie** for complex animations
- Keep animations smooth (60fps)
- Provide options to disable animations
- Test performance on older devices

### Audio

- Use high-quality audio files
- Keep file sizes reasonable
- Provide volume controls
- Test on different devices and headphones

## 🧪 Testing

### Manual Testing

- Test on both iOS and Android
- Test on different screen sizes
- Test with and without API keys
- Test offline functionality
- Test accessibility features

### Automated Testing (Planned)

- Unit tests with Jest
- Component tests with React Native Testing Library
- E2E tests with Detox

## 📚 Documentation

### Code Documentation

- Use JSDoc comments for functions and components
- Document complex logic and algorithms
- Keep comments up-to-date with code changes

### User Documentation

- Update README.md for new features
- Add setup instructions for new dependencies
- Document configuration options

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Device information** (iOS/Android version, device model)
5. **App version** and relevant environment details
6. **Screenshots or videos** if applicable
7. **Console logs** or error messages

Use our bug report template when creating issues.

## ✨ Feature Requests

For feature requests, please provide:

1. **Clear description** of the proposed feature
2. **Use case** - why is this feature needed?
3. **Proposed solution** or implementation ideas
4. **Alternatives considered**
5. **Additional context** or mockups

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: We'll provide feedback on pull requests

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

## 📄 License

By contributing to Daily Calm & Fun, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Daily Calm & Fun! Your efforts help create a better wellness experience for everyone. 🙏