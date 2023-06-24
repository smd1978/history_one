const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');


// Таск для сборки HTML из шаблонов
gulp.task('html', function(callback) {
	return gulp.src('./app/html/*.html')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'HTML include',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( fileinclude({ prefix: '@@' }) )
		.pipe( gulp.dest('./app/') )
	callback(); 
});

// Таск для обработки SCSS
gulp.task('scss', function(callback){
        return gulp.src('./app/scss/main.scss')
        .pipe( plumber({
            errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
        }))
        .pipe(sourcemaps.init() )
            .pipe( sass() )
            .pipe( autoprefixer({
                overrideBrowserslist: ['last 4 versions']
            }) )
            .pipe(sourcemaps.write() )
            .pipe(gulp.dest('./app/css/'))
    callback();
});

// Таск слежения за изменениями 
gulp.task('watch', function(){
    watch(['./app/*.html','./app/css/**/*.css'], gulp.parallel(browserSync.reload));
    watch('./app/scss/**/*.scss', gulp.parallel('scss'));
    watch('./app/html/**/*.html', gulp.parallel('html'));
});

// Таск сервера для автообновления страниц
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    })
});
// Таск запуска всего проекта
gulp.task('default', gulp.parallel('watch','server','scss','html'));