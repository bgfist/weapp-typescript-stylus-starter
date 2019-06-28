const path = require("path")
const gulp = require("gulp")
const replace = require("gulp-replace")

const miniprogram_npm_path = path.resolve(__dirname, "../src/miniprogram_npm")

function fixNpm(done) {
  console.log(miniprogram_npm_path)

  gulp
    .src("*/*.js", {
      cwd: miniprogram_npm_path
    })
    .pipe(replace("process.env.NODE_ENV", '"development"'))
    .pipe(gulp.dest(miniprogram_npm_path))
  done()
}

module.exports = {
  fixNpm: fixNpm
}
