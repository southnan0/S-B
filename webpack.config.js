const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const dev = require('./webpack.dev.config.js');
const product = require('./webpack.product.config.js');

if (TARGET === 'start' || !TARGET) {
    module.exports = dev;
} else {
    module.exports = product;
}