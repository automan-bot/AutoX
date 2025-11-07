# Auto.js And Autox.js

[English Document](README_en.md)

## 简介

- **此版本是在autox.js原版上集成Autobot Api，支持非无障碍投屏，自动化。且保留了代码提交的历史**

- Autobot非无障碍投屏自动化，[https://automan-bot.github.io/autobot_doc/#/zh-cn/](https://automan-bot.github.io/autobot_doc/#/zh-cn/)
- Autox.js集成Autobot API的文档：[https://automan-bot.github.io/autojs/#/autoxApi](https://automan-bot.github.io/autojs/#/autoxApi)

### 以下是原版简介（文档部分替换成了社区的文档地址以及本项目的下载地址）：

一个支持无障碍服务的Android平台上的JavaScript 运行环境 和 开发环境，其发展目标是类似JsBox和Workflow。

本项目从[hyb1996](https://github.com/hyb1996/Auto.js)（注意：原仓库已经不能访问） autojs 获得,并命名为Autox.js （autojs 修改版本）
，你现在看的是原4.1版本基础上的项目，
后面我们将针对项目本身如何开发、运行的进行介绍，欢迎更多开发者参与这个项目维护升级。[hyb1996](https://github.com/hyb1996/Auto.js)采用的
[Mozilla Public License Version 2.0](https://github.com/hyb1996/NoRootScriptDroid/blob/master/LICENSE.md)
+**非商业性使用**，出于多种因素考虑， 本产品采用 [GPL-V2](https://opensource.org/licenses/GPL-2.0) 许可证，
无论是其他贡献者，还是使用该产品，均需按照 MPL-2.0+非商业性使用 和 GPL-V2 的相关要求使用。

关于两种协议：

* GPL-V2[https://opensource.org/licenses/GPL-2.0](https://opensource.org/license/gpl-2-0/)
* MPL-2 (https://www.mozilla.org/MPL/2.0)

### 现在的Autox.js：

* Autox.js文档： [https://autox-community.github.io/AutoX_Docs/](https://autox-community.github.io/AutoX_Docs/)
* 社区版开源地址：  https://github.com/autox-community/AutoX
* 社区地址：[https://github.com/autox-community](https://github.com/autox-community)


### Autox.js下载地址：
[https://github.com/automan-bot/AutoX/releases](https://github.com/automan-bot/AutoX/releases)  
如果下载过慢可以右键复制 Release Assets 中APK文件的链接地址，粘贴到 [http://toolwa.com/github/](http://toolwa.com/github/) 等github加速网站下载

#### APK版本说明：
- universal: 通用版（不在乎安装包大小/懒得选就用这个版本，包含以下2种CPU架构so）
- armeabi-v7a: 32位ARM设备（备用机首选）
- arm64-v8a: 64位ARM设备（主流旗舰机）

### 特性

- **重要： 集成Autobot Api，支持非无障碍投屏，自动化**

1. 由无障碍服务实现的简单易用的自动操作函数
2. 悬浮窗录制和运行
3. 更专业&强大的选择器API，提供对屏幕上的控件的寻找、遍历、获取信息、操作等。类似于Google的UI测试框架UiAutomator，您也可以把他当做移动版UI测试框架使用
4. 采用JavaScript为脚本语言，并支持代码补全、变量重命名、代码格式化、查找替换等功能，可以作为一个JavaScript IDE使用
5. 支持使用e4x编写界面，并可以将JavaScript打包为apk文件，您可以用它来开发小工具应用
6. 支持使用Root权限以提供更强大的屏幕点击、滑动、录制功能和运行shell命令。录制录制可产生js文件或二进制文件，录制动作的回放比较流畅
7. 提供截取屏幕、保存截图、图片找色、找图等函数
8. 可作为Tasker插件使用，结合Tasker可胜任日常工作流
9. 带有界面分析工具，类似Android Studio的LayoutInspector，可以分析界面层次和范围、获取界面上的控件信息的

#### 代码贡献者需要注意：

原文中没人声明license 即为MPL2.0 ,新加文件或修改（仅限于修你自己的）代码采用GPL-V2，需要做相关声明。

#### 其他人使用Autox.js，做深度开发请注意

* 如果你使用了带有GPL-2.0 声明的代码 或编译出来的二进制。你需要开源你所有代码。
* 如果你仅使用了MPL-2.0 的东西，你需要开源你修改过的相关代码。

#### 抛开本产品谈 开源和商业

* 开源不等于随意使用，开源也不等于禁止商用！
* 开源东西可以商用，但你需要按规定开源！
* 商用的产品可以是开源的，比如redhat！
* 不按开源协议使用开源产品，那可了解openwrt的来源，以及近几年国内的侵权案例！

#### 关于其他人开发的js脚本，在这上面运行。是否需要遵循GPL-2.0进行开源

* 那是你的自由，不受这协议限制，如同linux 运行软件一样

#### 使用本产品或autojs 产品是否可以商用?

* 本产品 能不能商用，取决于 原来autojs，因为目前很多功能和代码版权归autojs 所有。
* autojs 能不能商用,取决于你对于附带的 “ **非商业性使用** ” 的理解和其法律效益。
* 反正本产品不会拿autojs 进行商用。

### 编译相关：
环境要求:`jdk`版本17以上

命令说明：在项目根目录下运行命令，如果使用 Windows powerShell < 7.0，请使用包含 ";" 的命令

##### 本地安装调试版本到设备：
```shell
./gradlew app:buildDebugTemplateApp && ./gradlew app:assembleV6Debug && ./gradlew app:installV6Debug
#或
./gradlew app:buildDebugTemplateApp ; ./gradlew app:assembleV6Debug ; ./gradlew app:installV6Debug
```
生成的调试版本APK文件在 app/build/outputs/apk/v6/debug 下，使用默认签名

##### 本地编译发布版本：
```shell
./gradlew app:buildTemplateApp && ./gradlew inrt:cp2APP && ./gradlew app:assembleV6
#或
./gradlew app:buildTemplateApp ; ./gradlew inrt:cp2APP ; ./gradlew app:assembleV6
```
生成的是未签名的APK文件，在 app/build/outputs/apk/v6/release 下，需要签名后才能安装

##### 本地 Android Studio 运行调试版本到设备：
先运行以下命令：

```shell
./gradlew app:buildDebugTemplateApp
```

再点击 Android Studio 运行按钮

##### 本地 Android Studio 编译发布版本并签名：
先运行以下命令：

```shell
./gradlew app:buildTemplateApp
```

再点击 Android Studio 菜单 "Build" -> "Generate Signed Bundle /APK..." -> 勾选"APK" -> "Next" -> 选择或新建证书 -> "Next" -> 选择"v6Release" -> "Finish"
生成的APK文件，在 app/v6/release 下
