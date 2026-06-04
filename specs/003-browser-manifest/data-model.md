# Data Model: Browser Extension Manifest Configuration

This document specifies the validation schema, entity fields, and structure for the `manifest.json` configuration file.

## 1. Extension Manifest Schema

The manifest is represented by the root `manifest.json` entity file.

### Fields and Schema Definition

| Field Name | Type | Constraints / Validation Rules | Purpose |
|:---|:---|:---|:---|
| `manifest_version` | Integer | MUST equal `3`. | Specifies the extensions system version. |
| `name` | String | MUST equal `Minha Extensão`. | Display name in browser toolbar and extension listing. |
| `version` | String | MUST follow semantic versioning layout (`x.y.z`). Default: `1.0.0`. | Release version tracking. |
| `description` | String | Non-empty string. Default: `Exemplo básico de extensão MV3`. | Explains the extension functionality to users. |
| `permissions` | Array[String] | MUST contain exactly `["storage", "activeTab", "scripting"]`. | Declares the required Chrome Extension runtime APIs. |
| `host_permissions` | Array[String] | MUST contain exactly `["<all_urls>"]`. | Allows scripting/injection on any active webpage. |
| `background` | Object | MUST contain `service_worker` key pointing to `background.js`. | Registers the non-persistent background script. |
| `action` | Object | MUST contain `default_popup` (`popup/popup.html`) and `default_title` (`Minha Extensão`). | Configures the toolbar icon click handler popup. |
| `content_scripts`| Array[Object] | Matches MUST contain `["<all_urls>"]` and JS MUST reference `content.js`. | Declares page-level scripts injected on page loads. |
| `icons` | Object | MUST map resolutions `"16"`, `"48"`, and `"128"` to their respective PNG paths. | Defines extension graphics assets. |

## 2. Resource Stub Bindings

The manifest references local file paths. These files act as related logical entities that the browser links on startup:

- **Background Worker (`background.js`)**: Executed on browser events.
- **Content Script (`content.js`)**: Executed inside the tab's DOM context.
- **Popup UI (`popup/popup.html`)**: Rendered when clicking the action icon.
- **Graphic Assets (`icons/icon*.png`)**: Rendered in the browser toolbar, extension menus, and permissions prompt.
