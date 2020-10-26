const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const pug = require('gulp-pug')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const webphtml = require('gulp-webp-html')
const webpcss = require('gulp-webp-css')
const sync = require('browser-sync').create()
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const ttf2svg = require('gulp-ttf-svg')
const fonter = require('gulp-fonter')

let fs = require('fs')

let path = {
    build: {
        fonts: 'src/fonts/'
    }
}


function html() {
    return src('src/**.pug')
        .pipe(pug())
        .pipe(webphtml())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

async function fontsStyle(params) {
    let file_content = fs.readFileSync('src/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile('src/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile('src/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {

}


function otf2ttf() {
    return src('src/fonts/**.otf')
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest('../src/fonts'))
}

function fonts (params) {
    src('src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
    src('src/fonts/**.ttf')
        .pipe(ttf2svg())
        .pipe(dest('dist/fonts'))
    return src('src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))

}

function js() {
    return src('src/js/**.js')
        .pipe(concat('index.min.js'))
        .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(csso())
        .pipe(webpcss())
        .pipe(csso())
        .pipe(concat('style.css'))
        .pipe(dest('dist'))
}

function images() {
    return src('src/images/**.*')
        .pipe(
            webp({
                quality: 90
            })
        )
        .pipe(dest('dist/img'))
        .pipe(src('src/images/**.*'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeVievBox: false}],
            interlaced: true,
            optimizationLevel: 1 //0 to 7
        }))
        .pipe(dest('dist/img'))
}

function clear() {
    return del('dist')
}

function serve() {
    sync.init({
        server: './dist'
    })

    watch('src/**.pug', series(html)).on('change', sync.reload)
    watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
    watch('src/js/**.js', series(js)).on('change', sync.reload)
}

exports.serve = series(clear, scss, html, js, images, otf2ttf, fonts, fontsStyle, serve)