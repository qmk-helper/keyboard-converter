import {
  classToPlain,
  Exclude,
  Expose,
  plainToClass,
  Transform,
  TransformationType,
  Type,
} from "class-transformer";
import "reflect-metadata";

export class QmkKeyboard {
  keyboard_name: string = "";
  keyboard_folder: string = "";
  url: string = "";
  maintainer: string = "";
  width: number = 0;
  height: number = 0;
  @TransformLayout()
  layouts: QmkLayout[] = [];
  @Exclude()
  keymaps = [];
}

function TransformLayout() {
  return Transform((layouts, obj, transformationType) => {
    if (transformationType == TransformationType.PLAIN_TO_CLASS) {
      let transformedLayouts: QmkLayout[] = [];
      for (let name in layouts) {
        transformedLayouts.push({
          name,
          keys: plainToClass(DefaultKey, layouts[name].layout),
        });
      }
      return transformedLayouts;
    } else {
      let transformedLayouts: any = {};
      for (let layout of layouts) {
        transformedLayouts[layout.name] = { layout: classToPlain(layout.keys) };
      }
      return transformedLayouts;
    }
  });
}

export class QmkLayout {
  name: string = "";
  @Type(() => DefaultKey)
  keys: DefaultKey[] = [];
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
export class DefaultKey {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  @Expose({ name: "w" })
  @Default(1)
  width: number = 1;

  @Expose({ name: "h" })
  @Default(1)
  height: number = 1;

  rotation?: IRotation;
  setRotation(
    angle: number = 0,
    x = 0,
    y = 0,
    pivot: "local" | "global" = "local"
  ) {
    if ((pivot = "local")) {
      this.rotation = {
        angle,
        x: x + this.width / 2,
        y: y + this.height / 2,
      };
    } else {
      this.rotation = { angle, x, y };
    }
  }
  oddShape?: IOddShape;
  setOddShape(
    width = this.width,
    height = this.height,
    x = 0,
    y = 0,
    stepped = false
  ) {
    this.oddShape = { x, y, width, height, stepped };
  }
}

function Default(defaultValue: any) {
  return Transform((value: any, obj: any, transformationType) => {
    if (transformationType === TransformationType.CLASS_TO_PLAIN) {
      return value == defaultValue ? undefined : value;
    } else {
      if (value !== null && value !== undefined) return value;
      if (typeof defaultValue === "function") return defaultValue();
      if (Array.isArray(defaultValue)) return [...defaultValue];
      if (typeof defaultValue === "object") {
        return defaultValue === null ? null : { ...defaultValue };
      }
      return defaultValue;
    }
  });
}
