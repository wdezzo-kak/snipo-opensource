## ADDED Requirements

### Requirement: Extension scaffolding provides MV3 Chrome extension project structure
The extension SHALL be built with Vite + Vue 3 + TypeScript using vite-plugin-mv3 for bundling.

#### Scenario: Project builds successfully
- **WHEN** developer runs `npm run build`
- **THEN** extension artifacts are generated in `dist/` directory

#### Scenario: Extension loads in Chrome
- **WHEN** developer loads unpacked extension in `chrome://extensions`
- **THEN** extension icon appears in toolbar without errors

### Requirement: Manifest V3 configuration
The extension SHALL have a valid manifest.json with proper permissions and host access.

#### Scenario: Host permissions are minimal
- **WHEN** examining manifest.json
- **THEN** host_permissions contains only `https://*.coursera.org/*` and `https://*.youtube.com/*`

#### Scenario: Side panel is configured
- **WHEN** examining manifest.json
- **THEN** side_panel.default_path points to sidepanel.html

#### Scenario: Commands are registered
- **WHEN** examining manifest.json
- **THEN** commands contains all 9 shortcuts with descriptions