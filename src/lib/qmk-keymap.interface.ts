export class QmkKeymap {
  version: number = 0;
  documentation: string = "";
  keyboard: string = "";
  keymap: string = "";
  layout: string = "";
  layers: QmkLayer[] = [];
  author: string = "";
  notes: string = "";
}
export type QmkLayer = string[];
