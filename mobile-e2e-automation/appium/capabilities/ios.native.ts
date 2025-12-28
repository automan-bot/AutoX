/**
 * iOS Native 앱용 Appium Capabilities
 */

export interface IosNativeCapsOptions {
  appPath: string;
  deviceName?: string;
  platformVersion?: string;
  udid?: string;
}

export const iosNativeCaps = (opts: IosNativeCapsOptions) => ({
  platformName: "iOS",
  "appium:automationName": "XCUITest",
  "appium:app": opts.appPath,
  "appium:deviceName": opts.deviceName ?? "iPhone Simulator",
  "appium:platformVersion": opts.platformVersion,
  "appium:udid": opts.udid,
  "appium:newCommandTimeout": 120,
  "appium:autoAcceptAlerts": false,
  "appium:noReset": false,
  "appium:fullReset": false
});

