import { alphaKeys } from "./alpha-capital";
import { functionKeys } from "./function-keys";
import { longFormKeycodes } from "./long-names";
import { modifierKeys } from "./modifier";
import { numberKeys } from "./number";
import { numpadKeys } from "./numpad";
import { otherKeys } from "./other";
import { otherNormalKeys } from "./other-normal-keys";

export type LabelList = { [key: string]: Label };

export class Labels {
  labels: LabelList = {
    ...this.applyStyle(alphaKeys, { backgroundColor: "#aaaabb" }), //light blue
    ...this.applyStyle(numberKeys, { backgroundColor: "#aabbaa" }), // light green
    ...this.applyStyle(otherNormalKeys, { backgroundColor: "#bbaaaa" }), // light reed

    ...this.applyStyle(functionKeys, { backgroundColor: "#555555" }),
    ...this.applyStyle(modifierKeys, { backgroundColor: "#446644" }),

    ...this.applyStyle(numpadKeys, { backgroundColor: "#664444" }),
    ...this.applyStyle(otherKeys, { backgroundColor: "#444466" })
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
