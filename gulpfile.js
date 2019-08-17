const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const browserify = require("browserify");
const fs = require('fs');

function build_js(){
 return browserify("./src/adminer/public/js/ui/main.js")
 .transform("babelify", { 
   presets: ["@babel/preset-env", "@babel/preset-react"],
   plugins : ["babel-plugin-transform-class-properties"]
  })
  .bundle()
  .pipe(fs.createWriteStream("./src/adminer/public/dist.js"));

}

function build_css() {
  return src('./src/adminer/public/css/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./src/adminer/public/css'));
}

exports.css = build_css;
exports.js = build_js;
exports.default = series(build_js , build_css);