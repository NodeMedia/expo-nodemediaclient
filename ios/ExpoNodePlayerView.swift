//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-23.
//  All rights reserved.
//

import ExpoModulesCore
import NodeMediaClient

class ExpoNodePlayerView: ExpoView {
  private var _np: NodePlayer?
  var url = ""
  var croptyKey = ""
  var HTTPReferer = ""
  var HTTPUserAgent = ""
  var RTSPTransport = "udp"
  var HWAccelEnable = true
  private var _volume:Float = 1.0
  private var _scaleMode: UInt = 0
  private var _bufferTime: UInt = 1000
  

  var volume:Float {
    get {
      return _volume
    }
    set {
      _volume = newValue
      _np?.volume = newValue
    }
  }
  
  var scaleMode:UInt {
    get {
      return _scaleMode
    }
    set {
      _scaleMode = newValue
      _np?.scaleMode = newValue
    }
  }
  
  var bufferTime:UInt {
    get {
      return _bufferTime
    }
    set {
      _bufferTime = newValue
      _np?.bufferTime = newValue
    }
  }
  
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    _np = NodePlayer(license: LICENSE_KEY)
    _np?.attach(self)
  }
  
  deinit {
    _np?.stop()
    _np?.detachView()
    _np = nil
  }
  
  func start(u: String?) {
    if let newUrl = u {
      url = newUrl
    }
    _np?.volume = volume
    _np?.cryptoKey = croptyKey
    _np?.scaleMode = scaleMode
    _np?.bufferTime = bufferTime
    _np?.httpReferer = HTTPReferer
    _np?.httpUserAgent = HTTPUserAgent
    _np?.rtspTransport = RTSPTransport
    _np?.hwAccelEnable = HWAccelEnable
    _np?.start(url)
  }
  
  func stop() {
    _np?.stop()
  }

  override func layoutSubviews() {
    // webView.frame = bounds
  }
}

