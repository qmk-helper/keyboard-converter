export interface QmkKeyboard {
  keyboard_name: string;
  keyboard_folder: string;
  url: string;
  maintainer: string;
  width: number;
  height: number;
  layouts: Layouts;
}
export interface Layouts {
  [key: string]: Layout;
}
export interface Layout {
  layout?: Key[];
}
export interface Key {
  x: number;
  y: number;
  w?: number;
  label?: string;
}
