/* eslint-disable no-console */
/* eslint-disable no-bitwise */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Launchpad from "./Launchpad";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center"
  }
});

// function noise(output: WebMidi.MIDIOutput) {
//   for (let x = 0; x < 8; x += 1) {
//     for (let y = 0; y < 8; x += 1) {
//       const red = ~~(Math.random() * 4);
//       const green = ~~(Math.random() * 4);
//       output.send([144, rcToI(x, y), color(red, green)]);
//     }
//   }
// }

function rcToI(r: number, c: number) {
  if (c < 4) {
    return (7 - r) * 4 + c + 36;
  }
  return (7 - r) * 4 + c + 64;
}

function color(red: number, green: number) {
  return 0b001100 + Math.min(Math.max(0, red), 3) + Math.min(Math.max(0, green), 3) * 8;
}

function randomColor() {
  const red = ~~(Math.random() * 4);
  const green = ~~(Math.random() * 4);
  return color(red, green);
}
interface MidiDevice {
  output: WebMidi.MIDIOutput;
  input: WebMidi.MIDIInput;
}

function sendColor(output: WebMidi.MIDIOutput, buttonId: number, c: number) {
  try {
    output.send([144, buttonId, c]);
  } catch {
    //
  }
}

function handleMidiMessage(output: WebMidi.MIDIOutput, e: WebMidi.MIDIMessageEvent) {
  if (output === null) {
    return;
  }
  const buttonId = e.data[1];
  const press = e.data[2] === 127;
  if (press) {
    console.log("button id = ", buttonId);
    buttonClick(output, buttonId);
  }
}

function buttonClick(output: WebMidi.MIDIOutput, buttonId: number) {
  if (buttonId === 104) {
    clearAll(output);
  } else {
    output.send([144, buttonId, randomColor()]);
  }
}

function clearAll(output: WebMidi.MIDIOutput) {
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; y += 1) {
      try {
        sendColor(output, rcToI(x, y), color(0, 0));
      } catch {
        //
      }
    }
  }
}

function App() {
  const { root } = useStyles();
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
    <div className={root}>
      <Launchpad
        click={(r, c) => {
          if (midi) {
            buttonClick(midi.output, rcToI(r, c))
          }
        }}
      />
    </div>
  );
}

export default App;
