// Lab tooling is opt-in; normal installs/builds do not download a browser.
// To run perf:audit/perf:inspect/perf:browser: npx puppeteer browsers install chrome
module.exports = { skipDownload: true };
