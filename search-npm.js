// Menu: Search NPM
// Description: Search NPM
// Author: Chris Malven

import "@johnlindquist/kit";

const baseUrl = "https://registry.npmjs.org/-/v1/search";

const term = await arg("Search for:");

const scoreBar = (score) => {
  const count = Math.floor(score / 0.02);
  return "•".repeat(count);
};

let preview = async ({ name, description, version, links, score }) =>
  md(`
  ## ${name}
  ${description} - **v${version}**

  - **Q** ${scoreBar(score.detail.quality)}
  - **P** ${scoreBar(score.detail.popularity)}
  - **M** ${scoreBar(score.detail.maintenance)}

  #### Links
  ${links.npm ? `- [npm](${links.npm})` : ""}
  ${links.repository ? `- [repository](${links.repository})` : ""}
  ${links.repository ? `- [homepage](${links.homepage})` : ""}
`);

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
