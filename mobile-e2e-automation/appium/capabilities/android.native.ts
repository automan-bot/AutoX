/**
 * Android Native 앱용 Appium Capabilities
 */

export interface AndroidNativeCapsOptions {
  appPath: string;
  deviceName?: string;
  platformVersion?: string;
  udid?: string;
}

export const androidNativeCaps = (opts: AndroidNativeCapsOptions) => ({
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:app": opts.appPath,
  "appium:deviceName": opts.deviceName ?? "Android Emulator",
  "appium:platformVersion": opts.platformVersion,
  "appium:udid": opts.udid,
  "appium:newCommandTimeout": 120,
  "appium:autoGrantPermissions": false,
  "appium:disableWindowAnimation": true,
  "appium:noReset": false,
  "appium:fullReset": false
});

