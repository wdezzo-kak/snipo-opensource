## ADDED Requirements

### Requirement: Platform detection via URL matching
The extension SHALL detect which platform the user is visiting via URL pattern matching in content scripts.

#### Scenario: Coursera page detected
- **WHEN** user navigates to `coursera.org/*`
- **THEN** Coursera adapter is loaded and activated

#### Scenario: YouTube page detected
- **WHEN** user navigates to `youtube.com/*`
- **THEN** YouTube adapter is loaded and activated

#### Scenario: Unsupported page
- **WHEN** user navigates to unrelated site
- **THEN** extension remains dormant (no adapter loaded)

### Requirement: DOM-based metadata extraction
The extension SHALL extract platform data via DOM APIs, NOT React internal state.

#### Scenario: Extract metadata from DOM
- **WHEN** platform is detected
- **THEN** adapter queries DOM elements for title, video, transcript

#### Scenario: Fallback selectors
- **WHEN** primary selector fails
- **THEN** adapter attempts fallback selectors (data-testid, class, aria)