# 更新日志

## [未发布] - 2025-11-05

### 新增
- ✅ 添加 Apache Cordova 支持，可构建安卓应用
- ✅ 配置 GitHub Actions 自动构建工作流
- ✅ 添加 `package.json` 和 `package-lock.json`
- ✅ 创建 `www/` 目录用于 Cordova 构建
- ✅ 添加完整的构建文档（README.md, ANDROID_BUILD.md, QUICK_START.md）

### 修复
- ✅ 修复 GitHub Actions 缓存错误（添加 package-lock.json）
- ✅ 移除过时的 `<splash>` 标签（Cordova Android 12+ 不再支持）
- ✅ 注释掉不存在的图标资源引用（使用默认图标）
- ✅ 移除过时的 `cordova-plugin-splashscreen` 插件
- ✅ 清理不再支持的启动画面相关配置

### 变更
- 📝 更新 README.md，添加安卓应用使用说明
- 📝 创建 ANDROID_BUILD.md，提供详细构建指南
- 📝 创建 QUICK_START.md，提供快速开始指南
- 🔧 简化 config.xml 配置，移除不必要的复杂性

### 技术细节

#### 移除的配置
- `<splash>` 标签（12个）- Android 12+ 已弃用
- `cordova-plugin-splashscreen` - 不再需要
- 启动画面相关的 5 个 preference 配置

#### 当前配置
- **平台**: Android 12.0.1
- **最低 SDK**: Android 7.0 (API 24)
- **目标 SDK**: Android 13 (API 33)
- **插件**: 
  - cordova-plugin-whitelist (^1.3.5)
  - cordova-plugin-file (^8.0.0)

#### GitHub Actions
- **触发条件**: push 到 main/master/cursor/** 分支，创建 tag，或手动触发
- **构建环境**: Ubuntu Latest, Node.js 18, Java 17
- **输出**: 调试版 APK (course-manager-debug.apk)
- **存储**: Actions Artifacts (30天) + GitHub Releases (tag触发时)

### 下一步
- [ ] 添加自定义应用图标
- [ ] 添加应用签名配置（发布版本）
- [ ] 优化应用性能
- [ ] 添加应用权限说明

---

## 如何使用

### 快速开始
```bash
# 1. 推送代码触发自动构建
git push origin your-branch

# 2. 或本地构建
npm install
npm run build:android:debug
```

### 获取 APK
- **从 GitHub Actions**: Actions → 最新构建 → 下载 Artifacts
- **从 Releases**: 推送 tag 后自动发布

查看 [QUICK_START.md](QUICK_START.md) 了解更多。
