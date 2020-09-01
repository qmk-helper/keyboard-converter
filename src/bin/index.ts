import * as arg from "arg";
import * as fs from "fs";
import "reflect-metadata";
import { KeyboardConverter } from "../lib";

const args = arg({
  // Keyboard info.json file to be read
  "--keyboardFile": String,
  "--kbf": "--keyboardFile",

  // Stringified Keyboard info.json
  "--keyboardString": String,
  "--kbs": "--keyboardString",

  // keymap.json file to be read
  "--keymapFile": String,
  "--kmf": "--keymapFile",

  // Stringified keymap.json
  "--keymapString": String,
  "--kms": "--keymapString",

  // KLE Output File
  "--outputFile": String,
  "-o": "--outputFile",

  // Overwrite used layout
  "--layout": String
});

// Get Keyboard
let qmkKeyboardString: string;
if (args["--keyboardFile"] && args["--keyboardString"]) {
  console.error(
    "You have to either specify a keyboard info.json file (--keyboardFile) or a stringified JSON (--keyboardString)"
  );
  process.exit(1);
}
if (args["--keyboardFile"]) {
  qmkKeyboardString = fs.readFileSync(args["--keyboardFile"]).toString();
} else if (args["--keyboardString"]) {
  qmkKeyboardString = args["--keyboardString"];
} else {
  console.error(
    "You have to either specify a keyboard info.json file (--keyboardFile) or a stringified JSON (--keyboardString)"
  );
  process.exit(1);
}

// Get optional keymap
let qmkKeymapString: string | undefined;
if (args["--keymapFile"] && args["--keymapString"]) {
  console.error(
    "You have to either specify a keymap.json file or a stringified JSON"
  );
  process.exit(1);
}
if (args["--keymapFile"]) {
  qmkKeymapString = fs.readFileSync(args["--keymapFile"]).toString();
}
if (args["--keymapString"]) {
  qmkKeymapString = args["--keymapString"];
}

// Convert Strings to JSON
let qmkKeyboard: JSON = JSON.parse(qmkKeyboardString);
let keyboard = new KeyboardConverter();
keyboard.importQmkKeyboard(qmkKeyboard);

if (qmkKeymapString) {
  let qmkKeymap = JSON.parse(qmkKeymapString);
  keyboard.importQmkKeymap(qmkKeymap);
}

// Convert QMK keyboard & keymap to KLE keyboard
// let kleKeyboard: KleKeyboard = keyboard2kle(qmkKeyboard, qmkKeymap);

// let kleKeyboardSerialized = serialize(kleKeyboard);
let keyboardString = JSON.stringify(keyboard.exportKleKeyboard()).slice(1, -1);

// Output to file or console
if (args["--outputFile"]) {
  fs.writeFileSync(args["--outputFile"], keyboardString);
} else {
  console.log(keyboardString);
}
