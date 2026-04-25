## ADDED Requirements

### Requirement: Video frame capture
The extension SHALL capture the current video frame using the Canvas API.

#### Scenario: User captures screenshot while video is playing
- **WHEN** user clicks Screenshot button while video is playing
- **THEN** current video frame is drawn to a hidden canvas and exported as PNG data URL

#### Scenario: User captures screenshot while video is paused
- **WHEN** user clicks Screenshot button while video is paused
- **THEN** current paused frame is captured and exported as PNG data URL

### Requirement: Screenshot note creation
The extension SHALL create a note with the screenshot attached when screenshot is captured.

#### Scenario: Screenshot is added to notes
- **WHEN** screenshot is captured successfully
- **THEN** a new note is created with timestamp, content includes "📷" prefix and screenshot data URL, and current video timestamp

### Requirement: Screenshot message handling
The content script SHALL handle SCREENSHOT message type and return image data.

#### Scenario: Content script receives SCREENSHOT message
- **WHEN** content script receives message type "SCREENSHOT"
- **THEN** it captures video frame, returns base64 PNG data via sendResponse

### Requirement: Sidepanel receives screenshot data
The sidepanel SHALL receive screenshot data and display confirmation to user.

#### Scenario: Sidepanel receives screenshot response
- **WHEN** sidepanel receives screenshot data from content script
- **THEN** user sees brief confirmation that screenshot was captured