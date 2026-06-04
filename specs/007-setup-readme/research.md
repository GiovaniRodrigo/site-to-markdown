# Research: Setup README

This document outlines design decisions, rationales, and alternatives considered for the bilingual `README.md` file.

## 1. Centering the Extension Logo

- **Decision**: Use a centered HTML container with a relative image path.
  ```html
  <p align="center">
    <img src="public/icons/icon128.png" width="128" height="128" alt="GF Code Logo">
  </p>
  ```
- **Rationale**: Markdown syntax doesn't support alignment, so a standard HTML `<p align="center">` tag is required. Using a relative path (`public/icons/icon128.png`) ensures that the logo renders correctly in local Markdown editors and on GitHub/GitLab.
- **Alternatives considered**:
  - Raw markdown `![Logo](public/icons/icon128.png)`: Rejected because it left-aligns the logo, which violates the spec requirement for centering.
  - Using an absolute URL: Rejected because the project runs entirely locally, and absolute URLs could break if the hosting origin changes.

## 2. Bilingual Section Navigation

- **Decision**: Implement a top-level language switcher using anchor links.
  ```markdown
  [English](#gf-code-site-to-markdown) | [Português](#gf-code-site-to-markdown-pt)
  ```
- **Rationale**: Keeps both versions within a single file while allowing readers to skip immediately to their language of choice.
- **Alternatives considered**:
  - Strict sequential reading (no links): Rejected because Portuguese readers would have to scroll past the entire English documentation to find their section, hurting user experience.
  - Multiple files (`README.md` and `README.pt.md`): Rejected because the spec explicitly requires a single root file containing both languages.

## 3. Directory Structure Presentation

- **Decision**: Use an ASCII tree representation within a code block.
- **Rationale**: An ASCII directory tree is standard for developer documentation and offers the most readable layout for nested files/directories.
- **Alternatives considered**:
  - Bulleted lists: Rejected because nesting is harder to read.

## 4. Project Principles & Constraints Summary

- **Decision**: Document all 5 Core Principles and the 3 Technical Constraints explicitly in both languages.
- **Rationale**: Clear alignment with the spec (FR-008). It helps developers understanding the core architecture requirements (Vanilla stack, client-side, local libraries).
