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

### 进入页面自动播放
```js
export default function App() {
  const [url, setUrl] = useState('rtmp://192.168.0.2/live/bbb');
  const [bufferTime, setBufferTime] = useState(0);
  const [scaleMode, setScaleMode] = useState(2);
  const playerRef = useRef<NodePlayerRef>(null);
  
  useEffect(() => {
    playerRef.current?.start(url);
    return () => {
      playerRef.current?.stop();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NodePlayer
        ref={playerRef}
        url={url}
        bufferTime={bufferTime}
        scaleMode={scaleMode}
        style={{ backgroundColor: '#000000', height: 300 }}
      />
    </SafeAreaView>
  );
}
```

## 推流
