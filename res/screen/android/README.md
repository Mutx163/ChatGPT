# 启动画面说明

请在此目录放置不同分辨率的启动画面图片:

## 横屏 (Landscape)
- `splash-land-ldpi.png` - 320x240 像素
- `splash-land-mdpi.png` - 480x320 像素
- `splash-land-hdpi.png` - 800x480 像素
- `splash-land-xhdpi.png` - 1280x720 像素
- `splash-land-xxhdpi.png` - 1600x960 像素
- `splash-land-xxxhdpi.png` - 1920x1280 像素

## 竖屏 (Portrait)
- `splash-port-ldpi.png` - 240x320 像素
- `splash-port-mdpi.png` - 320x480 像素
- `splash-port-hdpi.png` - 480x800 像素
- `splash-port-xhdpi.png` - 720x1280 像素
- `splash-port-xxhdpi.png` - 960x1600 像素
- `splash-port-xxxhdpi.png` - 1280x1920 像素

## 快速生成启动画面

使用 `cordova-res` 工具:
```bash
npm install -g cordova-res
cordova-res android --splash-source splash.png
```

## 临时方案

如果暂时没有启动画面,可以在 `config.xml` 中设置较短的启动画面显示时间或禁用启动画面。
