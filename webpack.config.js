module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + "/dist",
        filename: "cope.js",
        libraryTarget: "umd"
    },
    loaders: [
        { loader: 'babel?stage=0' }
    ]
};
