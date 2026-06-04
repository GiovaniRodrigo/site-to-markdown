# Research: Setup Extension Logo

## Decision: Use ImageMagick (`convert`) to extract PNG icons

### Rationale:
- ImageMagick is already installed (`/usr/bin/convert` is available).
- The `identify` command shows that `GF_Markdown_Extractor.ico` has high-quality pre-rendered PNG layers at the exact required resolutions (16x16, 32x32, 48x48, 128x128).
- Extracting specific frames by index (e.g., `convert GF_Markdown_Extractor.ico[0] public/icons/icon16.png`) avoids resizing artifacts and is a single-command operation.

### Alternatives considered:
- **Python script with PIL**:
  - We could write a Python script to open the `.ico` file and iterate through its frames using `img.seek(frame)`.
  - While PIL is installed and this is a viable fallback, it is more complex than a simple one-liner shell command using ImageMagick.
- **Manual extraction / Resizing of ChatGPT PNGs**:
  - Resizing the ChatGPT PNG images using an editor or python script.
  - Rejected because the ICO file contains the exact icon assets already optimized for standard sizes, and using them preserves the developer's chosen logo design.
