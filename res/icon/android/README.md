# 应用图标说明

请在此目录放置不同分辨率的应用图标:

- `ldpi.png` - 36x36 像素
- `mdpi.png` - 48x48 像素
- `hdpi.png` - 72x72 像素
- `xhdpi.png` - 96x96 像素
- `xxhdpi.png` - 144x144 像素
- `xxxhdpi.png` - 192x192 像素

## 快速生成图标

你可以使用在线工具生成不同尺寸的图标:
- https://icon.kitchen/
- https://www.appicon.co/

或者使用命令行工具如 `cordova-res`:
```bash
npm install -g cordova-res
cordova-res android --icon-source icon.png
```

## 临时方案

如果暂时没有图标,Cordova会使用默认图标。建议尽快添加自定义图标以提升应用品质。
