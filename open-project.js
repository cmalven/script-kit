// Name: Open Project
// Description: Open a project in your default editor
// Author: Chris Malven

import "@johnlindquist/kit"

const CODE_DIR = "Code"
const IGNORED = [
  '.DS_Store',
];

// Read projects
let projectDirs = await readdir(home(CODE_DIR));
projectDirs = projectDirs.filter(dir => !IGNORED.includes(dir));

const preview = async (dir) => {
  const readMePath = home(CODE_DIR, dir, 'README.md');
  try {
    const file = await readFile(readMePath, 'utf8');
    return md(file);
  } catch (err) {
    return md(`## Couldn't read README.md`);
  }
}

const selectedDir = await arg('Open Project:', projectDirs.map(dir => ({
  name: dir,
  value: home(CODE_DIR, dir),
  preview: async () => await preview(dir),
})));

edit(selectedDir);