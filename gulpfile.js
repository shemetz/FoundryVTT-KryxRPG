const gulp = require('gulp');
const less = require('gulp-less');

/* ----------------------------------------- */
/*  Compile LESS
/* ----------------------------------------- */

const KRYX_RPG_LESS = ["less/*.less"];
function compileLESS() {
  return gulp.src("less/kryx_rpg.less")
    .pipe(less())
    .pipe(gulp.dest("./"))
}
const css = gulp.series(compileLESS);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(KRYX_RPG_LESS, css);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
  gulp.parallel(css),
  watchUpdates
);
exports.css = css;
