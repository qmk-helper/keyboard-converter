import { classToPlain, plainToClass } from "class-transformer";
import "reflect-metadata";
import { IKey, IKeyboard, IKeymap } from "./keyboard";
import { Label, Labels } from "./keycodes";
import { KleConverter } from "./kle-converter";
import { QmkKeyboard } from "./qmk-keyboard.interface";
import { QmkKeymap } from "./qmk-keymap.interface";
export class KeyboardConverter {
  keyboard: IKeyboard = {
    keyboard_name: "",
    keyboard_folder: "",
    url: "",
    maintainer: "",
    width: 0,
    height: 0,
    layouts: [],
    keymaps: [],
  };

  private labels = new Labels();
  importQmkKeyboard(qmkKeyboardJson: any) {
    this.keyboard = plainToClass(QmkKeyboard, qmkKeyboardJson);
  }
  getKeyboard(simplified = false): object {
    if (simplified) {
      return classToPlain(this.keyboard);
    } else {
      return this.keyboard;
    }
  }

  importQmkKeymap(qmkKeymapJson: any) {
    let qmkKeymap = plainToClass(QmkKeymap, qmkKeymapJson);
    let keymap: IKeymap = {
      name: qmkKeymap.keymap,
      layers: [],
      layout: qmkKeymap.layout,
    };
    qmkKeymap.layers.forEach((qmkLayer) => {
      let layer: Label[] = [];
      qmkLayer.forEach((key) => {
        layer.push(this.labels.getLabel(key));
      });
      keymap.layers.push(layer);
    });
    this.keyboard.keymaps.push(keymap);
    // console.log(keymap);
  }
  exportQmkKeymap(): string {
    throw new Error("Not Implemented");
  }
  importKleKeyboard(kleKeyboardJson: any) {
    throw new Error("Not Implemented");
  }
  exportKleKeyboard(): object {
    let kleConverter = new KleConverter(this.keyboard);
    kleConverter.useKeymap(0);
    return kleConverter.serialize();
  }
  exportQmkCode(): string {
    // console.log(this.keyboard);
    // console.log(this.keyboard.layouts[0].keys);
    // console.log(this.keyboard.keymaps[0].layers);
    const keys = this.keyboard.layouts[0].keys;
    const newKeys = keys.map((key, index) => {
      key.label = this.keyboard.keymaps[0].layers[0]?.[index];
      return key;
    });

    const result = layerToComment(newKeys);
    return "";
  }
}
export { KleConverter } from "./kle-converter";
function layerToComment(keys: IKey[], pad = 5) {
  const size = keys.reduce(
    (acc, key) => {
      if (acc.cols < key.x) {
        acc.cols = key.x;
      }
      if (acc.rows < key.y) {
        acc.rows = key.y;
      }
      return acc;
    },
    { rows: 0, cols: 0 }
  );

  const matrix: (string | undefined)[][] = Array(size.rows + 1);
  for (let index = 0; index < matrix.length; index++) {
    matrix[index] = Array(size.cols + 1).fill(undefined);
  }

  keys.forEach((key, index) => {
    matrix[key.y][key.x] = centerPad(key.label?.l.substr(-pad) || "█", pad);
  });

  cleanMatrix(matrix);
  matrixPrinter(matrix, pad + 1);
}
function matrixPrinter(matrix: (string | undefined)[][], pad: number) {
  matrix.forEach((row, rowNumber, matrix) => {
    const rowObj = row.map((col, colNumber, row) => {
      //  console.log(rowNumber, colNumber, col);
      const tl = !!matrix[rowNumber - 1]?.[colNumber - 1];
      const tm = !!matrix[rowNumber - 1]?.[colNumber];
      const tr = !!matrix[rowNumber - 1]?.[colNumber + 1];
      const ml = !!matrix[rowNumber]?.[colNumber - 1];
      const mm = !!matrix[rowNumber]?.[colNumber];
      const mr = !!matrix[rowNumber]?.[colNumber + 1];
      const bl = !!matrix[rowNumber + 1]?.[colNumber - 1];
      const bm = !!matrix[rowNumber + 1]?.[colNumber];
      const br = !!matrix[rowNumber + 1]?.[colNumber + 1];
      // console.log({tl, tm, tr,ml,mm,mr,bl,bm,br});

      let celline1 = `  `;
      let celline2 = `  `;

      if (mm) {
        celline1 = `${TL(ml, tl, tm, mm)}`.padEnd(pad, "─");
        celline2 = `│${col ?? ""}`.padEnd(pad);
      } else {
        celline1 = `${BL(pad, tl, tm, ml, mm)}`;
        celline2 = `${ml ? "│" : ""}`.padEnd(pad);
      }

      // console.log( [rowLine1, rowLine2].join("\n"))
      return { celline1, celline2 };
    });
    console.log(rowObj.map(({ celline1 }) => celline1).join(""));
    console.log(rowObj.map(({ celline2 }) => celline2).join(""));

    //  console.log( [line1, line2, line3].join("\n"));
  });
}
function cleanMatrix<T>(matrix: (T | undefined)[][]) {
  matrix.forEach((row) => row.push(undefined));
  matrix.push(matrix[0].map(() => undefined));
}

