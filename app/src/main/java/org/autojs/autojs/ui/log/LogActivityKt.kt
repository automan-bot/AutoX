package org.autojs.autojs.ui.log

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Environment
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.viewinterop.AndroidView
import com.stardust.autojs.core.console.ConsoleView
import com.stardust.autojs.core.console.GlobalConsole
import org.autojs.autojs.autojs.AutoJs
import org.autojs.autojs.ui.compose.theme.AutoXJsTheme
import org.autojs.autojs.ui.compose.util.SetSystemUI
import org.autojs.autojs.ui.widget.fillMaxSize
import org.autojs.autoxjs.R
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class LogActivityKt : ComponentActivity() {

    companion object {
        @JvmStatic
        fun start(context: Context) {
            context.startActivity(Intent(context, LogActivityKt::class.java))
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AutoXJsTheme {
                Surface(color = MaterialTheme.colors.surface) {
                    SetSystemUI()
                    Content()
                }
            }
        }
    }

    @Composable
    fun Content() {
        val consoleImpl = remember {
            AutoJs.getInstance().globalConsole
        }
        Scaffold(
            topBar = {
                TopAppBar()
            },
            floatingActionButton = {
                FloatingActionButton(consoleImpl)
            }
        ) {
            Console(it, consoleImpl)
        }
    }

    @Composable
    private fun Console(
        it: PaddingValues,
        consoleImpl: GlobalConsole
    ) {
        val isLight = MaterialTheme.colors.isLight
        AndroidView(
            modifier = Modifier.padding(it),
            factory = { context ->
                ConsoleView(context).apply {
                    fillMaxSize()


                    setConsole(consoleImpl)
                    findViewById<View>(R.id.input_container).visibility = View.GONE
                }
            },
            update = {
                if (isLight) {
                    it.colors.apply {
                        put(Log.VERBOSE, -0x203f3f40)
                        put(Log.DEBUG, -0x34000000)
                    }
                } else {
                    it.colors.apply {
                        put(Log.VERBOSE, -0x203f3f40)
                        put(Log.DEBUG, -0x20000001)
                    }
                }
            }
        )
    }

    @Composable
    private fun FloatingActionButton(consoleImpl: GlobalConsole) {
        FloatingActionButton(onClick = { consoleImpl.clear() }) {
            Icon(
                imageVector = Icons.Default.Clear,
                contentDescription = stringResource(id = R.string.text_clear)
            )
        }
    }

    @Composable
    private fun TopAppBar() {
        var showMenu by remember { mutableStateOf(false) }
        
        TopAppBar(
            title = { Text(text = stringResource(id = R.string.text_log)) },
            navigationIcon = {
                IconButton(onClick = { finish() }) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = stringResource(id = R.string.desc_back)
                    )
                }
            },
            actions = {
                IconButton(onClick = { showMenu = true }) {
                    Icon(
                        imageVector = Icons.Default.MoreVert,
                        contentDescription = stringResource(id = R.string.text_menu)
                    )
                }
                DropdownMenu(
                    expanded = showMenu,
                    onDismissRequest = { showMenu = false }
                ) {
                    DropdownMenuItem(onClick = {
                        showMenu = false
                        copyLogToClipboard()
                    }) {
                        Text(text = stringResource(id = R.string.text_copy_log))
                    }
                    DropdownMenuItem(onClick = {
                        showMenu = false
                        shareLog()
                    }) {
                        Text(text = stringResource(id = R.string.text_share_log))
                    }
                    DropdownMenuItem(onClick = {
                        showMenu = false
                        exportLogToFile()
                    }) {
                        Text(text = stringResource(id = R.string.text_export_log))
                    }
                }
            }
        )
    }

    private fun getAllLogText(): String {
        val console = AutoJs.getInstance().globalConsole
        val logEntries = console.allLogs
        if (logEntries.isEmpty()) {
            return ""
        }
        
        val stringBuilder = StringBuilder()
        synchronized(logEntries) {
            for (entry in logEntries) {
                stringBuilder.append(entry.content).append("\n")
            }
        }
        return stringBuilder.toString()
    }

    private fun copyLogToClipboard() {
        val logText = getAllLogText()
        if (logText.isEmpty()) {
            Toast.makeText(this, R.string.text_no_log, Toast.LENGTH_SHORT).show()
            return
        }
        
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Log", logText)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, R.string.text_log_copied, Toast.LENGTH_SHORT).show()
    }

    private fun shareLog() {
        val logText = getAllLogText()
        if (logText.isEmpty()) {
            Toast.makeText(this, R.string.text_no_log, Toast.LENGTH_SHORT).show()
            return
        }
        
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, logText)
            putExtra(Intent.EXTRA_SUBJECT, getString(R.string.text_log))
        }
        startActivity(Intent.createChooser(shareIntent, getString(R.string.text_share_log)))
    }

    private fun exportLogToFile() {
        val logText = getAllLogText()
        if (logText.isEmpty()) {
            Toast.makeText(this, R.string.text_no_log, Toast.LENGTH_SHORT).show()
            return
        }
        
        try {
            // 创建文件名，包含时间戳
            val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
            val fileName = "log_$timestamp.txt"
            
            // 保存到 Downloads 目录
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            if (!downloadsDir.exists()) {
                downloadsDir.mkdirs()
            }
            
            val file = File(downloadsDir, fileName)
            file.writeText(logText)
            
            Toast.makeText(
                this,
                getString(R.string.text_log_exported, file.absolutePath),
                Toast.LENGTH_LONG
            ).show()
        } catch (e: Exception) {
            Toast.makeText(
                this,
                getString(R.string.text_export_failed, e.message),
                Toast.LENGTH_LONG
            ).show()
            Log.e("LogActivity", "Failed to export log", e)
        }
    }

}