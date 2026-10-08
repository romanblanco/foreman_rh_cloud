// Build this checkout against a sibling Foreman checkout without booting Rails.
// Packaged Foreman excludes test/build-only packages from its shared dependency
// list. Sharing them from a development checkout (notably tabbable) produces
// plugin assets that cannot load against the packaged core.
const path = require('path');

const pluginRoot = path.resolve(__dirname, '..');
const foremanRoot = path.resolve(
  process.env.FOREMAN_BUILD_ROOT || path.join(pluginRoot, '../foreman')
);
const webpack = require(path.join(foremanRoot, 'node_modules/webpack'));
const pluginUtils = require(path.join(
  foremanRoot,
  'script/plugin_webpack_directories'
));
const exclusions = require(path.join(foremanRoot, 'package-exclude.json'));

pluginUtils.getPluginDirs = () => ({
  plugins: {
    foreman_rh_cloud: { root: pluginRoot },
    'foreman_rh_cloud:global': { root: pluginRoot },
  },
});

const createConfigs = require(path.join(foremanRoot, 'config/webpack.config'));

module.exports = (env = {}, argv = {}) => {
  const configs = createConfigs(
    { ...env, pluginName: 'foreman_rh_cloud' },
    argv
  );

  for (const config of configs) {
    config.module.rules = config.module.rules.map(rule => {
      if (!rule.loader || !rule.loader.includes('babel-loader')) return rule;

      // Use Foreman's absolute builder preset, not this checkout's Babel config
      // which expects a separate node_modules installation in the plugin.
      return {
        ...rule,
        options: { ...rule.options, configFile: false, babelrc: false },
      };
    });

    config.plugins = config.plugins.map(plugin => {
      if (!(plugin instanceof webpack.container.ModuleFederationPlugin)) {
        return plugin;
      }

      const options = plugin.options || plugin._options;
      const shared = options.shared.filter(entry =>
        Object.keys(entry).every(
          name =>
            !exclusions.EXCLUDE_NPM_PACKAGES.includes(name) &&
            !exclusions.EXCLUDE_NPM_PREFIXES.some(prefix =>
              name.startsWith(prefix)
            )
        )
      );

      return new webpack.container.ModuleFederationPlugin({
        ...options,
        shared,
      });
    });
  }

  return configs;
};
