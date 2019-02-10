var CompressionPlugin = require('compression-webpack-plugin');

var config = {};

function generateConfig(options) {
  var setup = {
    mode: options.mode,
    entry: options.entry || __dirname + '/index.js',
    output: {
      path: __dirname + options.outputPath,
      filename: options.name + (options.extension || '.js'),
    },
    plugins: [],
    node: {
      process: false,
    },
  };

  if (options.target) {
    setup.output.libraryTarget = options.target;
    setup.output.library = 'smart-avatar';
  }

  if (options.sourceMapping) {
    setup.output.sourceMapFilename = options.name + '.map';
    setup.devtool = 'eval-source-map';
  }

  if (options.gzip) {
    setup.plugins.push(new CompressionPlugin());
  }

  return setup;
}

config = generateConfig({
  name: 'smart-avatar',
  mode: 'production',
  outputPath: '/dist/',
  target: 'umd',
  extension: '.js',
});

module.exports = config;