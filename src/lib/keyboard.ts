import { Label } from "./keycodes";

export interface IKeyboard {
  keyboard_name: string;
  keyboard_folder: string;
  url: string;
  maintainer: string;
  width: number;
  height: number;
  layouts: ILayout[];
  keymaps: IKeymap[];
}

export interface ILayout {
  name: string;
  keys: IKey[];
}

export interface IKey {
  x: number;
  y: number;

  width: number;
  height: number;

  label?: Label;
  rotation?: IRotation;
  oddShape?: IOddShape;
}
interface IRotation {
  angle: number;
  x: number;
  y: number;
}
interface IOddShape {
  x: number;
  y: number;
  width: number;
  height: number;
  stepped: boolean;
}

export interface IKeymap {
  name: string;
  layers: [Label[]?];
  layout: string;
}
