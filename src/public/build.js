var fs = require("fs");
var browserify = require("browserify");
browserify("./src/public/js/main.js")
  .transform("babelify", { 
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins : ["babel-plugin-transform-class-properties"]
  })
  .bundle()
  .pipe(fs.createWriteStream("./src/public/dist.js"));