const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const isEnvProductionProfile = process.argv.includes('--profile');

module.exports = function (env) {

    console.log(`This is a ${isDevelopment ? "development" : "production"} build`);

    const distFolder = "dist";

    const baseConfig = {
        //target: ['es5'],
        //moduleVersion: 'es5',
        //mode: 'production',
        mode: process.env.NODE_ENV || 'development',
        entry: [
            './src/popupwindow.js',
            './src/popupwindow.scss'
        ],   
        output: {
            path: path.resolve(__dirname, distFolder),
            filename: 'popupwindow.min.js', //filename: '[name].[contenthash].bundle.js',
            publicPath: '/dist/',
        },
        plugins: [
            //new webpack.ProgressPlugin(),
            new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns:[distFolder]}),
            new webpack.DefinePlugin({
                ENV_IS_DEVELOPMENT: isDevelopment,
                ENV_IS: JSON.stringify(env),
            }),
            //new CompressionPlugin(),
            //new StatsGraphPlugin(),            
            // new CopyWebpackPlugin({
            //     patterns: [
            //         {
            //             from: 'wwwroot/libs/abp-web-resources/Abp/Framework/scripts/**/*.ts',
            //             //to: 'Common/@types/abp/[name].[ext]',
            //             to: path.resolve(__dirname, "wwwroot/Common/@types/abp/[name][ext]"),
            //             //to({ context, absoluteFilename }) {
            //             //    return "wwwroot/Common/@types/abp/[name].[ext]";
            //             //},
            //             //context: "wwwroot/",
            //         },
            //     ],
            // })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' }
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /node_modules/,
                    use: [
                        // {
                        //     loader: 'file-loader',
                        //     options: { outputPath: 'css/', name: '[name].min.css'}
                        // },
                      // Creates `style` nodes from JS strings
                    //   MiniCssExtractPlugin.loader,
                      "style-loader",
                      // Translates CSS into CommonJS
                      "css-loader",
                      // Compiles Sass to CSS
                      "sass-loader",
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        }
                    }
                },
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    }
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [['@babel/preset-typescript', { jsxPragma: "h" }]],
                            plugins: [
                                ['@babel/proposal-class-properties'],
                                ['@babel/proposal-object-rest-spread'],
                                ['@babel/plugin-syntax-dynamic-import'],
                                ["@babel/transform-react-jsx", { "pragma": "h" }],
                            ]
                        }
                    }
                }
            ]
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                        // output: {
                        //     comments: false,
                        // },
                        sourceMap: true,
                        ecma: 5,
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                        }
                    },
                    parallel: true,
                    extractComments: false,
                }),
            ],
            //splitChunks: {
            //    chunks: 'all',
            //    name: 'vendor',
            //    minChunks: 2
            //}
        },
    };

    if (isDevelopment) {

        const devServerConfig = {
            devServer: {
                contentBase: path.resolve(__dirname, 'src'),
                publicPath: '/dist/',
                watchContentBase: false,
                hotOnly: true,
                overlay: true,
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: "[name].css",
                    chunkFilename: "[id].css",
                  }),
            ]
        };

        return merge(
            baseConfig,
            devServerConfig
        );
    }
    else {
        return merge(
            baseConfig

        );
    }
};