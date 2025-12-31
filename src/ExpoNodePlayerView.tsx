
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';

export type NodePlayerRef = {
  start: (url?: string) => void;
  stop: () => void;
}

export type NodePlayerEventCallback = {
  event: number;
  msg: string;
}

export type NodePlayerProps = {
  ref?: NodePlayerRef;
  url?: string;
  volume?: number;
  cryptoKey?: string;
  scaleMode?: number;
  bufferTime?: number;
  HTTPReferer?: string;
  HTTPUserAgent?: string;
  RTSPTransport?: string;
  HWAccelEnable?: boolean;
  onEventCallback?: (event: { nativeEvent: NodePlayerEventCallback }) => void;
} & ViewProps;

const NativeView: React.ComponentType<NodePlayerProps> = requireNativeViewManager('ExpoNodePlayerView');
export default function ExpoNodePlayerView(props: NodePlayerProps) {
  return <NativeView {...props} />;
}