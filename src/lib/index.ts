import * as Serial from "@buckwich/kle-serial";
import { QmkKeyboard } from "./qmk-keyboard.interface";

export function keyboard2kle(keyboardInfo: QmkKeyboard): object {
  console.log("Keybaord info");
  console.log(keyboardInfo);

  // console.log("Keybaord layouts json");
  // console.log(JSON.stringify(keyboardInfo.layouts));

  for (const [key, layout] of Object.entries(keyboardInfo.layouts)) {
    let qmkLayout = layout.layout;
    let kleLayout: any[] = [{ name: "test" }];
    // console.log("Keybaord layout");
    // console.log(qmkLayout);

    if (qmkLayout) {
      qmkLayout.forEach((key) => {
        let yOffset = 0;
        let xOffset = 0;
        yOffset++; // For Meta Row

        if (!kleLayout[key.y + yOffset]) {
          kleLayout[key.y + yOffset] = [];
        }
        if (key.w && key.w > 1) {
          kleLayout[key.y + yOffset][key.x + xOffset] = { w: key.w };
          kleLayout[key.y + yOffset][key.x + xOffset + 1] = "Blankdd";
          xOffset = xOffset + key.w - 2;
        } else {
          kleLayout[key.y + yOffset][key.x + xOffset] = "Blank";
        }
      });
      let test: any[][] = [];
      kleLayout.forEach((row) => {
        // console.log(row);

        if (Array.isArray(row)) {
          test.push(
            row.filter(function (el: any) {
              return el != null;
            })
          );
        } else {
          test.push(row);
        }
      });

      console.log("KLE keyboard serialised Input");
      console.log(JSON.stringify(kleLayout, null, 2));

      // console.log("KLE keyboard removed empty");
      // console.log(JSON.stringify(test, null, 2));

      // Test if parsable
      var keyboard = Serial.deserialize(test);
      // console.log("KLE keyboard deserialised");
      // console.log(keyboard);
      var testsesed = Serial.serialize(keyboard);
      console.log("KLE keyboard serialised Output");
      console.log(JSON.stringify(testsesed, null, 2));
    }
  }

  return keyboardInfo;
}
