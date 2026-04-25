## ADDED Requirements

### Requirement: Extract YouTube video metadata
The adapter SHALL extract video ID, title, channel, and duration from YouTube.

#### Scenario: Extract video ID
- **WHEN** on YouTube watch page
- **THEN** adapter returns video ID from URL parameter

#### Scenario: Extract video title
- **WHEN** on YouTube watch page
- **THEN** adapter returns title from page title or player API

#### Scenario: Extract channel name
- **WHEN** on YouTube watch page
- **THEN** adapter returns channel name from metadata

#### Scenario: Extract duration
- **WHEN** on YouTube watch page
- **THEN** adapter returns video duration from player API

### Requirement: Control YouTube video playback
The extension SHALL control YouTube video via player API.

#### Scenario: Get current timestamp
- **WHEN** video is playing
- **THEN** adapter returns current time from player API

#### Scenario: Pause video
- **WHEN** pause command invoked
- **THEN** player.pauseVideo() is called

#### Scenario: Seek video
- **WHEN** seek command invoked
- **THEN** player.seekTo() is called

#### Scenario: Set playback rate
- **WHEN** speed change command invoked
- **THEN** player.setPlaybackRate() is called