# Voice Recorder App

## Overview

This is a simple React web application that allows users to record their voice, pause and stop the recording, and convert the audio to text. The app demonstrates core concepts of React including the use of Hooks for state management and integration with third-party APIs. Additionally, a bonus feature supports offline voice recording by automatically converting the audio once connectivity is restored.

## Features

- **Voice Recording:**  
  Record your voice using the Record button.
- **Pause & Resume:**  
  Pause the recording mid-session and resume later.
- **Stop Recording:**  
  Stop the recording to finalize and process the audio.
- **Voice-to-Text Conversion:**  
  Convert the recorded audio into text using the AssemblyAI API.
- **Offline Support:**  
  Record your voice while offline and automatically convert it when the connection is restored.
- **Modern UI:**  
  A clean and user-friendly interface styled with CSS.
- **Unit Testing:**  
  Tests using Jest and React Testing Library.
- **CI/CD Pipeline:**  
  Automatic testing through a CI/CD pipeline.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed on your machine.
- An AssemblyAI API key. You can get one from [AssemblyAI](https://www.assemblyai.com/).

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/token-cjg/voice-recorder-app.git
   cd voice-recorder-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a .env file in the root directory and add your AssemblyAI API key:
   ```bash
   REACT_APP_ASSEMBLYAI_API_KEY=your_api_key_here
   ```

### Running the Application
   Start the development server:
   ```bash
   npm start
   ```

Your application will run on http://localhost:3000.

## Usage

- **Record:**
  Click the Record button to start capturing audio.
- **Pause:**
  Use the Pause button to temporarily stop the recording.
- **Resume:**
  If paused, click Resume to continue recording.
- **Stop:**
  Click the Stop button to finish the recording. The app will then convert your audio into text.
- **Offline Mode:**
  When offline, the recording is stored locally and automatically processed when connectivity is restored.

## Testing

Run the unit tests using:
   ```bash
   npm test
   ```

## CI/CD Pipeline

A CI/CD pipeline can be set up (e.g., with GitHub Actions) to run tests automatically on every push or pull request.

## Technologies Used

- **React:** For building the user interface.
- **React Hooks:** For managing component state and side effects.
- **Web Audio API:** For recording audio in the browser.
- **AssemblyAI API:** For converting voice recordings to text.
- **CSS:** For styling the application.
- **Jest & React Testing Library:** For unit testing.

## Demo

Demonstrates
- Basic recording functionality
- Recording another thing afterwards functionality
- The little recording that could when disconnected from the web

Now with bonus time loop!

https://github.com/user-attachments/assets/3c59a0fb-df7e-4398-94bd-1a89f57396dd

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or feedback, please feel free to file an issue with any suggested improvements. Or even submit a PR, see CONTRIBUTING.md for further particulars if you wish to do so.


---

Feel free to modify the content to match your project details and add any additional sections as needed.
