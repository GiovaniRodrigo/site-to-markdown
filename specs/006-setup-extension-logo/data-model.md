# Data Model & Configuration: Setup Extension Logo

## Configurations

This feature does not use any databases or persistent runtime storage tables. However, it updates the extension configuration assets.

### 1. File Configuration

| Asset Path | Format | Dimension | Description |
|------------|--------|-----------|-------------|
| `GF_Markdown_Extractor.ico` | ICO | Multi-frame (16 to 256) | Source multi-resolution icon |
| `public/icons/icon16.png` | PNG | 16x16 pixels | Extension small/favicon icon |
| `public/icons/icon32.png` | PNG | 32x32 pixels | Extension medium icon |
| `public/icons/icon48.png` | PNG | 48x48 pixels | Extensions management page icon |
| `public/icons/icon128.png` | PNG | 128x128 pixels | Chrome Web Store / Installation icon |

### 2. manifest.json "icons" Schema

The `manifest.json` file is modified to declare the new location of the icons:

```json
  "icons": {
    "16": "public/icons/icon16.png",
    "32": "public/icons/icon32.png",
    "48": "public/icons/icon48.png",
    "128": "public/icons/icon128.png"
  }
```
