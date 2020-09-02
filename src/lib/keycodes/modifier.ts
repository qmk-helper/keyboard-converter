import { LabelList } from ".";

export let modifierKeys: LabelList = {
  KC_CAPS: { l: "Caps", d: "Caps Lock" },
  KC_LCAP: { l: "L Caps", d: "Locking Caps Lock" },
  KC_SLCK: { l: "ScrLk", d: "Scroll Lock; Brightness Down (macOS)" },
  KC_LSCR: { l: "L ScrLk", d: "Locking Scroll Lock" },
  KC_NLCK: { l: "Num", d: "Num Lock" },
  KC_LNUM: { l: "L Num", d: "Locking Num Lock" },

  KC_LCTL: { l: "Ctrl", d: "Left Control" },
  KC_LSFT: { l: "Shift", d: "Left Shift" },
  KC_LALT: { l: "Alt", d: "Left Alt" },
  KC_LGUI: { l: "Super", d: "Left GUI" },

  KC_RCTL: { l: "Ctrl", d: "Right Control" },
  KC_RSFT: { l: "Shift", d: "Right Shift" },
  KC_RALT: { l: "Alt", d: "Right Alt" },
  KC_RGUI: { l: "Super", d: "Right GUI" }
};
