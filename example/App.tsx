import { NodeMediaClient, NodePlayer, NodePlayerRef } from 'expo-nodemediaclient';
import { useRef, useState } from 'react';
import { Button, Platform, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  const [url, setUrl] = useState('rtmp://192.168.0.2/live/bbb');
  const [bufferTime, setBufferTime] = useState(0);
  const [scaleMode, setScaleMode] = useState(2);
  const playerRef = useRef<NodePlayerRef>(null);
  
  if (Platform.OS === 'ios') {
    NodeMediaClient.setLicense('');
  } else if (Platform.OS === 'android') {
    NodeMediaClient.setLicense('');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NodePlayer
        ref={playerRef}
        url={url}
        bufferTime={bufferTime}
        scaleMode={scaleMode}
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
