/* eslint-disable no-bitwise */
import React, { useEffect, useState } from "react";
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

interface MidiDevice {
  output: WebMidi.MIDIOutput;
  input: WebMidi.MIDIInput;
}

function handleMidiMessage(output: WebMidi.MIDIOutput, e: WebMidi.MIDIMessageEvent) {
  if (!output) {
    return;
  }
  // if (e.data[0] !== 0x90) return;
  const buttonId = e.data[1];
  // console.log(e.data);
  const press = e.data[2] === 127;
  // const release = e.data[2] === 0;

  if (!press) {
    return;
  }

  const red = ~~(Math.random() * 4);
  const green = ~~(Math.random() * 4);
  try {
    if (buttonId === 104) {
      for (let x = 0; x < 8; x += 1) {
        for (let y = 0; y < 8; x += 1) {
          output.send([144, xy2i(x, y), color(0, 0)]);
        }
      }
    } else {
      output.send([144, buttonId, color(red, green)]);
    }
  } catch {
    //
  }
}

function App() {
  const [midi, setMidi] = useState<MidiDevice | null>(null);
  useEffect(() => {
    if (!midi) {
      window.navigator.requestMIDIAccess().then(
        ({ inputs, outputs }) => {
          const midiOut: WebMidi.MIDIOutput = outputs.values().next().value;
          const midiIn: WebMidi.MIDIInput = inputs.values().next().value;
          if (!midiIn || !midiOut) return;
          midiIn.onmidimessage = (e) => handleMidiMessage(midiOut, e);
          setMidi({ input: midiIn, output: midiOut });
        },
        (err) => {
          console.log("Oops. Something were wrong with requestMIDIAccess", err);
        }
      );
    }
    return () => {
      if (midi) {
        midi.input.close();
        midi.output.close();
      }
    };
  }, [midi]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
