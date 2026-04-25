## ADDED Requirements

### Requirement: Create timestamped note
The system SHALL allow users to create notes associated with the current video timestamp.

#### Scenario: Add note via shortcut
- **WHEN** user presses mod+shift+k
- **THEN** new note is created with current timestamp

#### Scenario: Note contains timestamp link
- **WHEN** note is created
- **THEN** note body contains `[MM:SS](URL?t=SS)` format

#### Scenario: Note saved to storage
- **WHEN** note is created
- **THEN** note is saved to chrome.storage.local

### Requirement: Generate Markdown output
The system SHALL generate Markdown files matching original Snipo format.

#### Scenario: Markdown file created
- **WHEN** user triggers export
- **THEN** .md file is generated in correct folder hierarchy

#### Scenario: Frontmatter format
- **WHEN** exporting note
- **THEN** frontmatter uses key: value format (not YAML)

#### Scenario: Timestamp link format
- **WHEN** exporting note
- **THEN** timestamp links use `[MM:SS](URL&t=SS)` format

### Requirement: Display notes in side panel
The system SHALL display notes in the extension side panel UI.

#### Scenario: Notes visible
- **WHEN** side panel is open
- **THEN** all notes for current video are displayed