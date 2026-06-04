# Quickstart & Verification Guide: Setup Extension Logo

This guide outlines the validation scenario to verify that the extension logo configuration is successfully updated.

## Prerequisites

- Chrome, Edge, or Brave browser.
- Git repository status clean.

## Verification Steps

### Step 1: Icon Extraction Verification

After executing the extraction tasks, verify that the following files exist and match their expected resolutions:

```bash
# Check that files were created
ls -la public/icons/

# Verify PNG dimensions
identify public/icons/icon16.png   # Expected: 16x16
identify public/icons/icon32.png   # Expected: 32x32
identify public/icons/icon48.png   # Expected: 48x48
identify public/icons/icon128.png  # Expected: 128x128
```

### Step 2: Codebase Cleanup Verification

Ensure the old `icons/` directory is deleted:

```bash
ls -d icons/
# Expected output: ls: cannot access 'icons/': No such file or directory
```

Ensure `manifest.json` correctly references the new paths:

```bash
cat manifest.json | grep -A 5 '"icons"'
```

Expected output:
```json
  "icons": {
    "16": "public/icons/icon16.png",
    "32": "public/icons/icon32.png",
    "48": "public/icons/icon48.png",
    "128": "public/icons/icon128.png"
  }
```

### Step 3: Browser Extension Load Verification

1. Open a Chromium-based browser (e.g. Chrome) and navigate to `chrome://extensions/`.
2. Enable "Developer mode" (top-right toggle).
3. Click "Load unpacked" and select the `site-markdown` repository root folder.
4. Verify:
   - No errors or warnings are shown during extension loading.
   - The extension logo is visible in the extensions list.
   - Pin the extension and verify that the logo shows up in the browser toolbar.
