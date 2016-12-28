module.exports = function(grunt) {

  var _ = grunt.util._;
  var locales = ["bg", "ca", "cs", "de", "es", "es_AR", "es_CO", "es_EC",
  "es_MX", "fr", "hu", "it", "lo", "lt", "nl", "pt_BR", "ru", "sl", "zh_CN"];
  var jsfiles = [
      'src/sao.js',
      'src/rpc.js',
      'src/pyson.js',
      'src/session.js',
      'src/model.js',
      'src/tab.js',
      'src/screen.js',
      'src/view.js',
      'src/view/form.js',
      'src/view/tree.js',
      'src/view/graph.js',
      'src/view/calendar.js',
      'src/action.js',
      'src/common.js',
      'src/window.js',
      'src/wizard.js',
      'src/board.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    xgettext: {
        locale: {
            files: {
                javascript: jsfiles
            },
            options: {
                functionName: "Sao.i18n.gettext",
                potFile: "locale/messages.pot"
            },
        }
    },
    shell: {
        options: {
            failOnError: true
        },
        msgmerge: {
            command: _.map(locales, function(locale) {
                var po = "locale/" + locale + ".po";
                return "msgmerge -U " + po + " locale/messages.pot;";
            }).join("")
        }
    },
    po2json: {
        options: {
            format: 'raw'
        },
        all: {
            src: ['locale/*.po'],
            dest: 'locale/'
        }
    },
    concat: {
        dist: {
            src: jsfiles,
            dest: 'dist/<%= pkg.name %>.js'
        }
    },
    jshint: {
        dist: {
            options: {
                jshintrc: 'src/.jshintrc'
            },
            src: ['dist/<%= pkg.name %>.js']
        },
        grunt: {
            src: ['Gruntfile.js']
        },
        tests: {
            options: {
                jshintrc: 'tests/.jshintrc'
            },
            src: ['tests/*.js']
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> | GPL-3\n' +
        'This file is part of Tryton.  ' +
        'The COPYRIGHT file at the top level of\n' +
        'this repository contains the full copyright notices ' +
        'and license terms. */\n'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    less: {
        dev: {
            options: {
                paths: ['src', 'bower_components/bootstrap/less']
            },
            files: {
                'dist/sao-coog.css': 'theme/coog/sao-coog.less',
                'dist/<%= pkg.name %>.css': 'src/*.less'
            }
        },
        'default': {
            options: {
                paths: ['src', 'bower_components/bootstrap/less'],
                yuicompress: true
            },
            files: {
                'dist/sao-coog.min.css': 'theme/coog/sao-coog.less',
                'dist/<%= pkg.name %>.min.css': 'src/*.less'
            }
        }
    },
    copy: {
      main: {
        files: [
          { src: 'bower_components/jquery/dist/jquery.min.js', dest: 'dist/js/jquery.min.js' },
          { src: 'bower_components/bootstrap/dist/js/bootstrap.min.js', dest: 'dist/js/bootstrap.min.js' },
          { src: 'bower_components/moment/min/moment.min.js', dest: 'dist/js/moment.min.js' },
          { src: 'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js', dest: 'dist/js/bootstrap-datetimepicker.min.js' },
          { src: 'bower_components/gettext.js/dist/gettext.min.js', dest: 'dist/js/gettext.min.js' },
          { src: 'bower_components/d3/d3.min.js', dest: 'dist/js/d3.min.js' },
          { src: 'bower_components/c3/c3.min.js', dest: 'dist/js/c3.min.js' },
          { src: 'bower_components/bootstrap/dist/css/bootstrap.min.css', dest: 'dist/css/bootstrap.min.css' },
          { src: 'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css', dest: 'dist/css/bootstrap-datetimepicker.min.css' },
          { src: 'bower_components/c3/c3.min.css', dest: 'dist/css/c3.min.css' },
          { expand: true, flatten: true, src: 'bower_components/bootstrap/dist/fonts/*', dest: 'dist/fonts/' },
        ]
      }
    },
    watch: {
        scripts: {
            files: ['src/*.js'],
            tasks: ['concat', 'jshint']
        },
        styles: {
            files: ['src/*.less'],
            tasks: 'less:dev'
        }
    },
    qunit: {
        all: ['tests/*.html']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-xgettext');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-po2json');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task(s).
  grunt.registerTask('default', [
      'concat', 'jshint', 'uglify', 'less', 'po2json', 'copy'
  ]);
  grunt.registerTask('dev', ['concat', 'jshint', 'less:dev']);
  grunt.registerTask('msgmerge', ['shell:msgmerge']);
  grunt.registerTask('test', ['concat', 'jshint', 'less:dev', 'qunit']);

};
