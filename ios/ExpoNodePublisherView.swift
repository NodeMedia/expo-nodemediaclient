//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-23.
//  All rights reserved.
//

import ExpoModulesCore
import NodeMediaClient

class ExpoNodePublisherView: ExpoView, NodePublisherDelegate {
    private var _np: NodePublisher?
    var url = ""
    var cryptoKey = ""
    var HWAccelEnable = true
    var denoiseEnable = true

    // EventDispatcher for sending events to JavaScript
    var onEventCallback = EventDispatcher()

    // Color and effect parameters
    var colorStyleId: Int? {
        didSet {
            if let styleId = colorStyleId {
                _np?.setEffectStyleWithId(styleId)
            }
        }
    }

    var colorStyleIntensity: Float? {
        didSet {
            if let intensity = colorStyleIntensity {
                _np?.setEffectParameter("style", withIntensity: intensity)
            }
        }
    }

    var smoothskinIntensity: Float? {
        didSet {
            if let intensity = smoothskinIntensity {
                _np?.setEffectParameter("smoothskin", withIntensity: intensity)
            }
        }
    }
    
    // Audio parameters
    var audioCodecid = Int(NMC_CODEC_ID_AAC)
    var audioProfile = Int(NMC_PROFILE_AUTO)
    var audioChannels = 2
    var audioSamplingRate = 44100
    var audioBitrate = 64000
    
    // Video parameters
    var videoCodecid = Int(NMC_CODEC_ID_H264)
    var videoProfile = Int(NMC_PROFILE_AUTO)
    var videoWidth = 720
    var videoHeight = 1080
    var videoFps = 30
    var videoBitrate = 2000000
    
    var keyFrameInterval = 2
    var videoOrientation = 1
    var cameraFrontMirror = true
    
    var frontCamera: Bool? {
        didSet {
            if let fc = frontCamera {
                _np?.closeCamera()
                _np?.openCamera(fc)
            }
        }
    }
    
    var roomRatio: Float? {
        didSet {
            if let ratio = roomRatio {
                _np?.setRoomRatio(ratio)
            }
        }
    }
    
    var torchEnable: Bool? {
        didSet {
            if let torch = torchEnable {
                _np?.enableTorch(torch)
            }
        }
    }
    
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
    }
    
    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil {
            // View attached to window
            _np = NodePublisher(license: LICENSE_KEY)
            applyAudioParams()
            applyVideoParams()
            _np?.nodePublisherDelegate = self
            _np?.cameraFrontMirror = cameraFrontMirror
            _np?.videoOrientation = videoOrientation
            _np?.keyFrameInterval = keyFrameInterval
            _np?.cryptoKey = cryptoKey
            _np?.hwAccelEnable = HWAccelEnable
            _np?.denoiseEnable = denoiseEnable
            _np?.openCamera(frontCamera == true)
            _np?.attach(self)

            // Apply color and effect params if set
            if let styleId = colorStyleId {
                _np?.setEffectStyleWithId(styleId)
            }
            if let intensity = colorStyleIntensity {
                _np?.setEffectParameter("style", withIntensity: intensity)
            }
            if let intensity = smoothskinIntensity {
                _np?.setEffectParameter("smoothskin", withIntensity: intensity)
            }
        } else {
            // View detached from window
            _np?.stop()
            _np?.closeCamera()
            _np?.detachView()
            _np = nil
        }
    }
    
    private func applyAudioParams() {
        _np?.setAudioParamWithCodec(audioCodecid, profile: audioProfile, samplerate: audioSamplingRate, channels: audioChannels, bitrate: audioBitrate)
    }
    
    private func applyVideoParams() {
        _np?.setVideoParamWithCodec(videoCodecid, profile: videoProfile, width: videoWidth, height: videoHeight, fps: videoFps, bitrate: videoBitrate)
    }
    
    func start(u: String?) {
        if let newUrl = u {
            url = newUrl
        }
        _np?.start(url)
    }
    
    func stop() {
        _np?.stop()
    }
    
    func setEffectParameter(key: String, value: Float) {
        // Convert string to float for effect parameter
        _np?.setEffectParameter(key, withIntensity: value)
    }
    
    func setEffectStyle(style: Int) {
        _np?.setEffectStyleWithId(style)
    }

    // MARK: - NodePublisherDelegate

    func onEventCallback(_ sender: Any, event: Int32, msg: String) {
        onEventCallback([
            "event": Int(event),
            "msg": msg
        ])
    }

}
