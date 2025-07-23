//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-22.
//  All rights reserved.
//

import { ViewProps} from 'react-native';
import { requireNativeViewManager } from 'expo-modules-core';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export type NodePlayerRef = {
  start: (url?:string) => void;
  stop: () => void;
}

export type NodePlayerProps = {
  ref?: React.Ref<NodePlayerRef>;
  url?: string;
  volume?: number;
  cryptoKey?: string;
  scaleMode?: number;
  bufferTime?: number;
  HTTPReferer?: string;
  HTTPUserAgent?: string;
  RTSPTransport?: string;
  HWAccelEnable?: boolean;
} & ViewProps;

const NativeView: React.ComponentType<NodePlayerProps> = requireNativeViewManager('ExpoNodePlayerView');

export default forwardRef<NodePlayerRef, NodePlayerProps>((props, ref) => {
  const nativeRef = useRef<NodePlayerRef>(null);

  useImperativeHandle(ref, () => ({
    start: (url?:string) => {
      nativeRef.current?.start(url);
    },
    stop: () => {
      nativeRef.current?.stop();
    }
  }));

  return <NativeView ref={nativeRef} {...props} />;
});

