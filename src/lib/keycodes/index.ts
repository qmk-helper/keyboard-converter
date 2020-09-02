import { alphaKeys } from "./alpha-capital";
import { defaultKeys } from "./default";
import { functionKeys } from "./function-keys";
import { internationalKeys } from "./international";
import { longFormKeycodes } from "./long-names";
import { modifierKeys } from "./modifier";
import { numberKeys } from "./number";
import { numpadKeys } from "./numpad";
import { otherKeys } from "./other";
import { symbolKeys } from "./symbols";

export type LabelList = { [key: string]: Label };

export class Labels {
  labels: LabelList = {
    ...this.applyStyle(alphaKeys, { backgroundColor: "#ffffff" }),
    ...this.applyStyle(defaultKeys, { backgroundColor: "#eeeeee" }),
    ...this.applyStyle(functionKeys, { backgroundColor: "#eeeeff" }),
    ...this.applyStyle(internationalKeys, { backgroundColor: "#fffae6" }),
    ...this.applyStyle(modifierKeys, { backgroundColor: "#e6ffed" }),
    ...this.applyStyle(numberKeys, { backgroundColor: "#ffeeff" }),

    // ...this.applyStyle(otherNormalKeys, { backgroundColor: "#eedddd" }), // light red
    ...this.applyStyle(numpadKeys, { backgroundColor: "#ccaaaa" }),
    ...this.applyStyle(otherKeys, { backgroundColor: "#ffeeee" }),
    ...this.applyStyle(symbolKeys, { backgroundColor: "#444466" })
  };
  style = {
    undefined: { backgroundColor: "#cc9999", textColor: "#ff0000" }
  };
  constructor() {
    for (let key in longFormKeycodes) {
      this.labels[key] = this.labels[longFormKeycodes[key]];
    }
  }
  getLabel(qmkKeyCode: string): Label {
    let label = this.labels[qmkKeyCode];
    if (label) {
      label.code = qmkKeyCode;
      return label;
    } else {
      return new Label(qmkKeyCode, qmkKeyCode, this.style.undefined);
    }
  }
  private applyStyle(labels: LabelList, style: IStyle): LabelList {
    for (const key in labels) {
      if (!labels[key].style) {
        labels[key].style = style;
      }
    }
    return labels;
  }
}
export class Label {
  l: string = ""; // default label
  L?: string; // secondary Label (eg. shifted)
  i?: string; //icon
  d?: string; // description (hover)
  code?: string; // QMK key code
  style?: IStyle;

  constructor(l: string, code?: string, style?: IStyle) {
    this.l = l;
    this.code = code;
    this.style = style;
  }
}
export interface IStyle {
  textSize?: number;
  textColor?: string;
  backgroundColor?: string;
}
