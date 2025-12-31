import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NodePlayer, NodePlayerRef, NodePlayerEventCallback } from 'expo-nodemediaclient';

type ScaleMode = 0 | 1 | 2;

const SCALE_MODES: { value: ScaleMode; label: string }[] = [
  { value: 0, label: '填充' },
  { value: 1, label: '适应' },
  { value: 2, label: '拉伸' },
];

export function PlayerScreen({ onBack }: { onBack: () => void }) {
  const playerRef = React.useRef<NodePlayerRef>(null);
  const eventLogScrollRef = React.useRef<ScrollView>(null);

  const [url, setUrl] = useState('rtmp://192.168.0.2/live/bbb');
  const [scaleMode, setScaleMode] = useState<ScaleMode>(0);
  const [bufferTime, setBufferTime] = useState('1000');
  const [volume, setVolume] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eventLog, setEventLog] = useState<{ timestamp: string; event: NodePlayerEventCallback }[]>([]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => backHandler.remove();
  }, [onBack]);

  const handleStart = () => {
    if (!url.trim()) {
      Alert.alert('提示', '请输入直播地址');
      return;
    }
    setIsPlaying(true);
    playerRef.current?.start(url);
  };

  const handleStop = () => {
    setIsPlaying(false);
    playerRef.current?.stop();
  };

  const handleEventCallback = (event: { nativeEvent: NodePlayerEventCallback }) => {
    console.log('Player Event:', event.nativeEvent);

    // 添加事件到日志
    const newLog = {
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      event: event.nativeEvent,
    };

    setEventLog((prev) => {
      const updated = [...prev, newLog];
      // 滚动到底部显示最新事件
      setTimeout(() => {
        eventLogScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return updated;
    });
  };

  const clearEventLog = () => {
    setEventLog([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>直播播放</Text>
      </View>

      <View style={styles.screenContent}>
        <NodePlayer
          ref={playerRef}
          style={styles.playerView}
          url={url}
          scaleMode={scaleMode}
          bufferTime={parseFloat(bufferTime)}
          volume={volume}
          onEventCallback={handleEventCallback} />

        <View style={styles.controls}>
          <Text style={styles.inputLabel}>直播地址 (RTMP/RTSP)</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="请输入直播地址"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>缩放模式</Text>
          <View style={styles.radioGroup}>
            {SCALE_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                style={[
                  styles.radioOption,
                  scaleMode === mode.value && styles.radioOptionActive,
                ]}
                onPress={() => setScaleMode(mode.value)}
              >
                <View
                  style={[
                    styles.radioIcon,
                    scaleMode === mode.value && styles.radioIconActive,
                  ]}
                >
                  {scaleMode === mode.value && <View style={styles.radioDot} />}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    scaleMode === mode.value && styles.radioLabelActive,
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>缓冲时间 (毫秒)</Text>
          <TextInput
            style={styles.input}
            value={bufferTime}
            onChangeText={setBufferTime}
            placeholder="请输入缓冲时间"
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={[styles.button, isPlaying ? styles.buttonDanger : styles.buttonPrimary]}
            onPress={isPlaying ? handleStop : handleStart}
          >
            <Text style={styles.buttonText}>{isPlaying ? '停止播放' : '开始播放'}</Text>
          </TouchableOpacity>

          <View style={styles.eventLogContainer}>
            <View style={styles.eventLogHeader}>
              <Text style={styles.eventLogTitle}>事件日志</Text>
              {eventLog.length > 0 && (
                <TouchableOpacity onPress={clearEventLog} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>清空</Text>
                </TouchableOpacity>
              )}
            </View>
            {eventLog.length === 0 ? (
              <Text style={styles.emptyLogText}>暂无事件日志</Text>
            ) : (
              <ScrollView style={styles.eventLogList} ref={eventLogScrollRef}>
                {eventLog.map((log, index) => (
                  <View key={index} style={styles.eventLogItem}>
                    <Text style={styles.eventTimestamp}>{log.timestamp}</Text>
                    <Text style={styles.eventCode}>事件码: {log.event.event}</Text>
                    <Text style={styles.eventMessage} numberOfLines={2}>
                      {log.event.msg || '(无消息)'}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  screenContent: {
    flex: 1,
  },
  playerView: {
    height: 240,
    backgroundColor: '#000',
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  radioOptionActive: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  radioIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c7c7cc',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioIconActive: {
    borderColor: '#007AFF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 14,
    color: '#666',
  },
  radioLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  volumeContainer: {
    marginBottom: 16,
  },
  volumeLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  volumeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  volumeSlider: {
    width: '100%',
    height: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventLogContainer: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  eventLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventLogTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
  emptyLogText: {
    paddingVertical: 24,
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },
  eventLogList: {
    maxHeight: 200,
  },
  eventLogItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  eventTimestamp: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  eventCode: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  eventMessage: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
