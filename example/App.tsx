import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayerScreen } from './PlayerScreen';
import { PublisherScreen } from './PublisherScreen';
import { PublisherLandscapeScreen } from './PublisherLandscapeScreen';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { NodeMediaClient } from 'expo-nodemediaclient';

type Screen = 'home' | 'player' | 'publisher' | 'publisherLanscape';


if (Platform.OS === 'android') {
  NodeMediaClient.setLicense('');
} else {
  NodeMediaClient.setLicense('');
}
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  useEffect(() => {
    requestCameraPermission();
    requestMicrophonePermission();
  }, []);

  if (currentScreen === 'player') {
    return <PlayerScreen onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'publisher') {
    return <PublisherScreen onBack={() => setCurrentScreen('home')} hasPermission={cameraPermission?.granted == true && microphonePermission?.granted == true} />;
  }

  if (currentScreen === 'publisherLanscape') {
    return <PublisherLandscapeScreen onBack={() => setCurrentScreen('home')} hasPermission={cameraPermission?.granted == true && microphonePermission?.granted == true} />;
  }

  return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>📡</Text>
          </View>
          <Text style={styles.heroTitle}>Expo-NodeMediaClient</Text>
          <Text style={styles.heroSubtitle}>强大的 React Native 直播 SDK</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>功能特性</Text>

          <FeatureCard
            icon="▶️"
            title="直播播放"
            description="支持 RTMP、RTSP 等多种协议的直播流播放，低延迟高性能"
            onPress={() => onNavigate('player')}
          />

          <FeatureCard
            icon="📹"
            title="直播推流"
            description="支持摄像头推流，可配置视频参数，轻松实现直播功能"
            onPress={() => onNavigate('publisher')}
          />

          <FeatureCard
            icon="📹"
            title="横屏直播推流"
            description="支持摄像头推流，可配置视频参数，轻松实现直播功能"
            onPress={() => onNavigate('publisherLanscape')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <View style={styles.featureArrow}>
        <Text style={styles.featureArrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  // Hero
  hero: {
    backgroundColor: '#007AFF',
    padding: 32,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIconText: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Features Section
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  featureArrow: {
    marginLeft: 12,
  },
  featureArrowText: {
    fontSize: 20,
    color: '#007AFF',
  },
  // Info Section
  infoSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
});
