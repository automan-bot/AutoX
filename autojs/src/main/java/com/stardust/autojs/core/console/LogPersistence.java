package com.stardust.autojs.core.console;

import android.content.Context;
import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 日志持久化工具类
 * 负责将日志保存到文件，并在启动时恢复日志
 */
public class LogPersistence {
    private static final String TAG = "LogPersistence";
    private static final String LOG_FILE_NAME = "console_log.txt";
    private static final String LOG_FILE_BACKUP = "console_log_backup.txt";
    private static final long MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_LOG_LINES = 10000; // 最多保留10000行日志
    
    private final File mLogFile;
    private final File mBackupFile;
    private final ExecutorService mExecutor;
    private final SimpleDateFormat mDateFormat;
    
    public LogPersistence(Context context) {
        File logDir = new File(context.getFilesDir(), "logs");
        if (!logDir.exists()) {
            logDir.mkdirs();
        }
        mLogFile = new File(logDir, LOG_FILE_NAME);
        mBackupFile = new File(logDir, LOG_FILE_BACKUP);
        mExecutor = Executors.newSingleThreadExecutor();
        mDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.getDefault());
    }
    
    /**
     * 异步追加日志到文件
     */
    public void appendLog(final int level, final CharSequence content) {
        mExecutor.execute(() -> {
            try {
                // 检查文件大小，如果超过限制则进行轮转
                if (mLogFile.exists() && mLogFile.length() > MAX_LOG_SIZE) {
                    rotateLogFile();
                }
                
                // 追加日志
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(mLogFile, true))) {
                    String timestamp = mDateFormat.format(new Date());
                    String levelStr = getLevelString(level);
                    writer.write(String.format("[%s] [%s] %s\n", timestamp, levelStr, content));
                    writer.flush();
                }
            } catch (IOException e) {
                Log.e(TAG, "Failed to append log", e);
            }
        });
    }
    
    /**
     * 加载历史日志
     */
    public List<ConsoleImpl.LogEntry> loadLogs() {
        List<ConsoleImpl.LogEntry> logs = new ArrayList<>();
        
        if (!mLogFile.exists()) {
            return logs;
        }
        
        try (BufferedReader reader = new BufferedReader(new FileReader(mLogFile))) {
            String line;
            int id = 0;
            int lineCount = 0;
            
            // 如果日志行数过多，只读取最后的部分
            List<String> allLines = new ArrayList<>();
            while ((line = reader.readLine()) != null) {
                allLines.add(line);
            }
            
            // 只保留最后的 MAX_LOG_LINES 行
            int startIndex = Math.max(0, allLines.size() - MAX_LOG_LINES);
            for (int i = startIndex; i < allLines.size(); i++) {
                line = allLines.get(i);
                ConsoleImpl.LogEntry entry = parseLogLine(id++, line);
                if (entry != null) {
                    logs.add(entry);
                }
                lineCount++;
            }
            
            Log.d(TAG, "Loaded " + lineCount + " log entries from file");
        } catch (IOException e) {
            Log.e(TAG, "Failed to load logs", e);
        }
        
        return logs;
    }
    
    /**
     * 清除所有日志
     */
    public void clearLogs() {
        mExecutor.execute(() -> {
            try {
                if (mLogFile.exists()) {
                    mLogFile.delete();
                }
                if (mBackupFile.exists()) {
                    mBackupFile.delete();
                }
                Log.d(TAG, "Cleared all persistent logs");
            } catch (Exception e) {
                Log.e(TAG, "Failed to clear logs", e);
            }
        });
    }
    
    /**
     * 日志文件轮转
     */
    private void rotateLogFile() {
        try {
            // 删除旧的备份文件
            if (mBackupFile.exists()) {
                mBackupFile.delete();
            }
            
            // 将当前文件重命名为备份文件
            if (mLogFile.exists()) {
                mLogFile.renameTo(mBackupFile);
            }
            
            // 读取备份文件的后半部分写入新文件
            if (mBackupFile.exists()) {
                List<String> lines = new ArrayList<>();
                try (BufferedReader reader = new BufferedReader(new FileReader(mBackupFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        lines.add(line);
                    }
                }
                
                // 只保留后半部分
                int startIndex = Math.max(0, lines.size() / 2);
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(mLogFile))) {
                    for (int i = startIndex; i < lines.size(); i++) {
                        writer.write(lines.get(i));
                        writer.write("\n");
                    }
                }
                
                // 删除备份文件
                mBackupFile.delete();
            }
            
            Log.d(TAG, "Log file rotated");
        } catch (IOException e) {
            Log.e(TAG, "Failed to rotate log file", e);
        }
    }
    
    /**
     * 解析日志行
     */
    private ConsoleImpl.LogEntry parseLogLine(int id, String line) {
        try {
            // 格式: [2026-01-16 10:42:30.123] [DEBUG] log content
            if (line.startsWith("[")) {
                int endBracket = line.indexOf("]", 1);
                if (endBracket > 0) {
                    int secondBracket = line.indexOf("]", endBracket + 1);
                    if (secondBracket > 0) {
                        String levelStr = line.substring(endBracket + 3, secondBracket);
                        String content = line.substring(secondBracket + 2);
                        int level = parseLevelString(levelStr);
                        return new ConsoleImpl.LogEntry(id, level, content, true);
                    }
                }
            }
            
            // 如果解析失败，作为普通日志处理
            return new ConsoleImpl.LogEntry(id, Log.VERBOSE, line, true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to parse log line: " + line, e);
            return null;
        }
    }
    
    /**
     * 获取日志级别字符串
     */
    private String getLevelString(int level) {
        switch (level) {
            case Log.VERBOSE:
                return "VERBOSE";
            case Log.DEBUG:
                return "DEBUG";
            case Log.INFO:
                return "INFO";
            case Log.WARN:
                return "WARN";
            case Log.ERROR:
                return "ERROR";
            case Log.ASSERT:
                return "ASSERT";
            default:
                return "UNKNOWN";
        }
    }
    
    /**
     * 解析日志级别字符串
     */
    private int parseLevelString(String levelStr) {
        switch (levelStr) {
            case "VERBOSE":
                return Log.VERBOSE;
            case "DEBUG":
                return Log.DEBUG;
            case "INFO":
                return Log.INFO;
            case "WARN":
                return Log.WARN;
            case "ERROR":
                return Log.ERROR;
            case "ASSERT":
                return Log.ASSERT;
            default:
                return Log.VERBOSE;
        }
    }
    
    /**
     * 关闭持久化服务
     */
    public void shutdown() {
        mExecutor.shutdown();
    }
}
