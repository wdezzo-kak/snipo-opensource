## ADDED Requirements

### Requirement: Extract Coursera course metadata
The adapter SHALL extract course title, ID, and progress from Coursera DOM.

#### Scenario: Extract course title
- **WHEN** on Coursera course page
- **THEN** adapter returns course title from DOM

#### Scenario: Extract course ID
- **WHEN** on Coursera course page
- **THEN** adapter returns course slug/ID from URL

#### Scenario: Extract module list
- **WHEN** on Coursera course page
- **THEN** adapter returns list of modules and lessons

### Requirement: Control Coursera video playback
The extension SHALL control video playback via video element API.

#### Scenario: Get current timestamp
- **WHEN** video is playing
- **THEN** adapter returns video.currentTime

#### Scenario: Pause video
- **WHEN** pause command invoked
- **THEN** video.pause() is called

#### Scenario: Seek video
- **WHEN** seek command invoked
- **THEN** video.currentTime is updated

#### Scenario: Set playback rate
- **WHEN** speed change command invoked
- **THEN** video.playbackRate is updated