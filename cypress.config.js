const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://todomvc.com/examples/react/dist/',
    supportFile: false,
    video: false,
    viewportWidth: 1100,
    viewportHeight: 800,
  },
});
