package expo.modules.nodemediaclient

import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

import android.widget.FrameLayout
import cn.nodemedia.NodePublisher
import expo.modules.kotlin.viewevent.EventDispatcher

class ExpoNodePublisherView(context: Context, appContext: AppContext) :
    ExpoView(context, appContext) {
    private val TAG = "ExpoNodePublisherView"
    private var np: NodePublisher? = null
    private val onEventCallback by EventDispatcher()

    var url = ""
    var cryptoKey = ""
    var HWAccelEnable = true
    var denoiseEnable = true

    var roomRatio: Float? = null
        set(value) {
            field = value
            value?.let { np?.setRoomRatio(it) }
        }

    var volume: Float? = null
        set(value) {
            field = value
            value?.let { np?.setVolume(it) }
        }

    var torchEnable: Boolean? = null
        set(value) {
            field = value
            value?.let { np?.enableTorch(it) }
        }

    // Color and effect parameters
    var colorStyleId: Int? = null
        set(value) {
            field = value
            value?.let { np?.setEffectStyle(it) }
        }

    var colorStyleIntensity: Float? = null
        set(value) {
            field = value
            value?.let { np?.setEffectParameter("style", it) }
        }

    var smoothskinIntensity: Float? = null
        set(value) {
            field = value
            value?.let { np?.setEffectParameter("smoothskin", it) }
        }

    // Audio parameters
    var audioCodecId = NodePublisher.NMC_CODEC_ID_AAC
    var audioProfile = NodePublisher.NMC_PROFILE_AUTO
    var audioChannels = 2
    var audioSamplingRate = 44100
    var audioBitrate = 64000

    // Video parameters
    var videoCodecId = NodePublisher.NMC_CODEC_ID_H264
    var videoProfile = NodePublisher.NMC_PROFILE_AUTO
    var videoWidth = 720
    var videoHeight = 1280
    var videoFps = 30
    var videoBitrate = 2000000

    var frontCamera: Boolean? = null
        set(value) {
            field = value
            value?.let {
                np?.closeCamera()
                np?.openCamera(if (it) NodePublisher.NMC_CAMERA_FRONT else NodePublisher.NMC_CAMERA_BACK)
            }
        }

    // Other parameters
    var keyFrameInterval = 2
    var videoOrientation = 1

    var cameraFrontMirror: Boolean? = null
        set(value) {
            field = value
            value?.let { np?.setCameraFrontMirror(it) }
        }

    private val videoView = FrameLayout(context).apply {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    }

    init {
        addView(videoView)
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        np = NodePublisher(context, LICENSE_KEY)
        np?.setOnNodePublisherEventListener { obj, event, msg ->
            onEventCallback(mapOf("event" to event, "msg" to msg))
        }
        // Apply audio and video params
        applyAudioParams()
        applyVideoParams()

        // Apply crypto key and HWAccelEnable
        np?.setCryptoKey(this.cryptoKey)
        np?.setHWAccelEnable(this.HWAccelEnable)
        np?.setDenoiseEnable(this.denoiseEnable)
        
        // Apply color and effect params if set
        colorStyleId?.let { np?.setEffectStyle(it) }
        colorStyleIntensity?.let { np?.setEffectParameter("style", it) }
        smoothskinIntensity?.let { np?.setEffectParameter("smoothskin", it) }

        // Apply volume if set
        volume?.let { np?.setVolume(it) }

        // opencamera and attachview
        np?.openCamera(if (frontCamera == true) 0 else 1)
        np?.attachView(videoView)

        np?.setRoomRatio(roomRatio ?: 1f)
    }

    override fun onDetachedFromWindow() {
        np?.stop()
        np?.closeCamera()
        np?.detachView()
        np = null
        super.onDetachedFromWindow()
    }

    private fun applyAudioParams() {
        np?.setAudioCodecParam(
            audioCodecId, audioProfile,
            audioSamplingRate, audioChannels, audioBitrate
        )
    }

    private fun applyVideoParams() {
        np?.setVideoCodecParam(
            videoCodecId,
            videoProfile, videoWidth, videoHeight, videoFps, videoBitrate
        )
    }

    fun start(url: String?) {
        if (!url.isNullOrEmpty()) {
            this.url = url
        }
        np?.start(this.url)
    }

    fun stop() {
        np?.stop()
    }

    fun setEffectParameter(key: String, value: Float) {
        np?.setEffectParameter(key, value)
    }

    fun setEffectStyle(style: Int) {
        np?.setEffectStyle(style)
    }

    fun startFocusAndMeteringCenter() {
        np?.startFocusAndMeteringCenter()
    }
}