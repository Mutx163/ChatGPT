# 大学课程表与作业管理系统

一个功能完整的课程表与作业管理工具，专为大学生设计。支持网页版和安卓应用。

## ✨ 主要功能

### 📅 多视图显示
- **日视图**：查看当天的详细课程安排
- **周视图**：一周7天的课程总览
- **总览**：完整的课程列表和作业清单

### 📚 课程管理
- 添加、编辑、删除课程
- 设置课程名称、教师、地点、时间
- 自定义课程颜色
- 添加课程备注

### 📝 作业管理
- 添加、编辑、删除作业
- 设置截止日期和时间
- 优先级标记（高/中/低）
- 状态跟踪（待完成/进行中/已完成）

### 📥📤 导入导出
- 支持导入 ICS 格式日历文件
- 导出课程表和作业为 ICS 文件
- 与其他日历应用兼容

### 💾 数据持久化
- 使用 LocalStorage 自动保存数据
- 刷新页面不丢失信息

## 🚀 快速开始

### 网页版使用

1. 在浏览器中打开 `index.html` 文件
2. 开始使用！无需任何安装或配置

### 安卓应用使用

#### 方式一：从GitHub Actions下载APK

1. 进入仓库的 Actions 标签页
2. 选择最新的成功构建
3. 下载 `course-manager-apk` 构建产物
4. 将APK安装到安卓设备

#### 方式二：本地构建

**前置要求:**
- Node.js 18+ 
- Java JDK 17+
- Android SDK (通过Android Studio安装)

**构建步骤:**

1. 安装依赖:
```bash
npm install -g cordova
npm install
```

2. 添加Android平台:
```bash
cordova platform add android
```

3. 构建调试版APK:
```bash
npm run build:android:debug
```

4. APK文件位置:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

5. 安装到设备:
```bash
# 通过USB连接设备,确保已开启USB调试
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 添加课程

1. 点击顶部"➕ 添加课程"按钮
2. 填写课程信息（课程名称、教师、地点、时间等）
3. 选择课程颜色
4. 点击"保存"

### 添加作业

1. 点击顶部"📝 添加作业"按钮
2. 填写作业信息（标题、相关课程、截止日期等）
3. 设置优先级和状态
4. 点击"保存"

### 导入日历

1. 点击"📥 导入ICS"按钮
2. 选择 ICS 格式的日历文件
3. 系统会自动解析并导入课程和事件

### 导出日历

1. 点击"📤 导出ICS"按钮
2. 系统会生成包含所有课程和作业的 ICS 文件
3. 可导入到其他日历应用（如 Google 日历、Outlook 等）

## 🎨 界面特点

- 🌈 渐变色设计，现代美观
- 📱 响应式布局，支持移动设备
- 🎯 直观的操作界面
- ⚡ 流畅的交互体验

## 🛠 技术栈

- **HTML5**：页面结构
- **CSS3**：样式和动画
- **JavaScript (ES6)**：核心功能逻辑
- **LocalStorage**：数据持久化
- **Apache Cordova**：安卓应用打包
- **GitHub Actions**：自动化构建和部署

## 📝 文件结构

```
/workspace/
├── index.html                      # 主页面
├── style.css                       # 样式文件
├── app.js                          # JavaScript 逻辑
├── config.xml                      # Cordova配置文件
├── package.json                    # 项目依赖配置
├── README.md                       # 项目说明
├── .github/
│   └── workflows/
│       └── build-android.yml       # GitHub Actions构建流程
├── www/                            # Cordova打包源文件目录
│   ├── index.html
│   ├── style.css
│   └── app.js
└── res/                            # 应用资源文件
    ├── icon/                       # 应用图标
    └── screen/                     # 启动画面
```

## 🌟 功能亮点

1. **完全离线使用**：无需服务器，打开即用
2. **数据安全**：所有数据存储在本地
3. **跨平台兼容**：支持网页和安卓应用
4. **标准格式支持**：ICS 格式可与主流日历应用互通
5. **自动化构建**：GitHub Actions自动打包APK

## 📋 使用建议

1. 定期导出数据作为备份
2. 使用不同颜色区分不同类型的课程
3. 及时更新作业状态，便于跟踪进度
4. 充分利用备注功能记录重要信息

## 🔮 未来计划

- [x] 安卓应用打包
- [x] GitHub Actions自动构建
- [ ] iOS应用支持
- [ ] 添加提醒功能
- [ ] 支持课程搜索和筛选
- [ ] 添加统计分析功能
- [ ] 支持多学期管理
- [ ] 云端同步功能

## 📦 GitHub Actions自动打包

本项目已配置GitHub Actions工作流,可以自动构建安卓APK:

### 触发条件

- 推送代码到 `main`、`master` 或 `cursor/**` 分支
- 创建新的版本标签 (如 `v1.0.0`)
- 手动触发工作流

### 获取构建的APK

1. 进入仓库的 **Actions** 标签页
2. 选择最新的 "构建安卓应用" 工作流运行
3. 在 **Artifacts** 部分下载 `course-manager-apk`
4. 解压后即可获得APK文件

### 发布新版本

创建并推送版本标签即可自动发布:

```bash
git tag v1.0.0
git push origin v1.0.0
```

APK将自动上传到GitHub Releases页面。

## 🔧 自定义配置

### 修改应用信息

编辑 `config.xml` 文件可以修改:
- 应用ID (`widget id`)
- 应用名称 (`<name>`)
- 应用描述 (`<description>`)
- 版本号 (`version`)
- 作者信息 (`<author>`)

### 添加应用图标和启动画面

1. 准备高分辨率图标 (建议 1024x1024)
2. 准备启动画面图片 (建议 2732x2732)
3. 使用工具生成各种尺寸:
   ```bash
   npm install -g cordova-res
   cordova-res android --icon-source icon.png --splash-source splash.png
   ```
4. 或者手动放置到 `res/icon/android/` 和 `res/screen/android/` 目录

### 配置签名 (发布版本)

要构建已签名的发布版APK:

1. 生成密钥库:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. 创建 `build.json`:
```json
{
  "android": {
    "release": {
      "keystore": "my-release-key.keystore",
      "storePassword": "your-password",
      "alias": "my-key-alias",
      "password": "your-password"
    }
  }
}
```

3. 构建发布版:
```bash
cordova build android --release
```

## 📄 许可证

本项目为开源项目，可自由使用和修改。

---

祝你学业进步！📚✨