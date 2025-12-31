package expo.modules.nodemediaclient

import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

import android.util.Log
import android.widget.FrameLayout
import cn.nodemedia.NodePlayer

class ExpoNodePlayerView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    private val TAG = "ExpoNodePlayerView"
    private var np: NodePlayer? = null
    private val onEventCallback by EventDispatcher()

    var url = ""
    var cryptoKey = "" // Add this property
        set(value) {
            field = value
            np?.setCryptoKey(value)
        }
    var HTTPReferer = ""
        set(value) {
            field = value
            np?.setHTTPReferer(value)
        }
    var HTTPUserAgent = ""
        set(value) {
            field = value
            np?.setHTTPUserAgent(value)
        }
    var volume = 1.0f
        set(value) {
            field = value
            np?.setVolume(value)
        }
    var scaleMode = 0
        set(value) {
            field = value
            np?.setScaleMode(value)
        }
    var bufferTime = 1000
        set(value) {
            field = value
            Log.d(TAG, "bufferTime set to $value ms $np")
            np?.setBufferTime(value)
        }
    var RTSPTransport = "udp"
        set(value) {
            field = value
            np?.setRTSPTransport(value)
        }

    var HWAccelEnable = true
        set(value) {
            field = value
            np?.setHWAccelEnable(value)
        }
    private val videoView = FrameLayout(context).apply {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    }

    init {
        addView(videoView)
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        np = NodePlayer(context, LICENSE_KEY)
        np?.setOnNodePlayerEventListener { obj, event, msg ->
            onEventCallback(mapOf("event" to event, "msg" to msg))
        }
        np?.attachView(videoView)
    }

    override fun onDetachedFromWindow() {
        np?.stop()
        np?.detachView()
        np = null
        super.onDetachedFromWindow()
    }

    fun start(url: String?) {
        if (!url.isNullOrEmpty()) {
            this.url = url
        }
        np?.setVolume(this.volume)
        np?.setCryptoKey(this.cryptoKey)
        np?.setScaleMode(this.scaleMode)
        np?.setBufferTime(this.bufferTime)
        np?.setHTTPReferer(this.HTTPReferer)
        np?.setHTTPUserAgent(this.HTTPUserAgent)
        np?.setRTSPTransport(this.RTSPTransport)
        np?.setHWAccelEnable(this.HWAccelEnable)
        np?.start(this.url)
    }

    fun stop() {
        np?.stop()
    }
}