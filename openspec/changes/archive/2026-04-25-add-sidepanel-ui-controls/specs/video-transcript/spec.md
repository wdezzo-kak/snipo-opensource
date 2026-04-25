## ADDED Requirements

### Requirement: YouTube transcript fetch
The extension SHALL fetch transcript data from YouTube pages when transcript is requested.

#### Scenario: YouTube page has transcript available
- **WHEN** transcript is requested on a YouTube video page with available transcript
- **THEN** transcript text data is returned with timestamps

#### Scenario: YouTube page has no transcript available
- **WHEN** transcript is requested on a YouTube video page without transcript
- **THEN** system returns empty transcript and logs unavailability

### Requirement: Coursera transcript fetch
The extension SHALL fetch transcript data from Coursera pages when transcript is requested.

#### Scenario: Coursera page has transcript available
- **WHEN** transcript is requested on a Coursera video page with available transcript
- **THEN** transcript text data is returned with timestamps

#### Scenario: Coursera page has no transcript available
- **WHEN** transcript is requested on a Coursera video page without transcript
- **THEN** system returns empty transcript and logs unavailability

### Requirement: Transcript overlay injection
The extension SHALL inject a transcript overlay on the video page when transcript is shown.

#### Scenario: Transcript overlay is injected
- **WHEN** transcript toggle is enabled
- **THEN** a floating transcript panel appears overlaid on the video area

#### Scenario: Transcript overlay is removed
- **WHEN** transcript toggle is disabled
- **THEN** the transcript overlay is removed from the video page