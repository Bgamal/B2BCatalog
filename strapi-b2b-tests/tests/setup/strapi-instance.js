const mockStrapi = require('./mock-strapi');

let instance;

async function setupStrapi() {
  if (!instance) {
    instance = await mockStrapi.load();
  }
  return instance;
}

async function cleanupStrapi() {
  if (instance) {
    await instance.destroy();
    instance = null;
  }
}

module.exports = {
  setupStrapi,
  cleanupStrapi,
  getInstance: () => instance
};
