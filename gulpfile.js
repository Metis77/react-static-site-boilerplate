var gulp    		= require("gulp");
var gutil 			= require("gulp-util");
var webpack 		= require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig 	= require("./webpack.config.js");

var sass 			= require('gulp-sass');
var sourcemaps 		= require('gulp-sourcemaps');
var autoprefixer 	= require('gulp-autoprefixer');

var livereload    	= require('gulp-livereload');

var app   = './app/';
var dist  = './dist/';


// The development server (the recommended option for development)
// gulp.task("default", ["watch"]);
gulp.task('default', function() {
    gulp.start('watch');
});


/**
 *  SASS
 *  https://github.com/sindresorhus/gulp-autoprefixer/issues/8
 */
gulp.task('sass', function () {
    return gulp.src(app + 'styles/main.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(autoprefixer(
            	{
            		browsers: [
                        '> 1%',
                        'last 2 versions',
                        'firefox >= 4',
                        'safari 7',
                        'safari 8',
                        'IE 8',
                        'IE 9',
                        'IE 10',
                        'IE 11'
                    ],
            	}
            ))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + 'assets/css/'))
        .pipe(livereload());
});









/**
 *   Webpack
 */

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin()
		,new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});



// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);




gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback( livereload.reload() );
	});

});










/**
 *  WATCH
 */
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(app + 'styles/main.scss', ['sass']);
  gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});






