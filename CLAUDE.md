# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **expo-nodemediaclient**, an Expo native module providing live streaming capabilities using the NodeMedia SDK 4.0. It enables RTMP/RTSP/HLS/HTTP-FLV video playback and RTMP live streaming (publishing) for React Native applications using Expo's Continuous Native Generation (CNG) workflow.

## Architecture

The module follows Expo's custom native module pattern with three main components:

- **NodeMediaClient** (`ExpoNodeMediaClientModule.tsx`) - SDK license management, requires separate license keys for iOS and Android
- **NodePlayer** (`ExpoNodePlayerView.tsx`) - Video playback component using `requireNativeViewManager`
- **NodePublisher** (`ExpoNodePublisherView.tsx`) - Camera capture and streaming component using `requireNativeViewManager`

The native implementations are in:
- `ios/ExpoNodemediaclient/` - iOS native code (Objective-C/Swift)
- `android/src/main/java/` - Android native code (Java)

Module configuration is in `expo-module.config.json` which maps platform-specific module names.

## Development Commands

```bash
npm run build          # Build the module (TypeScript -> build/)
npm run clean          # Clean build artifacts
npm run lint           # Run linting
npm run test           # Run tests
npm run prepare        # Prepare module for development
npm run prepublishOnly # Prepare for publishing
npm run open:ios       # Open example iOS project in Xcode
npm run open:android   # Open example Android project in Android Studio
```

The example app in `example/` demonstrates both Player and Publisher functionality with navigation between screens.

## Key Constants

NodePublisher exposes these important constants:
- `NMC_CODEC_ID_AAC`, `NMC_CODEC_ID_H264`, `NMC_CODEC_ID_H265` - Codec identifiers
- `NMC_PROFILE_AUTO` - Auto profile selection
- `VIDEO_ORIENTATION_PORTRAIT`, `VIDEO_ORIENTATION_LANDSCAPE` - Video orientation
- `EFFECTOR_STYLE_ID_FAIRSKIN` - Beauty filter style

## Event Callbacks

Both NodePlayer and NodePublisher support `onEventCallback` that receives `{ nativeEvent: { event: number, msg: string } }`. The `event` code indicates status changes (connection, buffering, error, etc.).

## Important Notes

- **License Required**: NodeMedia SDK requires separate license keys for iOS and Android from https://www.nodemedia.cn
- **CNG Required**: Projects must use Expo's Continuous Native Generation - run `npx expo prebuild` if using managed workflow
- **Permissions**: Publisher requires camera and microphone permissions; use `expo-camera` plugin for permission handling
- **SDK Version**: Currently on NodeMedia SDK 4.0 (updated in v0.2.0)
