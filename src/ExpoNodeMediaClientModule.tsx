//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-22.
//  All rights reserved.
//


import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoNodeMediaClientModule extends NativeModule{
  setLicense(license: string): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoNodeMediaClientModule>('ExpoNodeMediaClientModule');
