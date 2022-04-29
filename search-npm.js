// Shortcut: command shift option n
// Menu: Search NPM
// Description: Search NPM
// Author: Chris Malven

import "@johnlindquist/kit";

const baseUrl = "https://registry.npmjs.org/-/v1/search";

const term = await arg("Search for:");

const scoreBar = (label, score) => {
  return `
    <div class="pr-3">
      <p class="text-xs mb-2">${label}</p>
      <span class="h-0.5 block bg-zinc-100">
        <span class="h-0.5 block bg-green-500" style="width: ${score * 100}%"></span>
      </span>
    </div>
  `;
};

let preview = async ({ name, description, version, links, score }) => {
  // md(`
  // ## ${name}
  // ${description} - **v${version}**
  //
  // - **Q** ${scoreBar(score.detail.quality)}
  // - **P** ${scoreBar(score.detail.popularity)}
  // - **M** ${scoreBar(score.detail.maintenance)}
  //
  // #### Links
  // ${links.npm ? `- [npm](${links.npm})` : ""}
  // ${links.repository ? `- [repository](${links.repository})` : ""}
  // ${links.repository ? `- [homepage](${links.homepage})` : ""}
  return `
    <div class="p-8">
      <h1>${name}</h1>
      <p class="text-xs">${description} - <strong>v${version}</strong></p>
      
      <div class="grid grid-cols-3 mt-5">
        ${scoreBar('P', score.detail.popularity)}
        ${scoreBar('Q', score.detail.quality)}
        ${scoreBar('M', score.detail.maintenance)}
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
    const { name, description, version, links } = p;

    return {
      name,
      description,
      value: links.npm,
      preview: async () => preview({ name, description, version, links, score }),
    }
  });

  let url = await arg("Select package:", options);

  await $`open ${url}`;
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
