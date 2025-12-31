//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-23.
//  All rights reserved.
//

import ExpoModulesCore

public class ExpoNodePlayerViewModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoNodemediaclient')` in JavaScript.
    Name("ExpoNodePlayerView")

    View(ExpoNodePlayerView.self) {
      Events("onEventCallback")

      Prop("url") { (view, url: String) in
        view.url = url
      }
      Prop("volume") { (view, volume: Float) in
        view.volume = volume
      }
      Prop("croptyKey") { (view, key: String) in
        view.croptyKey = key
      }
      Prop("scaleMode") { (view, mode: Int) in
        view.scaleMode = mode
      }
      Prop("bufferTime") { (view, time: Int) in
        view.bufferTime = time
      }
      Prop("HTTPReferer") { (view, referer: String) in
        view.HTTPReferer = referer
      }
      Prop("HTTPUserAgent") { (view, userAgent: String) in
        view.HTTPUserAgent = userAgent
      }
      Prop("RTSPTransport") { (view, transport: String) in
        view.RTSPTransport = transport
      }
      Prop("HWAccelEnable") { (view, enable: Bool) in
        view.HWAccelEnable = enable
      }

      AsyncFunction("start") { (view: ExpoNodePlayerView, url: String?) in
        view.start(u:url)
      }

      AsyncFunction("stop") { (view: ExpoNodePlayerView) in
        view.stop()
      }
    }

  }
}