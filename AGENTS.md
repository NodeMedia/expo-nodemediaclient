# Agent Guidelines for expo-nodemediaclient

## Overview
This codebase is an Expo native module for NodeMediaClient, providing RTMP/RTSP/HLS streaming capabilities for iOS and Android. It's built using TypeScript, React Native, and Expo Module architecture.

## Build/Lint/Test Commands

### Essential Commands
```bash
# Build the TypeScript/TSX source code
npm run build

# Clean build artifacts
npm run clean

# Run ESLint on all source files
npm run lint

# Run test suite (if available)
npm run test

# Run all pre-publish checks
npm run prepublishOnly
```

### Single Test Commands
```bash
# Run specific test file (if tests exist)
npm test -- --testPathPattern="specific-test-file"

# Run tests in watch mode during development
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Expo Module Commands
```bash
# Expo module-specific operations
npm run expo-module

# Prepare development environment
npm run prepare

# Open iOS example project
npm run open:ios

# Open Android example project
npm run open:android
```

## Code Style Guidelines

### TypeScript/TSX Conventions
- **File Extensions**: Use `.ts` for pure TypeScript files, `.tsx` for React components
- **Type Definitions**: Use explicit TypeScript types for all props, return values, and function parameters
- **Interfaces**: Define interfaces for all complex data structures (see `NodePlayerProps`, `NodePublisherProps`)
- **Optional Properties**: Use `?` for optional props and parameters consistently

### React Native Patterns
- **Component Structure**: Functional components with hooks, no class components
- **Props Extending**: Always extend `ViewProps` for view components (see `NodePlayerProps: & ViewProps`)
- **Ref Handling**: Use `React.RefObject<T | null>` for refs with proper null handling
- **Event Callbacks**: Use `{ nativeEvent: CallbackType }` for event callbacks (see `onEventCallback`)

### Naming Conventions
- **Components**: PascalCase (`ExpoNodePlayerView`, `ExpoNodePublisherView`)
- **Props/Types**: PascalCase (`NodePlayerProps`, `AudioParam`)
- **Refs**: camelCase with Ref suffix (`NodePlayerRef`, `NodePublisherRef`)
- **Callbacks**: camelCase with Callback suffix (`NodePlayerEventCallback`)
- **Methods**: camelCase (`start`, `stop`, `setEffectParameter`)
- **Constants**: UPPER_SNAKE_CASE for codec IDs and constants (`NMC_CODEC_ID_H264`, `VIDEO_ORIENTATION_PORTRAIT`)

### Import Guidelines
```typescript
// React Native core imports
import { ViewProps } from 'react-native';

// Expo modules core imports
import { requireNativeViewManager, NativeModule, requireNativeModule } from 'expo-modules-core';

// Local imports (relative paths for internal modules)
import { NodePlayerRef, NodePlayerProps, NodePlayerEventCallback } from './ExpoNodePlayerView';
```

### Error Handling Patterns
- **Null Checks**: Always check for null when using refs (`React.RefObject<T | null>`)
- **Promise Handling**: Use async/await with proper error handling for Promise-returning methods
- **Type Guards**: Use proper TypeScript type guards when handling union types
- **Native Module Errors**: Handle potential native module loading failures gracefully

### File Organization
```
src/
├── index.ts                 # Main barrel export file
├── ExpoNodeMediaClientModule.tsx  # Native module wrapper
├── ExpoNodePlayerView.tsx   # Player component
└── ExpoNodePublisherView.tsx # Publisher component
```

### Export Patterns
```typescript
// Barrel exports in index.ts
export { default as NodeMediaClient } from './ExpoNodeMediaClientModule';
export { default as NodePlayer, NodePlayerRef, NodePlayerProps, NodePlayerEventCallback } from './ExpoNodePlayerView';

// Component default exports
export default function ExpoNodePlayerView(props: NodePlayerProps) {
  return <NativeView {...props} />;
}

// Constants export (static properties)
ExpoNodePublisherView.NMC_CODEC_ID_H264 = 27;
```

### Native Module Integration
- **Module Loading**: Use `requireNativeModule<T>('ModuleName')` for native modules
- **View Managers**: Use `requireNativeViewManager<PropsType>('ViewName')` for native views
- **Type Declarations**: Extend `NativeModule` for proper typing of native methods
- **Platform Support**: Modules support both iOS (`apple`) and Android (`android`) as defined in `expo-module.config.json`

### Configuration Files
- **ESLint**: Extends `universe/native` and `universe/web` (configured in `.eslintrc.js`)
- **TypeScript**: Extends `expo-module-scripts/tsconfig.base` (configured in `tsconfig.json`)
- **Module Config**: Platform-specific module registration in `expo-module.config.json`

### Development Workflow
1. **Environment Setup**: Run `npm run prepare` after cloning
2. **Pre-build**: Run `npx expo prebuild` if not using CNG
3. **Development**: Use example app with `npm run open:ios` or `npm run open:android`
4. **Testing**: Build and lint before committing (`npm run build && npm run lint`)
5. **Publishing**: Run `npm run prepublishOnly` before publishing

### Code Quality Standards
- **No Comments**: Code should be self-documenting with clear naming
- **Consistent Formatting**: Code follows Expo module conventions automatically enforced by linting
- **Type Safety**: All code must be TypeScript-compliant with strict type checking
- **React Patterns**: Follow React Native best practices for component composition and prop handling

### Common Patterns to Maintain
```typescript
// Prop spreading for View components
export type NodePlayerProps = {
  ref?: React.RefObject<NodePlayerRef | null>;
  url?: string;
  // ... other props
} & ViewProps;

// Event callback pattern
onEventCallback?: (event: { nativeEvent: NodePublisherEventCallback }) => void;

// Ref pattern for method exposure
export type NodePublisherRef = {
  start: (url?: string) => Promise<void>;
  stop: () => Promise<void>;
  // ... other methods
};
```

### Platform-Specific Considerations
- **iOS/Android Support**: Both platforms defined in `expo-module.config.json`
- **Native Code**: Different module names for iOS vs Android (`ExpoNodePlayerView` vs `expo.modules.nodemediaclient.ExpoNodePlayerView`)
- **Permissions**: Consider platform-specific permission requirements for camera/microphone access
- **Hardware Acceleration**: Platform-specific implementations for `HWAccelEnable` options

## Important Notes
- Always run `npm run build` after making changes to verify TypeScript compilation
- Test on both iOS and Android platforms when possible
- Maintain backward compatibility for existing API surfaces
- Follow Expo module architecture patterns for consistency
- Keep native module interface in sync between TypeScript definitions and native implementations