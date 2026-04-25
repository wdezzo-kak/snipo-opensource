## ADDED Requirements

### Requirement: Sidepanel play/pause control
The sidepanel SHALL provide a Play/Pause button that toggles video playback when clicked.

#### Scenario: User clicks play button when video is paused
- **WHEN** user clicks Play button in sidepanel and video is paused
- **THEN** video playback starts and button icon changes to Pause icon

#### Scenario: User clicks pause button when video is playing
- **WHEN** user clicks Pause button in sidepanel and video is playing
- **THEN** video playback pauses and button icon changes to Play icon

### Requirement: Sidepanel transcript toggle
The sidepanel SHALL provide a Transcript button that toggles transcript visibility when clicked.

#### Scenario: User clicks transcript button to show transcript
- **WHEN** user clicks Transcript button and transcript is hidden
- **THEN** transcript overlay appears on the video page

#### Scenario: User clicks transcript button to hide transcript
- **WHEN** user clicks Transcript button and transcript is visible
- **THEN** transcript overlay is removed from the video page

### Requirement: Sidepanel screenshot capture
The sidepanel SHALL provide a Screenshot button that captures the current video frame when clicked.

#### Scenario: User clicks screenshot button
- **WHEN** user clicks Screenshot button
- **THEN** current video frame is captured and added as a note with screenshot attached

### Requirement: Sidepanel video state sync
The sidepanel SHALL display the current video play state and sync when changed externally.

#### Scenario: Video state changes externally (keyboard shortcut)
- **WHEN** video play state changes via keyboard shortcut while sidepanel is open
- **THEN** sidepanel button icon updates to reflect new state within 1 second

#### Scenario: Video state changes via page controls
- **WHEN** video play state changes via clicking video directly while sidepanel is open
- **THEN** sidepanel button icon updates to reflect new state within 1 second