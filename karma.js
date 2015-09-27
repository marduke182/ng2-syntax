module.exports = function(config) {
    config.set({
        // ... normal karma configuration

        files: [
            // all files ending in "_test"
            'karma.entry.js'
            // each file acts as entry point for the webpack configuration
        ],
        frameworks: ['mocha', 'chai'],
        singleRun: true,
        preprocessors: {
            'karma.entry.js': ['webpack', 'sourcemap']
        },

        webpack: {
          devtool: 'inline-source-map', //just do inline source maps instead of the default
          module: {
            loaders: [
              { test: /\.js$/, loader: 'babel-loader',  exclude: /node_modules/ }
            ]
          }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        },
        reporters: ['mocha'],
        plugins: [
            require("karma-webpack"),
            'karma-mocha',
            'karma-chai',
            'karma-phantomjs-launcher',
            'karma-sourcemap-loader',
            'karma-mocha-reporter'
        ],
        browsers: ['PhantomJS']

    });
};