/*

┌  ┬  ┐

├  ┼  ┤

└  ┴  ┘
 */

function TL(ml: boolean, tl: boolean, tm: boolean, mm: boolean) {
  if (!ml && !tl && !tm) {
    return "┌";
  }
  if (!ml && !tl && tm) {
    return "├";
  }
  if (ml && !tl && !tm) {
    return "┬";
  }
  return "┼";
}

// function TR(tm: boolean, tr: boolean, mr: boolean) {
//   if (!tm && !tr && !mr) {
//     return "┐";
//   }
//   if (tm && !tr && !mr) {
//     return "┤";
//   }
//   if (!tm && !tr && mr) {
//     return "";
//   }
//   if (tm || tr || mr) {
//     return "";
//   }
//   return "";
// }
function BL(pad: number, tl: boolean, tm: boolean, ml: boolean, mm: boolean) {
  const corner = BLcorner(tl, tm, ml, mm);

  return corner.padEnd(pad, mm || tm ? "─" : " ");
}
function BLcorner(tl: boolean, tm: boolean, ml: boolean, mm: boolean) {
  if (!tl && !tm && !ml && !mm) {
    return "";
  }

  if (tl && !tm && !ml && !mm) {
    return "┘";
  }
  if (!tl && tm && !ml && !mm) {
    return "└";
  }
  if (!tl && !tm && ml && !mm) {
    return "┐";
  }
  if (!tl && !tm && !ml && mm) {
    return "┌";
  }

  if (tl && tm && !ml && !mm) {
    return "┴";
  }
  if (!tl && tm && !ml && mm) {
    return "├";
  }
  if (tl && !tm && ml && !mm) {
    return "┤";
  }
  if (!tl && !tm && ml && mm) {
    return "┬";
  }
  return "┼";

  // if (mm) {
  //   if (tl && tm && !ml) {
  //     return "┴".padEnd(pad, "─");
  //   }
  //   if (tl && tm && ml) {
  //     return "┼".padEnd(pad, "─");
  //   }
  //   if (!tl && tm) {
  //     return "└".padEnd(pad, "─");
  //   }
  //   if (tl && !tm && !ml) {
  //     return "┘".padEnd(pad);
  //   }
  //   return "".padEnd(pad);
  // } else {
  //   if (tl && ml) {
  //     if (tm) {
  //       return "┼─".padEnd(pad, "─");
  //     } else {
  //       return "┤".padEnd(pad);
  //     }
  //   }
  //   if (ml) {
  //     return "┐".padEnd(pad);
  //   }
  //   if (tl || tm) {
  //     if (tl && tm) {
  //       return "┴─".padEnd(pad, "─");
  //     }
  //     if (tl && tm) {
  //       return "┼─".padEnd(pad, "─");
  //     }
  //     if (!tl && tm) {
  //       return "└─".padEnd(pad, "─");
  //     }
  //     if (tl && !tm) {
  //       return "┘".padEnd(pad);
  //     }
  //   }
  //   return "".padEnd(pad);
  // }
}
function testBL() {
  const input = [
    [false, false, false, false],
    [false, false, false, true],
    [false, false, true, false],
    [false, false, true, true],
    [false, true, false, false],
    [false, true, false, true],
    [false, true, true, false],
    [false, true, true, true],
    [true, false, false, false],
    [true, false, false, true],
    [true, false, true, false],
    [true, false, true, true],
    [true, true, false, false],
    [true, true, false, true],
    [true, true, true, false],
    [true, true, true, true],
  ];
  input.forEach((key) => {
    console.log(
      `${key[0] ? 1 : 0},${key[1] ? 1 : 0},${key[2] ? 1 : 0},${
        key[3] ? 1 : 0
      }, "${BL(4, key[0], key[1], key[2], key[3])}"`
    );
  });
}
// testBL();

function centerPad(str: string, length: any, char = " ") {
  return str.padStart((str.length + length) / 2, char).padEnd(length, char);
}
