import { Keyboard } from "@qmk-helper/kle-serial/dist/interfaces";
import { IKey, IKeyboard, IKeymap, ILayout } from "./keyboard";

interface ISymbols {
  tl: string;
  tm: string;
  tr: string;
  ml: string;
  mm: string;
  mr: string;
  bl: string;
  bm: string;
  br: string;
  pad: string;
  sl: string;
  sm: string;
  sr: string;
}
const BlockSymbols: ISymbols = {
  tl: "┌",
  tm: "┬",
  tr: "┐",
  ml: "├",
  mm: "┼",
  mr: "┤",
  bl: "└",
  bm: "┴",
  br: "┘",
  pad: "─",
  sl: "│",
  sm: "│",
  sr: "│",
};

const CodeSymbols: ISymbols = {
  tl: "",
  tm: "",
  tr: "",
  ml: "",
  mm: "",
  mr: "",
  bl: "",
  bm: "",
  br: "",
  pad: "",
  sl: "",
  sm: ",",
  sr: ",",
};

export class QmkCode {
  keys: IKey[] = [];
  size = { rows: 0, cols: 0 };
  commentMatrixPrinter: MatrixPrinter;
  codeMatrixPrinter: MatrixPrinter;

  constructor(public keyboard: IKeyboard) {
    this.codeMatrixPrinter = new MatrixPrinter(CodeSymbols);
    this.commentMatrixPrinter = new MatrixPrinter(BlockSymbols);
  }

  public printLayer(layer = 0) {
    const keys = this.keyboard.layouts[0].keys;
    const newKeys = keys.map((key, index) => {
      key.label = this.keyboard.keymaps[0].layers[0]?.[index];
      return key;
    });

    this.keys = newKeys;
    this.size = this.getSize();

    const result = [
      this.layerToComment(newKeys),
      this.layerToCode(newKeys),
    ].join("\n");
    console.log(result);
    return result;
  }
  private getSize() {
    return this.keys.reduce(
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
  }
  private layerToComment(keys: IKey[]) {
    const commentMatrix = this.generateEmptyMatrix();

    keys.forEach((key, index) => {
      commentMatrix[key.y][key.x] = key.label?.l || "█";
    });

    cleanMatrix(commentMatrix);
    return this.commentMatrixPrinter.print(commentMatrix);
  }

  private layerToCode(keys: IKey[]) {
    const codeMatrix = this.generateEmptyMatrix();

    keys.forEach((key) => {
      codeMatrix[key.y][key.x] = key.label?.code;
    });

    cleanMatrix(codeMatrix);
    return this.codeMatrixPrinter.print(codeMatrix);
  }

  private generateEmptyMatrix() {
    const matrix: (string | undefined)[][] = Array(this.size.rows + 1);
    for (let index = 0; index < matrix.length; index++) {
      matrix[index] = Array(this.size.cols + 1).fill(undefined);
    }
    return matrix;
  }
}
class MatrixPrinter {
  constructor(public S: ISymbols) {}

  public print(matrix: (string | undefined)[][]): string {
    const colLength = Array(matrix[0].length).fill(5);
    matrix.forEach((row) => {
      for (let i = 0; i < colLength.length; i++) {
        colLength[i];
        const curLength = row[i]?.length ?? 0;
        if (curLength > colLength[i]) {
          colLength[i] = curLength;
        }
      }
    });

    return matrix
      .map((row, rowNumber, matrix) => {
        const rowObj = row.map((col, colNumber) => {
          const pad = colLength[colNumber] + 1;

          const tl = !!matrix[rowNumber - 1]?.[colNumber - 1];
          const tm = !!matrix[rowNumber - 1]?.[colNumber];

          const ml = !!matrix[rowNumber]?.[colNumber - 1];
          const mm = !!matrix[rowNumber]?.[colNumber];

          let celline1;
          let celline2;

          if (mm) {
            celline1 = `${this.TL(ml, tl, tm, mm)}`.padEnd(pad, this.S.pad);
            celline2 = `${!ml?this.S.sl:this.S.sm}${this.centerPad(
              col ?? "",
              pad - 1
            )}`.padEnd(pad);
          } else {
            celline1 = `${this.BL(pad, tl, tm, ml, mm)}`;
            celline2 = `${ml ? this.S.sr : " "}`.padEnd(pad);
          }

          // console.log( [rowLine1, rowLine2].join("\n"))
          return { celline1, celline2 };
        });
        return [
          rowObj.map(({ celline1 }) => celline1).join(""),
          rowObj.map(({ celline2 }) => celline2).join(""),
        ].join("\n");
      })
    .join("\n");
  }

  private TL(ml: boolean, tl: boolean, tm: boolean, mm: boolean) {
    if (!ml && !tl && !tm) {
      return this.S.tl;
    }
    if (!ml && !tl && tm) {
      return this.S.ml;
    }
    if (ml && !tl && !tm) {
      return this.S.tm;
    }
    return this.S.mm;
  }

  private BL(pad: number, tl: boolean, tm: boolean, ml: boolean, mm: boolean) {
    const corner = this.BLcorner(tl, tm, ml, mm);

    return corner.padEnd(pad, mm || tm ? this.S.pad : " ");
  }
  private BLcorner(tl: boolean, tm: boolean, ml: boolean, mm: boolean) {
    if (!tl && !tm && !ml && !mm) {
      return "";
    }

    if (tl && !tm && !ml && !mm) {
      return this.S.br;
    }
    if (!tl && tm && !ml && !mm) {
      return this.S.bl;
    }
    if (!tl && !tm && ml && !mm) {
      return this.S.tr;
    }
    if (!tl && !tm && !ml && mm) {
      return this.S.tl;
    }

    if (tl && tm && !ml && !mm) {
      return this.S.bm;
    }
    if (!tl && tm && !ml && mm) {
      return this.S.ml;
    }
    if (tl && !tm && ml && !mm) {
      return this.S.mr;
    }
    if (!tl && !tm && ml && mm) {
      return this.S.tm;
    }
    return this.S.mm;
  }

  private centerPad(str: string, length: any, char = " ") {
    return str.padStart((str.length + length) / 2, char).padEnd(length, char);
  }
}
function cleanMatrix<T>(matrix: (T | undefined)[][]) {
  matrix.forEach((row) => row.push(undefined));
  matrix.push(matrix[0].map(() => undefined));
}
