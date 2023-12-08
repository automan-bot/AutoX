package com.aiselp.autojs.codeeditor.web

import android.app.Activity
import android.content.Context
import android.os.Build
import android.util.Log
import android.view.ViewGroup
import android.webkit.WebView
import androidx.annotation.RequiresApi
import com.aiselp.autojs.codeeditor.plugins.FileSystem
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.async
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

@RequiresApi(Build.VERSION_CODES.M)
class EditorAppManager(val context: Activity) {
    companion object {
        const val TAG = "EditorAppManager"
        const val WEB_DIST_PATH = "codeeditor/dist.zip"
        const val WEB_PUBLIC_PATH = "editorWeb/"
    }

    private val coroutineScope = CoroutineScope(Dispatchers.Default)
    private val executors: ExecutorService = Executors.newSingleThreadExecutor()
    val webView = createWebView(context)
    private val jsBridge = JsBridge(webView)
    private val fileHttpServer = FileHttpServer(
        context, File(
            context.filesDir, "$WEB_PUBLIC_PATH/dist"
        )
    )
    private val pluginManager = PluginManager(jsBridge, coroutineScope)
    var opendeFile: String? = null

    init {
        webView.webViewClient = JsBridge.SuperWebViewClient()
        installPlugin()
        coroutineScope.launch {
            launch(executors.asCoroutineDispatcher()) { fileHttpServer.start() }
            async { initWebResources() }.await()
            delay(300)
            withContext(Dispatchers.Main) {
                webView.loadUrl(fileHttpServer.getAddress())
//                webView.loadUrl("http://192.168.10.10:8009")
            }
        }
//        webView.loadUrl("http://appassets.androidplatform.net/index.html")
        jsBridge.registerHandler("app.init", JsBridge.Handle { _, _ ->
            val file = opendeFile
            if (file != null) {
                openFile(file)
            }
        })
    }

    private fun installPlugin() {
        pluginManager.registerPlugin("FileSystem", FileSystem())
        jsBridge.registerHandler("app.exitApp", JsBridge.Handle { _, _ ->
            coroutineScope.launch(Dispatchers.Main) {
                context.moveTaskToBack(false)
            }
        })
    }

    private fun initWebResources() {
        val webDir = File(context.filesDir, WEB_PUBLIC_PATH)
        val versionFile = File(webDir, "version.txt")
        if (isUpdate(versionFile)) {
            Log.i(TAG, "skip initWebResources")
            return
        }
        Log.i(TAG, "initWebResources")
        webDir.mkdirs()
        context.assets.open(WEB_DIST_PATH).use { it ->
            ZipInputStream(it).use { zip ->
                var zipEntry: ZipEntry? = null;
                while (true) {
                    zipEntry = zip.nextEntry
                    if (zipEntry == null) break
                    val file = File(webDir, zipEntry.name)
                    if (zipEntry.isDirectory) {
                        file.mkdirs()
                    } else {
                        file.outputStream().use {
                            zip.copyTo(it)
                        }
                    }
                    zip.closeEntry()
                }
            }
        }
        val versionCode = context.packageManager.getPackageInfo(context.packageName, 0).versionCode
        versionFile.writeText(versionCode.toString())
    }

    private fun isUpdate(file: File): Boolean {
        if (!file.isFile) return false
        return try {
            val text = file.readText().toLong()
            val versionCode =
                context.packageManager.getPackageInfo(context.packageName, 0).versionCode
            versionCode.toLong() == text
        } catch (e: Exception) {
            false
        }
    }

    fun destroy() {
        webView.destroy()
        fileHttpServer.stop()
        coroutineScope.cancel()
        executors.shutdownNow()
    }

    fun openFile(path: String) {
        jsBridge.callHandler("app.openFile", path.replace(FileSystem.basePath.path, ""), null)
    }

    fun onKeyboardDidShow() {
        Log.d(TAG, "onKeyboardDidShow")
        jsBridge.callHandler("app.onKeyboardDidShow", null, null)
    }

    fun onKeyboardDidHide() {
        Log.d(TAG, "onKeyboardDidHide")
        jsBridge.callHandler("app.onKeyboardDidHide", null, null)
    }

    fun onBackButton() {
        Log.d(TAG, "onBackButton")
        jsBridge.callHandler("app.onBackButton", null, null)
    }

    private fun createWebView(context: Context): WebView {
        return WebView(context).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                allowFileAccessFromFileURLs = true
                allowUniversalAccessFromFileURLs = true
                useWideViewPort = true
            }
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }
    }
}