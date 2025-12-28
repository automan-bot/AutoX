/**
 * iOS Hybrid 앱용 Appium Capabilities
 */

import { iosNativeCaps, IosNativeCapsOptions } from "./ios.native";

export interface IosHybridCapsOptions extends IosNativeCapsOptions {
  webviewContextName?: string;
}

export const iosHybridCaps = (opts: IosHybridCapsOptions) => {
  const caps = iosNativeCaps(opts);
  return {
    ...caps,
    "appium:autoWebview": true,
    "appium:webviewContextName": opts.webviewContextName ?? "WEBVIEW"
  };
};

