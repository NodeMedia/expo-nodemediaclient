package expo.modules.nodemediaclient

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoNodePublisherViewModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoNodePublisherView")

        View(ExpoNodePublisherView::class) {
            Events("onEventCallback")

            Prop("url") { view: ExpoNodePublisherView, url: String ->
                view.url = url
            }

            Prop("cryptoKey") { view: ExpoNodePublisherView, cryptoKey: String ->
                view.cryptoKey = cryptoKey
            }

            Prop("HWAccelEnable") { view: ExpoNodePublisherView, HWAccelEnable: Boolean ->
                view.HWAccelEnable = HWAccelEnable
            }

            // Audio parameters
            Prop("audioParam") { view: ExpoNodePublisherView, audioParam: Map<String, Int> ->
                view.audioCodecId = audioParam["codecid"] as Int
                view.audioProfile = audioParam["profile"] as Int
                view.audioChannels = audioParam["channels"] as Int
                view.audioSamplingRate = audioParam["samplingRate"] as Int
                view.audioBitrate = audioParam["bitrate"] as Int
            }

            // Video parameters
            Prop("videoParam") { view: ExpoNodePublisherView, videoParam: Map<String, Int> ->
                view.videoCodecId = videoParam["codecid"] as Int
                view.videoProfile = videoParam["profile"] as Int
                view.videoWidth = videoParam["width"] as Int
                view.videoHeight = videoParam["height"] as Int
                view.videoFps = videoParam["fps"] as Int
                view.videoBitrate = videoParam["bitrate"] as Int
            }

            Prop("keyFrameInterval") { view: ExpoNodePublisherView, keyFrameInterval: Int ->
                view.keyFrameInterval = keyFrameInterval
            }

            Prop("videoOrientation") { view: ExpoNodePublisherView, videoOrientation: Int ->
                view.videoOrientation = videoOrientation
            }

            Prop("frontCamera") { view: ExpoNodePublisherView, frontCamera: Boolean ->
                view.frontCamera = frontCamera
            }

            Prop("cameraFrontMirror") { view: ExpoNodePublisherView, cameraFrontMirror: Boolean ->
                view.cameraFrontMirror = cameraFrontMirror
            }

            Prop("denoiseEnable") { view: ExpoNodePublisherView, denoiseEnable: Boolean ->
                view.denoiseEnable = denoiseEnable
            }

            Prop("roomRatio") { view: ExpoNodePublisherView, roomRatio: Float ->
                view.roomRatio = roomRatio
            }

            Prop("volume") { view: ExpoNodePublisherView, volume: Float ->
                view.volume = volume
            }

            Prop("torchEnable") { view: ExpoNodePublisherView, torchEnable: Boolean ->
                view.torchEnable = torchEnable
            }

            // Color and effect parameters
            Prop("colorStyleId") { view: ExpoNodePublisherView, colorStyleId: Int ->
                view.colorStyleId = colorStyleId
            }

            Prop("colorStyleIntensity") { view: ExpoNodePublisherView, colorStyleIntensity: Float ->
                view.colorStyleIntensity = colorStyleIntensity
            }

            Prop("smoothskinIntensity") { view: ExpoNodePublisherView, smoothskinIntensity: Float ->
                view.smoothskinIntensity = smoothskinIntensity
            }

            // Methods
            AsyncFunction("start") { view: ExpoNodePublisherView, url: String? ->
                view.start(url)
            }

            AsyncFunction("stop") { view: ExpoNodePublisherView ->
                view.stop()
            }

            AsyncFunction("setEffectParameter") { view: ExpoNodePublisherView, key: String, value: Float ->
                view.setEffectParameter(key, value)
            }

            AsyncFunction("setEffectStyle") { view: ExpoNodePublisherView, style: Int ->
                view.setEffectStyle(style)
            }

            AsyncFunction("startFocusAndMeteringCenter") { view: ExpoNodePublisherView ->
                view.startFocusAndMeteringCenter()
            }
        }
    }
}