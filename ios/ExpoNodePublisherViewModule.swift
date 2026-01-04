//
//  Copyright (c) 2025 NodeMedia Technology Co., Ltd.
//  Created by Chen Mingliang on 2025-07-23.
//  All rights reserved.
//

import ExpoModulesCore

public class ExpoNodePublisherViewModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoNodePublisherView")
        
        View(ExpoNodePublisherView.self) {
            Events("onEventCallback")
            
            Prop("url") { (view, url: String) in
                view.url = url
            }
            
            Prop("cryptoKey") { (view, key: String) in
                view.cryptoKey = key
            }
            
            Prop("HWAccelEnable") { (view, enable: Bool) in
                view.HWAccelEnable = enable
            }
            
            // Audio parameters
            Prop("audioParam") { (view, audioParam: [String: Int]) in
                view.audioCodecid = audioParam["codecid"]!
                view.audioProfile = audioParam["profile"]!
                view.audioChannels = audioParam["channels"]!
                view.audioSamplingRate = audioParam["samplingRate"]!
                view.audioBitrate = audioParam["bitrate"]!
            }
            
            // Video parameters
            Prop("videoParam") { (view, videoParam: [String: Int]) in
                view.videoCodecid = videoParam["codecid"]!
                view.videoProfile = videoParam["profile"]!
                view.videoWidth = videoParam["width"]!
                view.videoHeight = videoParam["height"]!
                view.videoFps = videoParam["fps"]!
                view.videoBitrate = videoParam["bitrate"]!
            }
            
            Prop("keyFrameInterval") { (view, interval: Int) in
                view.keyFrameInterval = interval
            }
            
            Prop("videoOrientation") { (view, orientation: Int) in
                view.videoOrientation = orientation
            }
            
            Prop("frontCamera") { (view, front: Bool) in
                view.frontCamera = front
            }
            
            Prop("cameraFrontMirror") { (view, mirror: Bool) in
                view.cameraFrontMirror = mirror
            }
            
            Prop("roomRatio") { (view, ratio: Float) in
                view.roomRatio = ratio
            }
            
            Prop("torchEnable") { (view, enable: Bool) in
                view.torchEnable = enable
            }
            
            Prop("denoiseEnable") { (view, enable: Bool) in
                view.denoiseEnable = enable
            }

            Prop("volume") { (view, volume: Float) in
                view.volume = volume
            }
            
            // Color and effect parameters
            Prop("colorStyleId") { (view, styleId: Int) in
                view.colorStyleId = styleId
            }
            
            Prop("colorStyleIntensity") { (view, intensity: Float) in
                view.colorStyleIntensity = intensity
            }
            
            Prop("smoothskinIntensity") { (view, intensity: Float) in
                view.smoothskinIntensity = intensity
            }
            
            // Methods
            AsyncFunction("start") { (view: ExpoNodePublisherView, url: String?) in
                view.start(u: url)
            }
            
            AsyncFunction("stop") { (view: ExpoNodePublisherView) in
                view.stop()
            }
            
            AsyncFunction("setEffectParameter") { (view: ExpoNodePublisherView, key: String, value: Float) in
                view.setEffectParameter(key: key, value: value)
            }
            
            AsyncFunction("setEffectStyle") { (view: ExpoNodePublisherView, style: Int) in
                view.setEffectStyle(style: style)
            }
            
            AsyncFunction("startFocusAndMeteringCenter") { (view: ExpoNodePublisherView) in
                view.startFocusAndMeteringCenter()
            }
        }
    }
}
