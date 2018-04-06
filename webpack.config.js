// TODO: Upgrade to webpack 4
const path = require('path');
const os = require('os');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlTemplate = require('html-webpack-template');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const BUILD_TARGET = process.env.BUILD_TARGET;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const SOURCE_PATH = path.resolve(__dirname, 'src');
const OUTPUT_PATH = path.resolve(__dirname, 'build');

const config = {
    context: path.resolve(__dirname),

    entry: {
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: OUTPUT_PATH,
        publicPath: '/',
    },

    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ],
        plugins: [
            new TsconfigPathsPlugin(),
        ],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /\bnode_modules\b/,
                use: [
                    {
                        loader: 'cache-loader',
                    },
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: os.cpus().length - 2,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            onlyCompileBundledFiles: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                localIdentName: '[hash:base64:6]',
                                importLoaders: 1,
                                sourceMap: IS_DEVELOPMENT,
                                minimize: !IS_DEVELOPMENT,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                    ],
                }),
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                exclude: /\bnode_modules\b/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                quality: 85,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                exclude: /\bnode_modules\b/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(IS_DEVELOPMENT ? 'development' : 'production'),
        }),
        new ForkTsCheckerPlugin({
            checkSyntacticErrors: true,
            tslint: true,
            watch: [ SOURCE_PATH ],
        }),
        new ExtractTextPlugin({
            filename: '[name].css?[contenthash:6]',
            allChunks: true,
            disable: IS_DEVELOPMENT,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.common',
            minChunks: (module, count) => {
                const entriesCount = Object.keys(config.entry).length;
                const isVendor = module.context && /\bnode_modules\b/.test(module.context);
                return isVendor && (entriesCount === 1 || entriesCount === count);
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
    ],
};

if (IS_DEVELOPMENT) {
    config.devtool = 'eval-source-map';

    config.plugins = [
        ...config.plugins,

        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ];
}
else {
    config.output.filename += '?[chunkhash:6]';
    config.output.chunkFilename += '?[chunkhash:6]';

    config.plugins = [
        new CleanPlugin([OUTPUT_PATH]),

        ...config.plugins,

        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJsPlugin({
            parallel: true,
        }),
    ];
}

if (BUILD_TARGET === 'web') {
    config.target = 'web';

    Object.assign(config.entry, {
        web: path.resolve(SOURCE_PATH, ...'Views/Web/index.tsx'.split('/')),
    });

    config.plugins = [
        ...config.plugins,

        new HtmlPlugin({
            title: 'Your App Name',
            inject: false,
            template: HtmlTemplate,
            mobile: true,
        }),
    ];

    if (IS_DEVELOPMENT) {
        config.devServer = {
            compress: true,
            hot: true,
            historyApiFallback: true,
        };
    }
}
else {
    throw `Wrong build target: ${BUILD_TARGET}`;
}

module.exports = config;
