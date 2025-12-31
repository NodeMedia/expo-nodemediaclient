# expo-nodemediaclient

## 特性
- 支持iOS与Android
- 支持RTMP、HLS、HTTP-FLV、RTSP播放
- 支持H.264、H.265视频编码
- 支持AAC、PCM音频编码
- 支持硬件加速
- 支持低延迟播放，累积延迟消除

## 前提
你的Expo项目应该是使用持续的原生生成 [(CNG)](https://docs.expo.dev/workflow/continuous-native-generation/)  
如果不是请先执行
```bash
npx expo prebuild
```

## 安装

```bash
npm install expo-nodemediaclient
```

## 使用
### 注册SDK
android与iOS注册码不同，需要分别注册，注册码请联系[https://www.nodemedia.cn](https://www.nodemedia.cn)获取

```js
import { NodeMediaClient } from 'expo-nodemediaclient';
import { Platform } from 'react-native';


if (Platform.OS === 'ios') {
    NodeMediaClient.setLicense('');
} else if (Platform.OS === 'android') {
    NodeMediaClient.setLicense('');
}

```

### 播放

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

### 组件属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `url` | `string` | 播放地址 (支持 RTMP、RTSP、HLS、HTTP-FLV) |
| `bufferTime` | `number` | 缓冲时间 (毫秒)，默认 1000 |
| `scaleMode` | `number` | 缩放模式，`0`=填充，`1`=适应，`2`=拉伸 |
| `volume` | `number` | 音量 (0.0 - 1.0)，默认 1.0 |
| `onEventCallback` | `(event) => void` | 事件回调 |

### 常用方法

```js
// 开始播放
playerRef.current?.start(url);

// 停止播放
playerRef.current?.stop();
```

### 事件回调

```js
const handleEvent = (event: { nativeEvent: NodePlayerEventCallback }) => {
  console.log('事件码:', event.nativeEvent.event);
  console.log('消息:', event.nativeEvent.msg);
};

<NodePlayer
  onEventCallback={handleEvent}
  // ...其他属性
/>
```


## 推流

### 基本用法

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
        title={isPublishing ? "停止" : "推流"}
        onPress={handleTogglePublish}
      />
    </SafeAreaView>
  );
}
```

### 组件属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `url` | `string` | 推流地址 (RTMP) |
| `audioParam` | `AudioParam` | 音频编码参数 |
| `videoParam` | `VideoParam` | 视频编码参数 |
| `videoOrientation` | `number` | 视频方向，`NodePublisher.VIDEO_ORIENTATION_PORTRAIT` 或 `NodePublisher.VIDEO_ORIENTATION_LANDSCAPE` |
| `keyFrameInterval` | `number` | 关键帧间隔 (秒)，默认 2 |
| `frontCamera` | `boolean` | 是否使用前置摄像头，默认 false |
| `cameraFrontMirror` | `boolean` | 前置摄像头是否镜像，默认 true |
| `HWAccelEnable` | `boolean` | 是否启用硬件加速，默认 true |
| `denoiseEnable` | `boolean` | 是否启用降噪，默认 true |
| `colorStyleId` | `number` | 色彩风格ID，如 `NodePublisher.EFFECTOR_STYLE_ID_FAIRSKIN` |
| `colorStyleIntensity` | `number` | 色彩强度 (0.0 - 1.0) |
| `smoothskinIntensity` | `number` | 磨皮强度 (0.0 - 1.0) |
| `onEventCallback` | `(event) => void` | 事件回调 |

### AudioParam

| 属性 | 类型 | 说明 |
|------|------|------|
| `codecid` | `number` | 编码ID，`NodePublisher.NMC_CODEC_ID_AAC` |
| `profile` | `number` | 编码profile，`NodePublisher.NMC_PROFILE_AUTO` |
| `channels` | `number` | 声道数，1 或 2 |
| `samplingRate` | `number` | 采样率，如 44100 |
| `bitrate` | `number` | 比特率，如 64000 |

### VideoParam

| 属性 | 类型 | 说明 |
|------|------|------|
| `codecid` | `number` | 编码ID，`NodePublisher.NMC_CODEC_ID_H264` 或 `NodePublisher.NMC_CODEC_ID_H265` |
| `profile` | `number` | 编码profile，`NodePublisher.NMC_PROFILE_AUTO` |
| `width` | `number` | 视频宽度 |
| `height` | `number` | 视频高度 |
| `fps` | `number` | 帧率 |
| `bitrate` | `number` | 比特率，如 2000000 |

### 常用方法

```js
// 开始推流
publisherRef.current?.start(url);

// 停止推流
publisherRef.current?.stop();
```

### 事件回调

```js
const handleEvent = (event: { nativeEvent: NodePlayerEventCallback }) => {
  console.log('事件码:', event.nativeEvent.event);
  console.log('消息:', event.nativeEvent.msg);
};

<NodePublisher
  onEventCallback={handleEvent}
  // ...其他属性
/>
```

### 权限说明

使用推流功能需要摄像头和麦克风权限，建议使用 `expo-camera` 来申请权限。

首先安装依赖：

```bash
npm install expo-camera
```

在 `app.json` 中配置 `expo-camera` 插件：

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
        "NSCameraUsageDescription": "需要访问摄像头以进行直播推流",
        "NSMicrophoneUsageDescription": "需要访问麦克风以进行直播推流"
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

在代码中申请权限：

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
