/* eslint-disable no-bitwise */
import React from "react";
import logo from "./logo.svg";
import "./App.css";

function noise(output: WebMidi.MIDIOutput) {
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; x += 1) {
      const red = ~~(Math.random() * 4);
      const green = ~~(Math.random() * 4);
      output.send([144, xy2i(x, y), color(red, green)]);
    }
  }
}

function xy2i(x: number, y: number) {
  return 16 * (y % 8) + x;
}

function color(red: number, green: number) {
  return 0b001100 + Math.min(Math.max(0, red), 3) + Math.min(Math.max(0, green), 3) * 8;
}

function onMidiAccessSuccess(access: WebMidi.MIDIAccess) {
  const { inputs } = access;
  const { outputs } = access;
  const output: WebMidi.MIDIOutput = outputs.values().next().value;
  const input: WebMidi.MIDIInput = inputs.values().next().value;

  if (!input || !output) return [];
  input.onmidimessage = createHandleMidiMessage(output);
  return [input, output];
}

function onMidiAccessFailure(error: Error) {
  console.log("Oops. Something were wrong with requestMIDIAccess", error);
}

function createHandleMidiMessage(output: WebMidi.MIDIOutput) {
  return function handleMidiMessage(e: WebMidi.MIDIMessageEvent) {
    // if (e.data[0] !== 0x90) return;
    console.log(e.data);

    // display data
    // var data = document.createElement("pre");
    // data.innerText = e.data;
    // document.querySelector("#output").append(data);
    // data.scrollIntoView();

    const buttonId = e.data[1];
    const release = e.data[2] === 0;
    if (!release) {
      return;
    }

    const red = ~~(Math.random() * 4);
    const green = ~~(Math.random() * 4);
    if (buttonId === 104) {
      for (let x = 0; x < 8; x += 1) {
        for (let y = 0; y < 8; x += 1) {
          output.send([144, xy2i(x, y), color(0, 0)]);
        }
      }
    } else {
      output.send([144, buttonId, color(red, green)]);
    }
  };
}

window.navigator.requestMIDIAccess().then(onMidiAccessSuccess, onMidiAccessFailure);

const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
    </header>
  </div>
);

export default App;
