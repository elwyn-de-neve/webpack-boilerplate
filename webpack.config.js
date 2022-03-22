const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const fs = require( "fs" );

// Array will be filled dynamically
const htmlPageNames = [];

const pages = fs.readdirSync( "./src" );
pages.forEach( page => {
    if ( page.endsWith( ".html" ) ) {
        htmlPageNames.push( page.split( ".html" )[0] );
    }
} );
console.log(htmlPageNames);

const multipleHtmlPlugins = htmlPageNames.map( ( pageName ) => {
    return new HtmlWebpackPlugin( {
                title: `${ pageName }`,
                filename: `${ pageName }.html`,
                chunks: [ "main" ],
                template: path.resolve( __dirname, `src/${ pageName }.html` )
            } )
} );

module.exports = {
    context: path.resolve('./src'),
    mode: "development", // 'production',
    entry: {
        main: path.resolve( __dirname, "src/index.js" ) // Set starting point of project (multiple entries are supported)
    },
    output: {
        path: path.resolve( __dirname, "dist" ), // Set distribution folder of project
        filename: "[name].[contenthash].js", // Get default entry name and add a unique hash for version control
        assetModuleFilename: "[name][ext]", // Use default filename of assets in output files
        clean: true // Empty cache (dist folder)
    },
    devtool: "inline-source-map", // Show's the browser where errors came from
    devServer: { // Settings for our server
        static: path.resolve( __dirname, "dist" ), // Set root folder of our server
        open: true, // Launches webbrowser on build
        hot: true // Enables reload browser on save
    },
    // Set loaders (Webpack understands JS and Json by default, but for all other files we need loaders)
    module: {
        rules: [
            // CSS loader
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ] // Reads from right to left: Css-loader looks for file and turns it into a loader, Style-loader takes the file and inject it into html file.
            },
            {
                test: /\.scss$/,
                use: [ "css-loader", "sass-loader" ]
            },
            // Image loader
            {
                test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/,
                // type: "asset/resource",
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "images/",
                        publicPath: "images/"
                    }
                }
            },
            // JS for Babel loader (make your exports backward compatible to ES5)
            {
                test: /\..js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "@babel/preset-env" ]
                    }
                }
            },
            {
                test: /\..html$/,
                use: [
                    "html-loader"
                ]
            }
        ]
    },
    plugins: [ ].concat( multipleHtmlPlugins )
};