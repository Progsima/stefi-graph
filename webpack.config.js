var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var glob = require('glob');

// Host port, and base URL
var host = 'localhost';
var port = 8080;
var baseUrl = '/';
// Paths
var basePath = path.resolve(__dirname);
var paths = {
    base: basePath,
    nodeModules: path.join(basePath, 'node_modules'),
    app: path.join(basePath, 'src'),
    index: path.join(basePath, 'src/index.html'),
    build: path.join(basePath, 'dist')
};

// Internal flags - Don't edit these!!!!1
var DEBUG = !argv.release;
var TEST = !argv.test? false : true;
var DEV_SERVER_URL = ['http', '//' + host, 8080].join(':');

// Custom Flags - Edit these!!!!!!111
var IMAGE_INLINE_LIMIT = 10000; // Maximum imagefilesize (in bytes) to inline

// Global variables that will be available to all scripts without needing
// to be `require`d
var GLOBALS = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    '__DEBUG__': DEBUG
};

var wConfig = {
    module: {
        loaders: [
            // CSS and LESS support here :)
            {
                test: /\.css$/,
                loaders: [
                    'style',
                    'css'
                ]
            },
            {
                test: /\.less$/,
                loaders: [
                    'style',
                    'css',
                    'less'
                ]
            },

            // Images will be inline if they're less than a certain filesize (see IMAGE_INLINE_LIMIT)
            {
                test: /\.gif/,
                loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/gif'
            },
            {
                test: /\.jpg/,
                loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/jpg'
            },
            {
                test: /\.png/,
                loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/png'
            },
            {
                test: /\.svg/,
                loader: 'url?limit=' + IMAGE_INLINE_LIMIT + '&mimetype=image/svg+xml'
            },

            // These enable JSX and ES6 support
            {
                test: /\.js?$/,
                exclude: [paths.nodeModules],
                loaders: (function () {
                    var loaders = ['babel-loader'];
                    // Add in the `react-hot-loader` in DEBUG mode
                    if (DEBUG) {
                        loaders.unshift('react-hot');
                    }

                    return loaders;
                }())
            },
            // JSON support, too
            {
                test: /\.json/,
                loader: 'json'
            }
        ]
    }
};

// Entry points - In production we'll have only the `main.jsx` entry.
// However in DEBUG, we'll enable Webpacks "Hot Module Replacement"
// functionality for fast development!
wConfig.entry = {
    main: path.join(paths.app, 'index')
};

if (DEBUG) {
    var entries = {};
    var defaultEntries = ['webpack-dev-server/client?' + DEV_SERVER_URL,'webpack/hot/only-dev-server'];
    // Adding default entries
    entries['main'] = defaultEntries.concat(wConfig.entry.main);

    // Adding all examples as entry
    var files = glob.sync("./src/**/*-example.js");
    for (var i = 0; i < files.length; i++) {
        var entry = defaultEntries.concat(files[i]);
        entries[path.basename(entry, path.extname(entry))] = entry;
    }
    wConfig.entry = entries;
}

// Output definition - We'll build into a single app.js file by default
wConfig.output = {
    filename: '[name].bundle.js',
    publicPath: baseUrl,
    path: paths.build
};


// Plugins
wConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.NoErrorsPlugin()
];

if (DEBUG) {
    // Hot Module Replacement ftw
    wConfig.plugins = wConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin()
    ]);
    wConfig.devServer = {
        hot: true
    }
}
else {
    // Minification and merging in production for small(ish) builds!
    wConfig.plugins = wConfig.plugins.concat([
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ]);
}

// We'll turn caching on in DEBUG for improved performance when doing
// incremenetal builds
wConfig.cache = DEBUG;

// DEBUG mode enabled for our loaders... in DEBUG mode only, ofcourse!
wConfig.debug = DEBUG;

// We'll inline the source maps when in DEBUG
wConfig.devtool = DEBUG ? '#inline-source-map' : false;

// ESLint specific stuff
wConfig.eslint = {
    configFile: path.resolve(__dirname, '.eslintrc')
};


module.exports = wConfig;



