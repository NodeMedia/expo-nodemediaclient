//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-22.
//  All rights reserved.
//

package expo.modules.nodemediaclient

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoNodePlayerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoNodePlayerView")

    View(ExpoNodePlayerView::class) {
      Prop("url") { view: ExpoNodePlayerView, url: String ->
        view.url = url
      }

      Prop("volume") { view: ExpoNodePlayerView, volume: Float ->
        view.volume = volume
      }

      Prop("cryptoKey") { view: ExpoNodePlayerView, cryptoKey: String ->
        view.cryptoKey = cryptoKey
      }

      Prop("scaleMode") { view: ExpoNodePlayerView, scaleMode: Int ->
        view.scaleMode = scaleMode
      }

      Prop("bufferTime") { view: ExpoNodePlayerView, bufferTime: Int ->
        view.bufferTime = bufferTime
      }

      Prop("HTTPReferer") { view: ExpoNodePlayerView, HTTPReferer: String ->
        view.HTTPReferer = HTTPReferer
      }

      Prop("HTTPUserAgent") { view: ExpoNodePlayerView, HTTPUserAgent: String ->
        view.HTTPUserAgent = HTTPUserAgent
      }

      Prop("RTSPTransport") { view: ExpoNodePlayerView, RTSPTransport: String ->
        view.RTSPTransport = RTSPTransport
      }
      Prop("HWAccelEnable") { view: ExpoNodePlayerView, HWAccelEnable: Boolean ->
        view.HWAccelEnable = HWAccelEnable
      }
      AsyncFunction("start") { view: ExpoNodePlayerView, url: String? ->
        view.start(url)
      }

      AsyncFunction("stop") { view: ExpoNodePlayerView ->
        view.stop()
      }
    }
  }
}
