var webpack = require('webpack');
var path = require('path');
var wConfig = require('./webpack.config');

// instrument only testing sources with Istanbul
wConfig.module['postLoaders'] = [
    {
        test: /\.js$/,
        exclude: /(test|node_modules|bower_components)/,
        include: path.resolve('src/'),
        loader: 'istanbul-instrumenter'
    }
];
wConfig.devtool= 'inline-source-map';

// https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md
wConfig.externals = {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
};

wConfig.entry = {};

module.exports = function (config) {
    config.set({
        plugins: [
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai'
        ],
        frameworks: [ 'mocha' ], //use the mocha test framework
        browsers: [ 'PhantomJS' ],
        files: [
            { pattern: 'src/**/*-test\.js' }
        ],
        preprocessors: {
            'src/**/*\.js': [ 'webpack', 'sourcemap'],
            'src/*/!(test)/**/*(!test)\.js': ['coverage'],
            'src/**/*-test\.js': ['webpack']
        },
        webpack: wConfig,
        webpackServer: {
            noInfo: true //please don't spam the console when running in karma!
        },
        reporters: [ 'mocha', 'progress', 'coverage'],
        coverageReporter: {
            dir: 'build/coverage',
            check: {
                global: {
                    statements: 50,
                    branches: 50,
                    functions: 50,
                    lines: 50,
                    excludes: [
                        'webpack.config.test.js'
                    ]
                }
            },
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
            ]
        }
    });
};
