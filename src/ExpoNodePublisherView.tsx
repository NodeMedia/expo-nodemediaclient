
import { ViewProps } from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';

export type NodePublisherRef = {
  start: (url?: string) => Promise<void>;
  stop: () => Promise<void>;
  setEffectParameter: (key: string, value: number) => void;
  setEffectStyle: (style: number) => void;
}

export type NodePublisherEventCallback = {
  event: number;
  msg: string;
}

export type AudioParam = {
  codecid?: number;
  profile?: number;
  samplingRate?: number;
  channels?: number;
  bitrate?: number;
}

export type VideoParam = {
  codecid?: number;
  profile?: number;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: number;
}

export type NodePublisherProps = {
  ref?: NodePublisherRef;
  url?: string;
  cryptoKey?: string;
  audioParam?: AudioParam
  videoParam?: VideoParam;
  keyFrameInterval?: number;
  videoOrientation?: number;
  frontCamera?: boolean;
  cameraFrontMirror?: boolean;
  roomRatio?: number;
  volume?: number;
  torchEnable?: boolean;
  HWAccelEnable?: boolean;
  denoiseEnable?: boolean;
  colorStyleId?: number;
  colorStyleIntensity?: number;
  smoothskinIntensity?: number;
  onEventCallback?: (event: { nativeEvent: NodePublisherEventCallback }) => void;
} & ViewProps;

const NativeView: React.ComponentType<NodePublisherProps> = requireNativeViewManager('ExpoNodePublisherView');
function ExpoNodePublisherView(props: NodePublisherProps) {
  return <NativeView {...props} />;
}

ExpoNodePublisherView.NMC_CODEC_ID_H264 = 27;
ExpoNodePublisherView.NMC_CODEC_ID_H265 = 173;
ExpoNodePublisherView.NMC_CODEC_ID_AAC = 86018;
ExpoNodePublisherView.NMC_CODEC_ID_OPUS = 86076;
ExpoNodePublisherView.NMC_CODEC_ID_PCMA = 65543;
ExpoNodePublisherView.NMC_CODEC_ID_PCMU = 65542;
ExpoNodePublisherView.NMC_PROFILE_AUTO = 0;
ExpoNodePublisherView.NMC_PROFILE_H264_BASELINE = 66;
ExpoNodePublisherView.NMC_PROFILE_H264_MAIN = 77;
ExpoNodePublisherView.NMC_PROFILE_H264_HIGH = 100;
ExpoNodePublisherView.NMC_PROFILE_H265_MAIN = 1;
ExpoNodePublisherView.NMC_PROFILE_AAC_LC = 1;
ExpoNodePublisherView.NMC_PROFILE_AAC_HE = 4;
ExpoNodePublisherView.NMC_PROFILE_AAC_HE_V2 = 28;
ExpoNodePublisherView.VIDEO_ORIENTATION_PORTRAIT = 1;
ExpoNodePublisherView.VIDEO_ORIENTATION_LANDSCAPE_RIGHT = 3;
ExpoNodePublisherView.VIDEO_ORIENTATION_LANDSCAPE_LEFT = 4;
ExpoNodePublisherView.FLAG_AF = 1;
ExpoNodePublisherView.FLAG_AE = 2;
ExpoNodePublisherView.FLAG_AWB = 4;
ExpoNodePublisherView.NMC_DEVICE_TYPE_WideAngleCamera = 0;
ExpoNodePublisherView.NMC_DEVICE_TYPE_TelephotoCamera = 1;
ExpoNodePublisherView.NMC_DEVICE_TYPE_UltraWideCamera = 2;
ExpoNodePublisherView.NMC_DEVICE_TYPE_DualCamera = 3;
ExpoNodePublisherView.NMC_DEVICE_TYPE_TripleCamera = 4;
ExpoNodePublisherView.EFFECTOR_BRIGHTNESS = "brightness";
ExpoNodePublisherView.EFFECTOR_CONTRAST = "contrast";
ExpoNodePublisherView.EFFECTOR_SATURATION = "saturation";
ExpoNodePublisherView.EFFECTOR_SHARPEN = "sharpen";
ExpoNodePublisherView.EFFECTOR_SMOOTHSKIN = "smoothskin";
ExpoNodePublisherView.EFFECTOR_STYLE = "style";
ExpoNodePublisherView.EFFECTOR_STYLE_ID_ORIGINAL = 0;
ExpoNodePublisherView.EFFECTOR_STYLE_ID_ENHANCED = 1;
ExpoNodePublisherView.EFFECTOR_STYLE_ID_FAIRSKIN = 2;
ExpoNodePublisherView.EFFECTOR_STYLE_ID_COOL = 3;
ExpoNodePublisherView.EFFECTOR_STYLE_ID_FILM = 4;
ExpoNodePublisherView.EFFECTOR_STYLE_ID_BOOST = 5;

export default ExpoNodePublisherView;