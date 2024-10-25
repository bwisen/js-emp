const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

//colors
const reset = "\x1b[0m";
const yellow = "\x1b[33m";
const cyan = "\x1b[36m";
const green = "\x1b[32m";
const red = "\x1b[31m";
const bgwhite = "\x1b[47m";
const black = "\x1b[30m";

const logerr = (str) => console.log(`${red}[JS-EMP]:${reset} ${str}`);

const $ = [
  "   █ ▄▀▀    ██▀ █▄ ▄█ █▀▄",
  " ▀▄█ ▄██ ▀▀ █▄▄ █ ▀ █ █▀ "
];

const banner = _ => {for(let i=0;i<$.length;i++){console.log(`${yellow}${$[i]}${reset}`)}};

const prompt = async str => {
  const r = readline.createInterface({input:process.stdin,output:process.stdout});
  return new Promise(rs => {
    r.question(str, o => {
      r.close();
      rs(o);
    });
  });
};

const modes = {
  semicolon: [`;`, `;`],
  quotmark:  [`"`,`“`],
  paren:     [`(`,`（`],
  all:       [`*`, `*`],
};

let mode;

const setmode = (m) => {
  if(!modes[m]) { logerr("invalid mode name."); return 1; }
  mode = modes[m];
  console.log(`${green}[JS-EMP]:${reset} current mode is set to "${m}"`);
}

/*
  bu satirdan sonra islenen tum suclardan
  google play store sorumludur.
*/

const emp = async (filepath, empmode) => {
  if (!empmode) { return logerr("emp mode is not set."); }
  try {
    const data = await fs.readFile(filepath, "utf8");
    const lines = data.split(/\r?\n/);
    let empmodes = [empmode];
    if (empmode[0] === "*" || empmode[1] === "*") {
      empmodes = Object.values(modes);
    }
    const replacedlines = lines.map(line => {
      let _line = line;
      for (let i=0;i<empmodes.length;i++) {
        _line = _line.replaceAll(empmodes[i][0], empmodes[i][1]);
      }
      return _line;
    });
    await fs.writeFile(filepath, replacedlines.join("\n"), "utf8");
  } catch (err) {
    console.error(`[ERROR]: ${err}`);
    return;
  }
}

const emp_all = async (dir, empmode) => {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const fullpath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await emp_all(fullpath, empmode); 
    } else if(file.isFile()&&file.name!=="js-emp.js") {
      await emp(fullpath, empmode);
    }
  }
}

// commands
const cmd_modes = async args => {
  Object.keys(modes).forEach((_mode,i) => {
    let from = modes[_mode][0]=="*"?"{all}":modes[_mode][0];
    let to = modes[_mode][1]=="*"?"{all}":modes[_mode][1];
    console.log(`${(yellow+"'"+_mode+"'"+reset).padEnd(21," ")}:: replaces every ${cyan}${from}${reset} character to ${cyan}${to}${reset}`);
  });
}

const cmd_mode = async args => {
  if(args.length<1) {return logerr("usage: mode <name>");}
  setmode(args[0]);
}

const cmd_emp = async args => {
  if (args.length < 1) { return logerr("usage: emp <file path>"); }
  const arg_path = args[0];
  await (arg_path === "all"?emp_all("./", mode):emp(arg_path, mode));
}

const cmd_ls = async args => {
  let files = await fs.readdir('./', {withFileTypes: true});
  let out;
  out = files.filter(item => !item.isDirectory()).map(item => item.name)
  console.log(`${yellow}`+out.join("  ")+`${reset}`)
}

const commands = {
  modes: cmd_modes,
  mode: cmd_mode,
  emp: cmd_emp,
  ls: cmd_ls
};

const main = async () => {
  banner();
  console.log(`commands: modes, mode <name>, emp <file path | all>, ls${reset}`)
  setmode("semicolon");
  while(1) {
    let input = await prompt(`${cyan}$: ${reset}`);
    let _args = input.split(" ");
    let [cmd,...args] = _args;
    if(cmd=="exit") {break;}
    if(!commands[cmd]) {
      logerr(`command ${cmd} does not exist.`);
      continue;
    }
    await commands[cmd](args);
  }
}

main();
