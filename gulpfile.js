import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp';

const paths = {
  images: {
    src: [
      './src/assets/image/**/*.webp',
      './src/assets/image/images/*.webp',
    ],
    dest: 'src/assets/optimized/',
  },
};


function optimizeImages() {
  return gulp
    .src(paths.images.src)
    .pipe(
      imagemin([
        imageminWebp({
          quality: 75,
          method: 6,
        }),
      ])
    )
    .pipe(gulp.dest(paths.images.dest));
}


export default optimizeImages;
