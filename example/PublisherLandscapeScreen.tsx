import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NodePublisher, NodePublisherRef, NodePlayerEventCallback } from 'expo-nodemediaclient';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';

type IconBtnProps = {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
  style?: any;
};

function IconButton({ name, label, onPress, active, style }: IconBtnProps) {
  return (
    <TouchableOpacity style={[styles.iconBtn, active && styles.iconBtnActive, style]} onPress={onPress}>
      <Ionicons name={name} size={26} color="#fff" />
    </TouchableOpacity>
  );
}

export function PublisherLandscapeScreen({
  onBack,
  hasPermission,
}: {
  onBack: () => void;
  hasPermission: boolean;
}) {
  const publisherRef = React.useRef<NodePublisherRef | null>(null);

  const [url, setUrl] = useState('rtmp://192.168.0.2/live/stream');
  const [isPublishing, setIsPublishing] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const [colorStyleOn, setColorStyleOn] = useState(false);
  const [smoothskinOn, setSmoothskinOn] = useState(false);
  const [colorStyleIntensity, setColorStyleIntensity] = useState(0.0);
  const [smoothskinIntensity, setSmoothskinIntensity] = useState(0.0);
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [muted, setMuted] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomRatio, setZoomRatio] = useState(0.0);
  const scrollViewRef = useRef<ScrollView>(null);

  // 手势处理相关状态
  const scale = useRef(1);
  const savedScale = useRef(1);
  const baseZoom = useRef(0.0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => backHandler.remove();
  }, [onBack]);

  // 进入页面时设置为横屏，退出时恢复
  useEffect(() => {
    // 设置为横屏
    const setLandscapeOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Failed to set landscape orientation:', error);
      }
    };

    setLandscapeOrientation();

    // 清理函数：恢复屏幕方向
    return () => {
      const restoreOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (error) {
          console.warn('Failed to restore orientation:', error);
        }
      };
      restoreOrientation();
    };
  }, []);

  // 双指缩放手势处理器
  const onPinchGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      savedScale.current = scale.current;
      baseZoom.current = zoomRatio;
    }

    if (event.nativeEvent.state === State.ACTIVE) {
      scale.current = savedScale.current * event.nativeEvent.scale;

      // 计算新的缩放比例 (0.0 到 1.0)
      const newZoom = baseZoom.current + (event.nativeEvent.scale - 1) * 0.5;
      const clampedZoom = Math.max(0.0, Math.min(1.0, newZoom));

      // 更新 zoomRatio 状态
      setZoomRatio(clampedZoom);
    }

    if (event.nativeEvent.state === State.END) {
      savedScale.current = scale.current;
    }
  };

  const handleTogglePublish = () => {
    if (!isPublishing) {
      if (!url.trim()) {
        Alert.alert('提示', '请输入推流地址');
        return;
      }
      if (!hasPermission) {
        Alert.alert('权限提示', '需要摄像头和麦克风权限才能使用推流功能');
        return;
      }
      setIsPublishing(true);
      publisherRef.current?.start(url);
    } else {
      setIsPublishing(false);
      publisherRef.current?.stop();
    }
  };

  const handleSwitchCamera = () => {
    setFrontCamera(!frontCamera);
  };

  const handleColorAdjust = () => {
    const newState = !colorStyleOn;
    setColorStyleOn(newState);
    setColorStyleIntensity(newState ? 1.0 : 0.0);
  };

  const handleFilterAdjust = () => {
    const newState = !smoothskinOn;
    setSmoothskinOn(newState);
    setSmoothskinIntensity(newState ? 1.0 : 0.0);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleTorch = () => {
    setTorchOn(!torchOn);
  };

  const handleEvent = (event: { nativeEvent: NodePlayerEventCallback }) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const logMessage = `[${timestamp}] 事件码: ${event.nativeEvent.event}, 消息: ${event.nativeEvent.msg}`;
    console.log(logMessage);
    setEventLogs(prev => [...prev, logMessage]);
  };

  const handleToggleLogs = () => {
    setShowLogs(!showLogs);
  };

  const handleClearLogs = () => {
    setEventLogs([]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>直播推流</Text>
          <TouchableOpacity onPress={handleToggleLogs} style={styles.logButton}>
            <Ionicons name="list" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.screenContent}>
          <PinchGestureHandler
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchGestureEvent}
          >
            <View style={styles.publisherContainer}>
              <NodePublisher
                ref={publisherRef}
                style={styles.publisherView}
                url={url}
                volume={muted ? 0 : 1}
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
                  width: 1280,
                  height: 720,
                  fps: 30,
                  bitrate: 2000_000,
                }}
                videoOrientation={NodePublisher.VIDEO_ORIENTATION_LANDSCAPE_RIGHT}
                keyFrameInterval={2}
                frontCamera={frontCamera}
                cameraFrontMirror={true}
                torchEnable={torchOn}
                HWAccelEnable={true}
                denoiseEnable={true}
                zoomRatio={zoomRatio}
                colorStyleId={NodePublisher.EFFECTOR_STYLE_ID_FAIRSKIN}
                colorStyleIntensity={colorStyleIntensity}
                smoothskinIntensity={smoothskinIntensity}
                onEventCallback={handleEvent}
              />
            </View>
          </PinchGestureHandler>

          <View style={styles.floatingControls}>
            <View style={styles.iconBar}>
              <IconButton name="camera-reverse" label="翻转" onPress={handleSwitchCamera} />
              <IconButton name="color-filter" label="色彩" onPress={handleColorAdjust} active={colorStyleOn} />
              <IconButton name="sparkles" label="滤镜" onPress={handleFilterAdjust} active={smoothskinOn} />
              <IconButton name={muted ? "volume-mute" : "volume-medium"} label="静音" onPress={handleMute} active={muted} />
              <IconButton name={torchOn ? "sunny" : "sunny-outline"} label="补光" onPress={handleTorch} active={torchOn} />
              <View style={styles.publishBtnWrapper}>
                <IconButton
                  name={isPublishing ? "stop" : "play"}
                  label={isPublishing ? "停止" : "推流"}
                  onPress={handleTogglePublish}
                  active={isPublishing}
                  style={[isPublishing ? styles.publishBtnActive : styles.publishBtn]}
                />
              </View>
            </View>
          </View>

          {showLogs && (
            <View style={styles.logPanel}>
              <View style={styles.logHeader}>
                <Text style={styles.logTitle}>事件日志</Text>
                <TouchableOpacity onPress={handleClearLogs} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>清空</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                ref={scrollViewRef}
                style={styles.logContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {eventLogs.length === 0 ? (
                  <Text style={styles.emptyLogText}>暂无日志</Text>
                ) : (
                  eventLogs.map((log, index) => (
                    <Text key={index} style={styles.logText}>
                      {log}
                    </Text>
                  ))
                )}
              </ScrollView>
            </View>
          )}

        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  publisherContainer: {
    flex: 1,
    position: 'relative',
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
  logButton: {
    padding: 4,
    marginLeft: 'auto',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  screenContent: {
    flex: 1,
    position: 'relative',
  },
  publisherView: {
    flex: 1,
    backgroundColor: '#000',
  },
  zoomIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  zoomText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  floatingControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  iconBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconBtnActive: {
    backgroundColor: '#007AFF',
  },
  publishBtnWrapper: {
    marginLeft: 'auto',
  },
  publishBtn: {
    backgroundColor: '#007AFF',
  },
  publishBtnActive: {
    backgroundColor: '#FF3B30',
  },
  logPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80%',
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  logContent: {
    flex: 1,
    padding: 12,
  },
  logText: {
    fontSize: 12,
    color: '#0f0',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  emptyLogText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
