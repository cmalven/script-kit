// Name: Commute Down
// Description: Sync a database down using Commute
// Author: Chris Malven

import "@johnlindquist/kit"
let yaml = await npm('yaml');

// Read a file from the local filesystem
const filePath = home('.commute.yml');
const file = await readFile(filePath, 'utf-8');

// Get the top level project keys keys from the file
const contents = yaml.parse(file);
const projects = Object.entries(contents);

let preview = async (key, info) =>
  md(`
  ## ${key}
  - Remote IP: ${info.remote.host}  
  - Remote User: ${info.remote.u}
  - Remote Database: ${info.remote.db.name}
  - Local Database: ${info.local.db.name}
`);

// Create previews for all projects
const projectOptions = projects.map(([key, info]) => {
  return {
    name: key,
    description: `${info.remote.u} - ${info.remote.host}`,
    value: key,
    preview: async () => preview(key, info),
  }
})

// Get the selected project
let projectKey = await arg("Select project:", projectOptions);

// Run Commute
await $`commute ${projectKey} down`;


