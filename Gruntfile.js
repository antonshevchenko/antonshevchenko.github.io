module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    config: grunt.file.readJSON('config.json'),

    copy: {
      prod: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= config.vendor.fonts %>'],
            dest: 'public/fonts/',
          }          
        ],
      },
    },
    
    concat: {
      css: {
        src: ['<%= config.vendor.css %>', '<%= config.app.css %>'],
        dest: 'public/css/main.css',
      },
      js: {
        src: ['<%= config.vendor.js %>', '<%= config.app.js %>'],
        dest: 'public/js/main.js',
      },
    },

    less: {
      dev: {             
        files: {
          '_public/css/dist/main.css': '_public/css/main.less',
        },
      },      
    },

    watch: {
      css: {
        files: '<%= config.app.less %>',
        tasks: ['default'],
      },
      scripts: {
        files: '<%= config.app.js %>',
        tasks: ['concat'],
      },
    },

  });

  // Load plugins.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register tasks.
  grunt.registerTask('default', ['less', 'concat', 'copy']);

};