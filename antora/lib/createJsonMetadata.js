const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// type Publications = {
//   provider: string,
//   path: string,
//   resolvedPath: string,
//   fileUri: string,
// }[]

module.exports.register = function () {
  this.on('sitePublished', ({ playbook, uiCatalog, contentCatalog, publications }) => {
    const components = contentCatalog.getComponents();
    const basePath = publications[0].resolvedPath;

    components.forEach(element => {
      // todo: this works only for latest version, which should be preferred in context of search engine (?)
      const componentPart = element.latest.url.split("/").splice(0, 2).join("/");
      fs.writeFileSync(basePath + componentPart + "/info.json", JSON.stringify({
        title: element.latest.title,
        version: element.latest.version,
      }));
    });
  });
};