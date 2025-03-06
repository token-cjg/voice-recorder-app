import React from 'react';
import './App.css';
import VoiceRecorder from './components/VoiceRecorder';
import RandomUsers from './components/RandomUsers';

function App() {
  return (
    <div className="App">
      <VoiceRecorder />
      <RandomUsers />
    </div>
  );
}

export default App;
