const gulp = require('gulp')
//var extender = require('gulp-html-extend')  //Make it easy to extend, include and replace your html files
const runSequence = require('gulp-run-sequence'); 
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const moment = require('moment');
const minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');                              //Babel是一个广泛使用的ES6转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。
const source_path = './dev';     //开发环境
const temp_path = './temp';  //暂存环境
const dist_path = './dist';    //测试环境
const production_path = './production';    //测试环境
const watchSourceFiles = [
    source_path + '/*.html',
    source_path + '/static/script/*.js',
    source_path + '/static/css/*.css',
    source_path + '/static/widget/**/*.js',
    source_path + '/static/widget/**/*.html',
    source_path + '/static/widget/**/*.css',
]
const watchOutputFiles = [
    temp_path + '/*.html',
    temp_path + '/static/script/*.js',
    temp_path + '/static/css/*.css',
    temp_path + '/static/widget/**/*.js',
    temp_path + '/static/widget/**/*.html',
    temp_path + '/static/widget/**/*.css',
]

//var api_host = "http://172.20.0.119:8080/dsp-op"; //测试专用
//var api_host = 'http://172.20.80.192:8888'; //海船本地环境
//var api_host = 'http://172.20.0.39:8081/dsp-op'; //统一测试环境
const dev_api_host = 'http://172.20.0.39:8080/dsp-op';    //测试环境-my
const pro_api_host = 'http://primemanager.yeahmobi.com/dsp-op';    //线上
function htmlminOptions () {
    var options = {
        collapseBooleanAttributes:true,
        collapseWhitespace:true,
        decodeEntities:true,
        html5:true,
        minifyCSS:true,
        minifyJS:true,
        collapseBooleanAttributes:true,
        collapseWhitespace:true,
        decodeEntities:true,
        html5:true,
        minifyCSS:true,
        minifyJS:true,
        processConditionalComments:true,
        removeAttributeQuotes:true,
        removeComments:true,
        removeEmptyAttributes:false,
        removeOptionalTags:true,
        removeRedundantAttributes:true,
        removeScriptTypeAttributes:false,
        removeStyleLinkTypeAttributes:false,
        removeTagWhitespace:false,
        sortAttributes:true,
        sortClassName:true,
        useShortDoctype:true,
        collapseWhitespace: true
    }
    return options;
}

//elaine copy all html,css&js to output(暂存文件)
gulp.task('extend-temp', function () {
    gulp.src([source_path + '/**/*.*'])
        .pipe(gulp.dest(temp_path))
})

//elaine copy all html,css&js(编译ES6) to dist(测试文件)
gulp.task('extend-dist', function () {
    gulp.src([temp_path + '/static/script/*.js', '!' +　temp_path + '/static/script/common.js'])
        .pipe(babel({
            presets: ['es2015'],
            comments:false,
            babelrc:false,
            ast:false
        })) 
        .pipe(gulp.dest(dist_path + '/static/script/'))
    
    gulp.src(temp_path + '/static/widget/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        })) 
        .pipe(gulp.dest(dist_path + '/static/widget'))

    gulp.src([temp_path + '/**/*.*', 
        '!' + temp_path + '/static/script/*.js', 
        '!' + temp_path + '/static/widget/**/*.js'])
       .pipe(gulp.dest(dist_path))

    //修改测试环境api_host
    gulp.src([temp_path + '/static/script/common.js'])
        .pipe(babel({
            presets: ['es2015']
        })) 
        .pipe(replace('{api_host}', dev_api_host))
        .pipe(gulp.dest(dist_path + '/static/script/'))
   
})

//elaine 打包到测试环境
gulp.task('watch', ['extend-temp'], function () {
    gulp.watch(watchOutputFiles, ['extend-dist'])
    gulp.watch(watchSourceFiles, ['extend-temp'])
})

//copy & minify html
gulp.task('minifyHtml', function() {
    console.log('minifyHtml');
    gulp.src([temp_path + '/static/widget/**/*.html'])
        .pipe(htmlmin(htmlminOptions()))
		.pipe(gulp.dest(production_path + '/static/widget'))


    gulp.src([temp_path + '/*.html', 
        '!' + temp_path + '/index.html'])
        .pipe(htmlmin(htmlminOptions()))
        .pipe(gulp.dest(production_path))
})

//copy & minify all custormer css
gulp.task("cssMin", function() {
    console.log('cssMin');
	gulp.src([temp_path + '/static/css/*.css'])
		.pipe(minifyCss())
		.pipe(gulp.dest(production_path + '/static/css'))

    gulp.src([temp_path + '/static/widget/**/*.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest(production_path + '/static/widget/'))
	
})

//copy & uglify all js
gulp.task("uglifyJS", function() {
    console.log('uglifyJS');
	gulp.src([temp_path + '/static/script/*.js','!' + temp_path + '/static/script/common.js'])
		.pipe(babel({
			presets: ['es2015']
		}))	
		.pipe(uglify())
		.pipe(gulp.dest(production_path+ '/static/script/'))
	
    gulp.src(temp_path + '/static/widget/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))	
		.pipe(uglify())
		.pipe(gulp.dest(production_path + '/static/widget'))
})

//copy other files
gulp.task("copyOtherFiles", function() {
    console.log('copyOtherFiles');
    gulp.src([
    		temp_path + '/**/*.*', 
    		'!' + temp_path + '/static/css/*.css', 
    		'!' + temp_path + '/static/script/*.js',
    		'!' + temp_path + '/static/widget/**/*.js',
            '!' + temp_path + '/static/widget/**/*.css',
    		'!' + temp_path + '/*.html',
    		'!' + temp_path + '/static/widget/**/*.html'
    	])
        .pipe(gulp.dest(production_path))
})


//发布到线上，增加版本信息，修改api_host
gulp.task("pro_env", function() {
    var hash = moment().format('YYYYMMDDHHmmss');
    gulp.src([temp_path + '/index.html'])
        .pipe(replace('<!-- hash -->', '<meta content="hash:'+ hash +'" />'))
        .pipe(htmlmin(htmlminOptions()))
        .pipe(gulp.dest(production_path))


    gulp.src([temp_path + '/static/script/common.js'])
        .pipe(replace('{api_host}', pro_api_host))
        .pipe(babel({
            presets: ['es2015']
        })) 
        .pipe(uglify())
        .pipe(gulp.dest(production_path + '/static/script/'))
})

//elaine 打包到正式环境
gulp.task('extend-pro' , ['extend-temp', 'cssMin', 'uglifyJS', 'copyOtherFiles', 'minifyHtml'], function () {
})

//打包到正式环境
gulp.task('default', ['extend-pro', 'pro_env'], function () {
    var hash = moment().format('YYYYMMDDHHmmss');
	console.log('hash:' + hash);
})