module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        src:        'js/src/app.js',
        dest:       'js/build/bundle.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/build/bundle.js',
        dest: 'js/build/bundle.min.js'
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['css/*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, src: ['index.html'], dest: 'dist/', filter: 'isFile'},
          {expand: true, src: ['js/build/*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, src: ['js/vendor/**'], dest: 'dist/', filter: 'isFile'}
        ]
      }
    },
    watch: {
      scripts: {
        files: ['js/src/**/*.js'],
        tasks: ['browserify', 'uglify']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['browserify','uglify','copy']);

};
