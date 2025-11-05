# Android应用构建指南

本文档详细说明如何构建和部署本项目的Android应用。

## 📋 前置要求

### 必需软件

1. **Node.js** (18.x 或更高版本)
   - 下载: https://nodejs.org/
   - 验证安装: `node --version`

2. **Java JDK** (17 或更高版本)
   - 下载: https://adoptium.net/
   - 配置环境变量 `JAVA_HOME`
   - 验证安装: `java -version`

3. **Android SDK**
   - 通过 Android Studio 安装: https://developer.android.com/studio
   - 或使用 Android 命令行工具
   - 配置环境变量:
     - `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`
     - 添加到 PATH: `$ANDROID_HOME/platform-tools` 和 `$ANDROID_HOME/cmdline-tools/latest/bin`

4. **Cordova CLI**
   ```bash
   npm install -g cordova
   ```

### 验证环境

运行以下命令验证环境配置:

```bash
cordova requirements android
```

## 🔨 本地构建步骤

### 1. 克隆仓库并安装依赖

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

### 2. 添加 Android 平台

```bash
cordova platform add android
```

### 3. 准备源文件

```bash
npm run prepare:www
```

这会将 `index.html`、`app.js` 和 `style.css` 复制到 `www/` 目录。

### 4. 构建 APK

**调试版本 (未签名):**
```bash
npm run build:android:debug
# 或
cordova build android --debug
```

**发布版本 (需要签名):**
```bash
npm run build:android
# 或
cordova build android --release
```

### 5. 安装到设备

通过 USB 连接 Android 设备,并确保已开启 USB 调试:

```bash
# 安装调试版
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk

# 或直接运行
cordova run android
```

## 📦 GitHub Actions 自动构建

本项目已配置 GitHub Actions,可以自动构建 APK。

### 触发构建

构建会在以下情况下自动触发:

1. **推送代码到特定分支:**
   ```bash
   git push origin main
   git push origin master
   git push origin cursor/your-branch
   ```

2. **创建版本标签:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **手动触发:**
   - 进入 GitHub 仓库的 Actions 页面
   - 选择 "构建安卓应用" 工作流
   - 点击 "Run workflow"

### 下载构建的 APK

1. 进入仓库的 **Actions** 标签页
2. 选择最新完成的工作流运行
3. 滚动到页面底部的 **Artifacts** 部分
4. 下载 `course-manager-apk` 压缩包
5. 解压得到 `course-manager-debug.apk`

### 从 Releases 下载

如果推送了版本标签,APK 会自动发布到 Releases:

1. 进入仓库的 **Releases** 页面
2. 选择对应的版本
3. 下载 `course-manager-debug.apk`

## 🔐 配置应用签名 (正式发布)

正式发布到应用商店需要签名的 APK。

### 1. 生成密钥库

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

按提示输入信息:
- 密钥库密码
- 您的名字和组织信息
- 密钥密码

⚠️ **重要**: 妥善保管密钥库文件和密码,丢失后无法更新应用!

### 2. 创建构建配置

在项目根目录创建 `build.json`:

```json
{
  "android": {
    "release": {
      "keystore": "./my-release-key.keystore",
      "storePassword": "your-keystore-password",
      "alias": "my-key-alias",
      "password": "your-key-password"
    }
  }
}
```

⚠️ **安全提示**: 不要将 `build.json` 提交到版本控制!

### 3. 构建签名的 APK

```bash
cordova build android --release
```

签名的 APK 位于:
```
platforms/android/app/build/outputs/apk/release/app-release.apk
```

### 4. 在 GitHub Actions 中配置签名

如果要在 GitHub Actions 中构建签名版本:

1. 将密钥库文件进行 base64 编码:
   ```bash
   base64 my-release-key.keystore > keystore.base64
   ```

2. 在 GitHub 仓库设置中添加 Secrets:
   - `KEYSTORE_FILE`: keystore.base64 的内容
   - `KEYSTORE_PASSWORD`: 密钥库密码
   - `KEY_ALIAS`: 密钥别名
   - `KEY_PASSWORD`: 密钥密码

3. 修改 `.github/workflows/build-android.yml`,添加签名步骤。

## 🎨 自定义应用

### 修改应用信息

编辑 `config.xml`:

```xml
<widget id="com.yourcompany.app" version="1.0.0">
    <name>你的应用名称</name>
    <description>
        你的应用描述
    </description>
    <author email="you@example.com" href="https://yourwebsite.com">
        你的名字
    </author>
</widget>
```

### 添加应用图标

1. 准备 1024x1024 的 PNG 图标
2. 安装 cordova-res:
   ```bash
   npm install -g cordova-res
   ```
3. 生成所有尺寸:
   ```bash
   cordova-res android --icon-source icon.png
   ```

### 添加启动画面

1. 准备 2732x2732 的 PNG 启动画面
2. 生成所有尺寸:
   ```bash
   cordova-res android --splash-source splash.png
   ```

### 修改应用颜色

在 `config.xml` 中修改:

```xml
<preference name="BackgroundColor" value="0xff667eea" />
```

## 🐛 常见问题

### 问题: `cordova: command not found`

**解决方案:**
```bash
npm install -g cordova
```

### 问题: ANDROID_HOME 未设置

**解决方案:**

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

添加到 `~/.bashrc` 或 `~/.zshrc` 使其永久生效。

**Windows:**
在系统环境变量中添加 `ANDROID_HOME`。

### 问题: Gradle 构建失败

**解决方案:**
1. 确保已安装正确版本的 Java JDK (17+)
2. 清理构建缓存:
   ```bash
   cordova clean android
   ```
3. 重新构建:
   ```bash
   cordova build android
   ```

### 问题: 无法安装 APK 到设备

**解决方案:**
1. 确保设备已开启 USB 调试
2. 检查设备连接:
   ```bash
   adb devices
   ```
3. 在设备上允许安装来自未知来源的应用
4. 手动安装:
   ```bash
   adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### 问题: GitHub Actions 构建失败

**解决方案:**
1. 查看 Actions 日志找出错误原因
2. 确保 `config.xml` 和 `package.json` 配置正确
3. 检查 Node.js 和 Java 版本是否匹配
4. 尝试在本地重现并解决问题

## 📱 测试应用

### 在模拟器上测试

1. 在 Android Studio 中创建模拟器
2. 启动模拟器
3. 运行:
   ```bash
   cordova run android --emulator
   ```

### 在真机上测试

1. 开启 USB 调试
2. 连接设备
3. 运行:
   ```bash
   cordova run android --device
   ```

### 调试

使用 Chrome DevTools 调试:

1. 在 Chrome 中打开 `chrome://inspect`
2. 运行应用
3. 点击 "inspect" 开始调试

## 📚 更多资源

- [Apache Cordova 官方文档](https://cordova.apache.org/docs/)
- [Android 开发者指南](https://developer.android.com/)
- [GitHub Actions 文档](https://docs.github.com/actions)

## 💡 提示

1. **首次构建较慢**: Gradle 需要下载依赖,首次构建可能需要 10-20 分钟
2. **保持工具更新**: 定期更新 Cordova、Android SDK 和相关工具
3. **测试多个设备**: 在不同 Android 版本和屏幕尺寸上测试
4. **性能优化**: 对于 WebView 应用,注意优化 JavaScript 性能
5. **备份密钥**: 务必备份应用签名密钥,丢失后无法更新应用

---

如有问题,请在 GitHub Issues 中提问。
