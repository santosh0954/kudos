const { src, dest, parallel, series, watch } = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("node-sass"));
const zip = require("gulp-zip");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const fs = require("fs");
const purge = require("gulp-purgecss");

const jsLiabrary = [
  "./node_modules/jquery/dist/jquery.min.js",
  "./node_modules/popper.js/dist/umd/popper.min.js",
  "./node_modules/bootstrap/dist/js/bootstrap.min.js",
];

function move(from, to) {
  return src(from).pipe(dest(to));
}

function setup() {
  console.log("Setup task running...");
  return move("./node_modules/font-awesome/fonts/**/**", "./src/fonts/");
}
function style() {
  console.log("Style task running...");
  return src("./scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer(["last 99 versions"] || "> 1%", "ie 10"))
    .pipe(sourcemaps.write("./map"))
    .pipe(dest("./src/css/"))
    .pipe(browserSync.stream());
}

function js() {
  console.log("js task running...");
  return src(jsLiabrary)
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("./map"))
    .pipe(dest("./src/js/"));
}

function watcher() {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
  });
  watch("./scss/**/*.scss", style);
  watch("./js/**/*.js", js);
  watch("./src/*.html").on("change", browserSync.reload);
}

function build() {
  console.log("Build task running...");
  if (fs.existsSync("./public")) {
    src("./public/").pipe(clean());
  }
  src("./src/**/*.css", { allowEmpty: true })
    .pipe(purge({ content: ["src/**/*.{html,js}"] }))
    .pipe(dest("./public/"));

  return src("./src/**/*.{html,js,jpeg,jpg,png,gif,svg}", { allowEmpty: true })
    .pipe(dest("./public/"))
    .pipe(src("./public/", { allowEmpty: true }))
    .pipe(zip("public.zip"))
    .pipe(dest("./"));
}

exports.setup = setup;
exports.style = style;
exports.js = js;
exports.build = build;
exports.default = function () {
  return parallel(style, js, watcher);
};
