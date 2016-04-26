module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/tileviewer.js',
        dest: 'build/tileviewer.min.js'
      }
    },
    concat: {
      js: {
        src: [
          'js/leaflet-src.js',
          'js/leaflet.functionaltilelayer.js',
          'js/Control.MiniMap.min.js',
          'js/L.Control.CenterCoordinates.js',
          'js/L.Control.MousePosition.js',
          'js/tileviewer.js'
        ],
        dest: 'build/tileviewer.js'
      },
      css: {
        src: 'css/*.css',
        dest: 'build/tileviewer.css'
      }
    },
    watch: {
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['default']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};
