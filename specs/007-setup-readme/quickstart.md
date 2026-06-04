# Quickstart: Validation Scenarios for README.md

This guide documents validation scenarios to verify that the bilingual `README.md` file is complete, correctly formatted, and has zero broken references.

## Prerequisites

- Node.js installed.
- Standard Markdown viewer (such as VS Code Markdown preview, or GitHub preview).

---

## Scenario 1: File Existence Verification

Verify that the `README.md` file exists in the repository root.

**Execution**:
```bash
ls -la README.md
```
**Expected Outcome**:
The file `README.md` is present at the repository root and is non-empty.

---

## Scenario 2: Link and Asset Validation

Verify that all relative file links and images in `README.md` resolve correctly.

**Execution**:
- Check for the existence of `public/icons/icon128.png`.
- Check for the existence of `docs/crawler.md`.
- Check for the existence of `docs/extractors.md`.

You can also run a quick check for markdown link validity:
```bash
# Check if links inside README.md exist in the workspace
grep -o '\]([^)]*)' README.md | grep -o '([^)]*)' | tr -d '()' | while read -r link; do
  # Ignore external HTTP links and anchor targets starting with #
  if [[ ! "$link" =~ ^http ]] && [[ ! "$link" =~ ^# ]]; then
    if [ ! -f "$link" ] && [ ! -d "$link" ]; then
      echo "Broken Link: $link"
      exit 1
    fi
  fi
done
echo "All relative links are valid!"
```

**Expected Outcome**:
Zero broken links are found; output displays "All relative links are valid!".

---

## Scenario 3: Language Switching Anchor Validation

Verify that the language switcher links correctly jump to the respective sections.

**Execution**:
- Open `README.md` in a Markdown viewer.
- Click the `Português` switcher link at the top. It should navigate to the `#gf-code-site-to-markdown-pt` header.
- Click the `English` switcher link at the Portuguese section. It should navigate back to the `#gf-code-site-to-markdown` header.

**Expected Outcome**:
Anchor navigation works seamlessly inside the Markdown viewer.
