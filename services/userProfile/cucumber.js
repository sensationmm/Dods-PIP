let common = [
  'tests/integrationTests/features',
  '--require-module ts-node/register',
  '--require tests/integrationTests/step-definitions/**/*.ts',
  '--require .env',
  '--format json:coverage/integration-tests-report.json',
  '--format @cucumber/pretty-formatter',
  '--publish'
].join(' ');

module.exports = {
  default: common,
  // More profiles can be added if desired
};