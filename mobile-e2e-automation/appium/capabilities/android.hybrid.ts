/**
 * Android Hybrid 앱용 Appium Capabilities
 */

import { androidNativeCaps, AndroidNativeCapsOptions } from "./android.native";

export interface AndroidHybridCapsOptions extends AndroidNativeCapsOptions {
  webviewContextName?: string;
}

export const androidHybridCaps = (opts: AndroidHybridCapsOptions) => {
  const caps = androidNativeCaps(opts);
  return {
    ...caps,
    "appium:autoWebview": true,
    "appium:webviewContextName": opts.webviewContextName ?? "WEBVIEW_com.example.app"
  };
};

