# 快速开始指南

## 🚀 最快速的开始方式

### 方式一: 使用 GitHub Actions (推荐)

1. **Fork 或 Clone 这个仓库到你的 GitHub 账户**

2. **推送任何更改到 main/master 分支:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **查看构建结果:**
   - 进入你的 GitHub 仓库
   - 点击 "Actions" 标签
   - 等待 "构建安卓应用" 工作流完成 (约 5-10 分钟)

4. **下载 APK:**
   - 点击完成的工作流运行
   - 滚动到底部找到 "Artifacts"
   - 下载 `course-manager-apk`
   - 解压得到 APK 文件

5. **安装到手机:**
   - 将 APK 传输到 Android 设备
   - 允许安装来自未知来源的应用
   - 点击安装

🎉 完成! 你的课程管理应用已经可以使用了!

### 方式二: 本地构建 (需要开发环境)

如果你想在本地构建,请查看 [ANDROID_BUILD.md](ANDROID_BUILD.md) 获取详细说明。

## 📝 基础使用

### 添加第一门课程

1. 打开应用
2. 点击 "➕ 添加课程"
3. 填写:
   - 课程名称: 如 "高等数学"
   - 教师: 如 "张老师"
   - 地点: 如 "教学楼 A101"
   - 星期: 选择上课日期
   - 开始时间: 如 08:00
   - 结束时间: 如 09:40
   - 颜色: 选择你喜欢的颜色
4. 点击 "保存"

### 添加作业

1. 点击 "📝 添加作业"
2. 填写:
   - 作业标题: 如 "数学作业第三章"
   - 相关课程: 如 "高等数学"
   - 截止日期: 选择日期
   - 优先级: 高/中/低
   - 状态: 待完成/进行中/已完成
3. 点击 "保存"

### 切换视图

- **日视图**: 查看今天的课程安排
- **周视图**: 查看本周的完整课程表
- **总览**: 查看所有课程和作业列表

### 导入/导出日历

- **导入**: 点击 "📥 导入ICS" 可以从其他日历应用导入
- **导出**: 点击 "📤 导出ICS" 可以分享给其他应用

## 🔄 更新应用

### 更新到新版本

1. 修改代码后推送到 GitHub
2. GitHub Actions 自动构建新版本
3. 下载新的 APK
4. 安装覆盖旧版本 (数据会保留)

### 发布正式版本

创建版本标签:
```bash
git tag v1.0.0
git push origin v1.0.0
```

APK 会自动发布到 GitHub Releases。

## 💾 数据备份

应用数据存储在本地,建议定期备份:

1. 点击 "📤 导出ICS"
2. 保存生成的 ICS 文件
3. 这个文件包含了所有课程和作业数据
4. 需要时可以重新导入

## 🎨 自定义

### 修改应用名称

编辑 `config.xml`:
```xml
<name>你的应用名称</name>
```

### 修改应用图标

查看 `res/icon/android/README.md` 了解如何添加自定义图标。

### 修改配色

编辑 `style.css` 中的颜色值:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## ❓ 常见问题

### 无法安装 APK?

在 Android 设置中:
1. 进入 "安全" 或 "应用管理"
2. 允许从 "未知来源" 安装应用
3. 对于 Android 8+, 需要允许具体浏览器/文件管理器安装

### 数据丢失了?

- 应用使用 LocalStorage 存储数据
- 如果清除了应用数据,数据会丢失
- 建议定期导出 ICS 备份

### GitHub Actions 构建失败?

常见原因:
1. `config.xml` 配置错误
2. `package.json` 依赖问题
3. 查看 Actions 日志获取详细错误信息

### 应用在某些设备上不工作?

检查:
1. Android 版本 (需要 Android 7.0+)
2. 查看设备日志: `adb logcat`
3. 在 GitHub Issues 报告问题

## 📱 兼容性

- **最低 Android 版本**: 7.0 (API 24)
- **推荐 Android 版本**: 10.0+ (API 29+)
- **屏幕支持**: 手机和平板
- **方向**: 支持横屏和竖屏

## 🛠 开发相关

### 修改代码

1. 编辑 `index.html`, `app.js`, 或 `style.css`
2. 测试网页版: 直接在浏览器打开 `index.html`
3. 推送到 GitHub 触发自动构建
4. 或本地构建: `npm run build:android:debug`

### 调试

在电脑上通过 Chrome 调试:
1. USB 连接设备并安装应用
2. 在 Chrome 打开 `chrome://inspect`
3. 选择你的应用开始调试

### 添加新功能

1. 修改代码
2. 在浏览器中测试
3. 本地构建 APK 测试
4. 推送到 GitHub
5. 从 Actions 下载正式构建

## 📚 更多资源

- [完整 README](README.md) - 详细功能说明
- [Android 构建指南](ANDROID_BUILD.md) - 深入构建说明
- [Cordova 文档](https://cordova.apache.org/docs/) - 官方文档

## 🆘 需要帮助?

- 提交 [GitHub Issue](../../issues)
- 查看现有的 Issues 和讨论
- 阅读详细文档

---

祝你使用愉快! 📚✨
