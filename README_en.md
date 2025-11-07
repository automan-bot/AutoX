# Auto.js And Autox.js

[中文文档](README.md)

## Introduction

- **This version integrates the Autobot API into the original autox.js, supporting non-accessibility screen projection automation, while preserving code commit history.**

- Autobot non-accessibility screen projection automation: [https://automan-bot.github.io/autobot_doc/#/zh-cn/](https://automan-bot.github.io/autobot_doc/#/zh-cn/)
- Documentation for Autox.js integrated with Autobot API: [https://automan-bot.github.io/autojs/#/autoxApi](https://automan-bot.github.io/autojs/#/autoxApi)

### The following is the original introduction (some documentation links have been replaced with community links and the download address of this project):

A JavaScript runtime and development environment for the Android platform that supports Accessibility Service. Its goal is to be similar to JsBox and Workflow.

This project is derived from [hyb1996](https://github.com/hyb1996/Auto.js) (note: the original repository is no longer accessible) and renamed to Autox.js (a modified version of autojs).  
You are now viewing a project based on the original 4.1 version.  
We will later introduce how to develop and run this project, and welcome more developers to participate in its maintenance and upgrade.  
The original [hyb1996](https://github.com/hyb1996/Auto.js) version used the [Mozilla Public License Version 2.0](https://github.com/hyb1996/NoRootScriptDroid/blob/master/LICENSE.md)  
+**Non-commercial use**. For various reasons, this product adopts the [GPL-V2](https://opensource.org/licenses/GPL-2.0) license.  
Both contributors and users must comply with the requirements of MPL-2.0 + non-commercial use and GPL-V2.

About the two licenses:

* GPL-V2: [https://opensource.org/licenses/GPL-2.0](https://opensource.org/license/gpl-2-0/)
* MPL-2: [https://www.mozilla.org/MPL/2.0](https://www.mozilla.org/MPL/2.0)

### Current Autox.js:

* Documentation: [https://autox-community.github.io/AutoX_Docs/](https://autox-community.github.io/AutoX_Docs/)
* Community open-source repository: https://github.com/autox-community/AutoX
* Community home: [https://github.com/autox-community](https://github.com/autox-community)

### Download Autox.js:
[https://github.com/automan-bot/AutoX/releases](https://github.com/automan-bot/AutoX/releases)  
If download speed is slow, right-click the APK file link in Release Assets, copy the address, and paste it into a GitHub acceleration site such as [http://toolwa.com/github/](http://toolwa.com/github/).

#### APK Version Info:
- **universal:** Universal version (recommended for general use, includes both CPU architectures below)
- **armeabi-v7a:** 32-bit ARM devices (ideal for older phones)
- **arm64-v8a:** 64-bit ARM devices (mainstream flagship models)

### Features

- **Important: Integrated Autobot API, supporting non-accessibility screen projection automation**

1. Simple and easy-to-use automation functions based on Accessibility Service
2. Floating window recording and playback
3. A more powerful selector API for finding, traversing, retrieving, and interacting with UI elements, similar to Google’s UiAutomator framework — can also serve as a mobile UI testing framework
4. Uses JavaScript as the scripting language, with features like code completion, variable renaming, code formatting, and search & replace — can serve as a JavaScript IDE
5. Supports building GUIs with e4x, and packaging JavaScript into APKs for tool app development
6. Supports Root operations for enhanced screen interaction (clicks, swipes, recording) and shell commands; recorded actions can be saved as JS or binary files for smooth replay
7. Provides functions for screen capture, image saving, color and image recognition
8. Can be used as a Tasker plugin to automate daily workflows
9. Includes a layout inspector tool similar to Android Studio’s Layout Inspector for UI hierarchy analysis

#### Notes for Code Contributors:

If the original file does not declare a license, it is considered under MPL 2.0.  
New or modified files (only your own code) should use GPL-V2 and include an appropriate declaration.

#### For Developers Extending Autox.js:

* If you use GPL-2.0 licensed code or binaries, you **must open source all your code**.
* If you only use MPL-2.0 licensed components, you only need to open source your modified parts.

#### About Open Source and Commercial Use

* Open source ≠ unrestricted use, and ≠ prohibition of commercial use.
* Open-source software **can** be commercialized — but only if you follow the license terms.
* Commercial products can be open-source (e.g., Red Hat).
* Misuse of open-source software can lead to legal issues — see examples like OpenWRT-related infringements in China.

#### About JS Scripts Developed by Others Running on This Platform

* That’s your freedom — these scripts are **not** subject to this license, similar to running software on Linux.

#### Can This Product or Auto.js Be Used Commercially?

* Whether this product can be used commercially depends on Auto.js, since many features and code copyrights belong to Auto.js.
* Whether Auto.js itself can be used commercially depends on your interpretation of its “**Non-commercial use**” clause and its legal validity.
* This project itself will **not** use Auto.js commercially.

### Build Instructions:
Environment requirement: `jdk` version 17 or higher

All commands are executed in the project root directory.  
If you are using Windows PowerShell < 7.0, use the version of commands with “;” instead of “&&”.

##### Install Debug Version on Device Locally:
```shell
./gradlew app:buildDebugTemplateApp && ./gradlew app:assembleV6Debug && ./gradlew app:installV6Debug
# or
./gradlew app:buildDebugTemplateApp ; ./gradlew app:assembleV6Debug ; ./gradlew app:installV6Debug
```
The debug APK will be generated at `app/build/outputs/apk/v6/debug` with the default signature.

##### Build Release Version Locally:
```shell
./gradlew app:buildTemplateApp && ./gradlew inrt:cp2APP && ./gradlew app:assembleV6
# or
./gradlew app:buildTemplateApp ; ./gradlew inrt:cp2APP ; ./gradlew app:assembleV6
```
The unsigned release APK will be located at `app/build/outputs/apk/v6/release` and must be signed before installation.

##### Run Debug Version in Android Studio:
First, run:
```shell
./gradlew app:buildDebugTemplateApp
```
Then click the **Run** button in Android Studio.

##### Build and Sign Release Version in Android Studio:
First, run:
```shell
./gradlew app:buildTemplateApp
```
Then go to **Build → Generate Signed Bundle / APK... → Select “APK” → Next → Choose or create a keystore → Next → Select “v6Release” → Finish.**  
The generated APK will be located in `app/v6/release`.
