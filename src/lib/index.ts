import { stringify } from "@buckwich/kle-serial";
import { Key, Keyboard } from "@buckwich/kle-serial/dist/interfaces";
import { QmkKeyboard } from "./qmk-keyboard.interface";

export function keyboard2kle(qmkKeyboard: QmkKeyboard): object {
  console.log("Keybaord info");
  console.log(qmkKeyboard);

  // console.log("Keybaord layouts json");
  // console.log(JSON.stringify(keyboardInfo.layouts));

  for (const [key, layout] of Object.entries(qmkKeyboard.layouts)) {
    let qmkLayout = layout.layout;
    if (!qmkLayout) {
      throw new Error("This keyboard contains no layouts");
    }

    let kleKeyboard = new Keyboard();
    kleKeyboard.meta.name = `${qmkKeyboard.keyboard_name}-${key}`;
    qmkLayout.forEach((qmkKey) => {
      // console.log(qmkKey);
      let kleKey = new Key();
      kleKey.x = qmkKey.x;
      kleKey.y = qmkKey.y;
      kleKey.width = qmkKey.w || 1;
      kleKey.width2 = qmkKey.w || 1;
      kleKey.labels = [qmkKey.label || ""];
      kleKeyboard.keys.push(kleKey);
    });
    console.log("WHAT");
    console.log(stringify(kleKeyboard));
  }

  return qmkKeyboard;
}
