// Shortcut: command shift option n
// Menu: Search NPM
// Description: Search NPM
// Author: Chris Malven

import "@johnlindquist/kit";
const human = await npm('human-time');

const baseUrl = "https://registry.npmjs.org/-/v1/search";

const term = await arg("Search for:");

const scoreBar = (label, score) => {
  return `
    <div class="" style="padding-right: 20px;">
      <p class="text-xs mb-2">${label}</p>
      <span class="h-0.5 block bg-white">
        <span class="h-0.5 block bg-green-500" style="width: ${score * 100}%"></span>
      </span>
    </div>
  `;
};

const renderLink = (text, url) => {
  return `
    <div class="" style="padding-right: 10px;">
      <a class="text-white px-3 py-2 text-xs uppercase font-bold rounded-sm bg-red-600 center no-underline" href="${url}">${text}</a>
    </div>
  `;
};

let preview = async ({ name, description, version, links, date, score }) => {
  return `
    <div class="p-8">
      <h1>${name}</h1>
      <p class="text-xs">${human(new Date(date))} - <strong>v${version}</strong></p>
      <p class="text-xs mt-3">${description}</p>
      
      <div class="grid grid-cols-3 mt-5">
        ${scoreBar('P', score.detail.popularity)}
        ${scoreBar('Q', score.detail.quality)}
        ${scoreBar('M', score.detail.maintenance)}
      </div>
      
      <h2 class="mt-10 text-sm">Links</h2>
      <div class="flex mt-3">
        ${links.npm ? renderLink('NPM', links.npm) : ''}
        ${links.repository ? renderLink('Repository', links.repository) : ''}
        ${links.homepage && links.homepage !== links.repository ? renderLink('Homepage', links.homepage) : ''}
      </div>
    </div>
  `;
};

async function results(ranking) {
// Request API data
  const results = await get(`${baseUrl}?text=${term}`);
  const data = results.data;

  let options = await data.objects.sort((a, b) => {
    return a.score.detail[ranking] < b.score.detail[ranking] ? 1 : -1;
  });

  // Prep results
  options = await options.map(({ package: p, score, _searchScore }) => {
    const { name, description, version, date, links } = p;

    return {
      name,
      description,
      value: { url: links.npm, name },
      preview: async () => preview({ name, description, version, links, date, score }),
    }
  });

  let selected = await arg("Select package:", options);

  const action = await arg("Choose an action:", [
    { name: '[v]iew', value: 'view', description: 'View on NPM' },
    { name: '[i]nstall', value: 'install', description: 'Copy install text to clipboard' },
  ]);

  switch (action) {
    case 'view':
      await $`open ${selected.url}`;
      break;
    case 'install':
      await copy(`npm i ${selected.name}`);
      break;
  }
}

onTab('Popularlity', async () => {
  await results("popularity");
});

onTab('Quality', async () => {
  await results("quality");
});

onTab('Maintenance', async () => {
  await results("maintenance");
});
