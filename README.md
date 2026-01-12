# expo-nodemediaclient
[![npm](https://img.shields.io/npm/v/expo-nodemediaclient.svg)](https://www.npmjs.com/package/expo-nodemediaclient)
[![npm](https://img.shields.io/npm/dm/expo-nodemediaclient.svg)](https://www.npmjs.com/package/expo-nodemediaclient)  

## Features
- Support for iOS and Android
- Support for RTMP, HLS, HTTP-FLV, RTSP playback
- Support for H.264, H.265 video encoding
- Support for AAC, OPUS, PCM audio encoding
- Hardware acceleration support
- Low-latency playback with cumulative latency elimination
- Automatic reconnection
- Built-in camera filters

## Prerequisites
Your Expo project should use Continuous Native Generation [(CNG)](https://docs.expo.dev/workflow/continuous-native-generation/)
If not, please run first:
```bash
npx expo prebuild
```

## Installation

```bash
npm install expo-nodemediaclient
```

## Usage
### Register SDK
Android and iOS require different license codes, which need to be registered separately. Please contact [https://www.nodemedia.cn](https://www.nodemedia.cn) to obtain license codes.

```js
import { NodeMediaClient } from 'expo-nodemediaclient';
import { Platform } from 'react-native';


if (Platform.OS === 'ios') {
    NodeMediaClient.setLicense('');
} else if (Platform.OS === 'android') {
    NodeMediaClient.setLicense('');
}

```

### Playback

```js
import { NodePlayer, NodePlayerRef } from 'expo-nodemediaclient';
import { useRef, useState } from 'react';

export default function App() {
    const [url, setUrl] = useState('rtmp://192.168.0.2/live/bbb');
    const playerRef = useRef<NodePlayerRef>(null);
    return (
    <SafeAreaView style={{ flex: 1 }}>
      <NodePlayer
        ref={playerRef}
        url={url}
        bufferTime={1000}
        scaleMode={1}
        style={{ backgroundColor: '#000000', height: 300 }}
      />
      <TextInput value={url} onChangeText={setUrl} />
      <Button
        title="Play"
        onPress={() => {
          playerRef.current?.start(url);
        }}
      />
      <Button
        title="Stop"
        onPress={() => {
          playerRef.current?.stop();
        }}
      />
    </SafeAreaView>
  );
}
```

### Component Props

| Prop | Type | Description |
|------|------|------|
| `url` | `string` | Playback URL (supports RTMP, RTSP, HLS, HTTP-FLV) |
| `bufferTime` | `number` | Buffer time in milliseconds, default 1000 |
| `scaleMode` | `number` | Scale mode, `0`=fill, `1`=fit, `2`=stretch |
| `volume` | `number` | Volume (0.0 - 1.0), default 1.0 |
| `onEventCallback` | `(event) => void` | Event callback |

### Common Methods

```js
// Start playback
playerRef.current?.start(url);

// Stop playback
playerRef.current?.stop();
```

### Event Callback

```js
const handleEvent = (event: { nativeEvent: NodePlayerEventCallback }) => {
  console.log('Event code:', event.nativeEvent.event);
  console.log('Message:', event.nativeEvent.msg);
};

<NodePlayer
  onEventCallback={handleEvent}
  // ...other props
/>
```


## Streaming

### Basic Usage

```js
import { NodePublisher, NodePublisherRef } from 'expo-nodemediaclient';
import { useRef, useState } from 'react';

export default function PublisherScreen() {
  const [url, setUrl] = useState('rtmp://192.168.0.2/live/stream');
  const [isPublishing, setIsPublishing] = useState(false);
  const publisherRef = useRef<NodePublisherRef>(null);

  const handleTogglePublish = () => {
    if (!isPublishing) {
      setIsPublishing(true);
      publisherRef.current?.start(url);
    } else {
      setIsPublishing(false);
      publisherRef.current?.stop();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NodePublisher
        ref={publisherRef}
        style={{ flex: 1, backgroundColor: '#000' }}
        url={url}
        audioParam={{
          codecid: NodePublisher.NMC_CODEC_ID_AAC,
          profile: NodePublisher.NMC_PROFILE_AUTO,
          channels: 2,
          samplingRate: 44100,
          bitrate: 64_000,
        }}
        videoParam={{
          codecid: NodePublisher.NMC_CODEC_ID_H264,
          profile: NodePublisher.NMC_PROFILE_AUTO,
          width: 720,
          height: 1280,
          fps: 30,
          bitrate: 2000_000,
        }}
      />
      <Button
        title={isPublishing ? "Stop" : "Start Streaming"}
        onPress={handleTogglePublish}
      />
    </SafeAreaView>
  );
}
```

### Component Props

| Prop | Type | Description |
|------|------|------|
| `url` | `string` | Streaming URL (RTMP) |
| `audioParam` | `AudioParam` | Audio encoding parameters |
| `videoParam` | `VideoParam` | Video encoding parameters |
| `videoOrientation` | `number` | Video orientation, e.g., `NodePublisher.VIDEO_ORIENTATION_PORTRAIT` |
| `keyFrameInterval` | `number` | Key frame interval in seconds, default 2 |
| `frontCamera` | `boolean` | Whether to use front camera, default false |
| `cameraFrontMirror` | `boolean` | Whether to mirror front camera, default true |
| `volume` | `number` | Volume (0.0 - 1.0) |
| `zoomRatio` | `number` | Camera zoom ratio (0.0 - 1.0)|
| `torchEnable` | `boolean` | Whether to enable torch/flashlight |
| `HWAccelEnable` | `boolean` | Whether to enable hardware acceleration, default true |
| `denoiseEnable` | `boolean` | Whether to enable noise reduction, default true |
| `colorStyleId` | `number` | Color style ID, e.g., `NodePublisher.EFFECTOR_STYLE_ID_FAIRSKIN` |
| `colorStyleIntensity` | `number` | Color intensity (0.0 - 1.0) |
| `smoothskinIntensity` | `number` | Skin smoothing intensity (0.0 - 1.0) |
| `onEventCallback` | `(event) => void` | Event callback |

### AudioParam

| Prop | Type | Description |
|------|------|------|
| `codecid` | `number` | Codec ID, `NodePublisher.NMC_CODEC_ID_AAC` |
| `profile` | `number` | Codec profile, `NodePublisher.NMC_PROFILE_AUTO` |
| `channels` | `number` | Number of channels, 1 or 2 |
| `samplingRate` | `number` | Sampling rate, e.g., 44100 |
| `bitrate` | `number` | Bitrate, e.g., 64000 |

### VideoParam

| Prop | Type | Description |
|------|------|------|
| `codecid` | `number` | Codec ID, `NodePublisher.NMC_CODEC_ID_H264` or `NodePublisher.NMC_CODEC_ID_H265` |
| `profile` | `number` | Codec profile, `NodePublisher.NMC_PROFILE_AUTO` |
| `width` | `number` | Video width |
| `height` | `number` | Video height |
| `fps` | `number` | Frame rate |
| `bitrate` | `number` | Bitrate, e.g., 2000000 |

### Common Methods

```js
// Start streaming
publisherRef.current?.start(url);

// Stop streaming
publisherRef.current?.stop();
```

### Event Callback

```js
const handleEvent = (event: { nativeEvent: NodePlayerEventCallback }) => {
  console.log('Event code:', event.nativeEvent.event);
  console.log('Message:', event.nativeEvent.msg);
};

<NodePublisher
  onEventCallback={handleEvent}
  // ...other props
/>
```

### Permissions

Streaming functionality requires camera and microphone permissions. We recommend using `expo-camera` to request permissions.

First install the dependency:

```bash
npm install expo-camera
```

Configure the `expo-camera` plugin in `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Camera access is required for live streaming",
        "NSMicrophoneUsageDescription": "Microphone access is required for live streaming"
      }
    },
    "android": {
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET"
      ]
    }
  }
}
```

Request permissions in code:

```js
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useEffect } from 'react';

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  useEffect(() => {
    requestCameraPermission();
    requestMicrophonePermission();
  }, []);

  const hasPermission = cameraPermission?.granted && microphonePermission?.granted;

  // ...
}
```
