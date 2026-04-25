## ADDED Requirements

### Requirement: Register keyboard shortcuts
The extension SHALL register 9 keyboard shortcuts in manifest.json.

#### Scenario: Timestamp note shortcut
- **WHEN** user presses mod+shift+k
- **THEN** timestamp note action is triggered

#### Scenario: Screenshot shortcut
- **WHEN** user presses mod+shift+,
- **THEN** screenshot action is triggered

#### Scenario: Play/Pause shortcut
- **WHEN** user presses mod+shift+space
- **THEN** video play/pause is toggled

#### Scenario: Seek backward shortcut
- **WHEN** user presses mod+shift+8
- **THEN** video seeks back 5 seconds

#### Scenario: Seek forward shortcut
- **WHEN** user presses mod+shift+9
- **THEN** video seeks forward 5 seconds

#### Scenario: Increase speed shortcut
- **WHEN** user presses mod+shift+0
- **THEN** video speed increases

#### Scenario: Decrease speed shortcut
- **WHEN** user presses mod+shift+7
- **THEN** video speed decreases

#### Scenario: Toggle transcript shortcut
- **WHEN** user presses mod+shift+.
- **THEN** transcript panel is toggled

#### Scenario: Capture clip shortcut
- **WHEN** user presses mod+shift+y
- **THEN** video clip is captured