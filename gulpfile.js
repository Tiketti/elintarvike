var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

gulp.task('watch',function() {
    gulp.watch('sass/**/*.scss',['styles']);
    console.log('watching /sass/*.scss for changes');
});
