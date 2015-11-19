var path = require("path");
module.exports = {
    "entry": path.resolve(__dirname, "src/index.js"),
    "output": {
        path: __dirname + "/dist",
        filename: "cope.js",
        library: "cope",
        libraryTarget: "umd"
    },
    "module": {
        "loaders": [
            {test: /\.js$/, loader: 'babel?stage=0'}
        ]
    },
    devtool: "source-map"
};
