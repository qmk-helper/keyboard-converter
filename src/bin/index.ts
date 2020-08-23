import * as arg from "arg";
import * as fs from "fs";
import { keyboard2kle } from "../lib";

const args = arg({
  "--file": String,
  "-f": "--file",
  "-i": "--file",

  "--json": String,
  "-j": "--json",

  "--outputFile": String,
  "-o": "--outputFile",

  "--layout": String,
  "--layers": Number
});
let inputObject: any;
if (args["--file"] && args["--json"]) {
  console.error("You can either specify a json file or a json string");
  process.exit(1);
}

if (args["--file"]) {
  inputObject = fs.readFileSync(args["--file"]).toString();
} else if (args["--json"]) {
  inputObject = args["--json"];
} else {
  console.error(
    "You must either specify a json file (--file) or a json string (--json)"
  );
  process.exit(1);
}

let outputObject: object = keyboard2kle(JSON.parse(inputObject));

if (args["--outputFile"]) {
  fs.writeFileSync(args["--outputFile"], JSON.stringify(outputObject));
} else {
  console.log(JSON.stringify(outputObject));
}
