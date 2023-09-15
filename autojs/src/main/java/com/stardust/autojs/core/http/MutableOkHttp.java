package com.stardust.autojs.core.http;

import com.stardust.util.TextUtils;

import java.net.SocketTimeoutException;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by Stardust on 2018/4/11.
 */

public class MutableOkHttp extends OkHttpClient {
    private static final String REQ_TIMEOUT="timeout";
    private OkHttpClient mOkHttpClient;
    private int mMaxRetries = 3;
    private long mTimeout = 30 * 1000;
    private Interceptor mRetryInterceptor = chain -> {
        Request request = chain.request();
        String reqTimeout = request.header(REQ_TIMEOUT);
        if(!TextUtils.isBlank(reqTimeout)){
            chain = chain.withConnectTimeout(Integer.parseInt(reqTimeout),TimeUnit.SECONDS);
            chain = chain.withReadTimeout(Integer.parseInt(reqTimeout),TimeUnit.SECONDS);
            chain = chain.withWriteTimeout(Integer.parseInt(reqTimeout),TimeUnit.SECONDS);
        }

        /*String readTimeout = request.header(RESET_READ_TIMEOUT);
        if(StringUtils.isNotBlank(readTimeout)){
            chain = chain.withReadTimeout(Integer.parseInt(readTimeout),TimeUnit.SECONDS);
        }

        String writeTimeout = request.header(RESET_WRITE_TIMEOUT);
        if(StringUtils.isNotBlank(writeTimeout)){
            chain = chain.withWriteTimeout(Integer.parseInt(writeTimeout),TimeUnit.SECONDS);
        }*/
        Response response = null;
        int tryCount = 0;
        do {
            boolean succeed;
            try {
                if (response != null) {
                    response.close();
                }
                response = chain.proceed(request);
                succeed = response.isSuccessful();
            } catch (SocketTimeoutException e) {
                succeed = false;
                if (tryCount >= getMaxRetries()) {
                    throw e;
                }
            }
            if (succeed || tryCount >= getMaxRetries()) {
                return response;
            }
            tryCount++;
        } while (true);
    };

    public MutableOkHttp() {
        mOkHttpClient = newClient(new OkHttpClient.Builder());
    }

    public OkHttpClient client() {
        return mOkHttpClient;
    }

    protected OkHttpClient newClient(Builder builder) {
        builder.readTimeout(getTimeout(), TimeUnit.MILLISECONDS)
                .writeTimeout(getTimeout(), TimeUnit.MILLISECONDS)
                .connectTimeout(getTimeout(), TimeUnit.MILLISECONDS);
        for (Interceptor interceptor : getInterceptors()) {
            builder.addInterceptor(interceptor);
        }
        return builder.build();
    }

    public Iterable<? extends Interceptor> getInterceptors() {
        return Collections.singletonList(mRetryInterceptor);
    }

    public int getMaxRetries() {
        return mMaxRetries;
    }

    public void setMaxRetries(int maxRetries) {
        mMaxRetries = maxRetries;
    }

    public long getTimeout() {
        return mTimeout;
    }


    public void setTimeout(long timeout) {
        mTimeout = timeout;
        muteClient();
    }

    public synchronized void muteClient(Builder builder) {
        mOkHttpClient = newClient(builder);
    }

    protected synchronized void muteClient() {
        mOkHttpClient = newClient(mOkHttpClient.newBuilder());
    }
}
