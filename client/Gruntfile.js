module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadTasks('./tasks');

    grunt.initConfig({

        clean: [
            "../server/public/kiwoticum.min.js",
            "../server/public/kiwoticum.css",
            "../server/public/kiwoticum.html",
            ".tmp"
        ],

        texturepacker: {
            dist: {
                targetdir: '../server/public/gfx',
                dirs: [
                    'app/assets/gfx/tileset1'
                ]
            }
        },

        browserify: {
            kiwoticum: {
                src: [
                    'app/scripts/kiwoticum.js',
                    'app/scripts/kiwoticum/**/*.js',
                    'app/scripts/kiwoticum/**/*.coffee'
                ],
                dest: '.tmp/scripts/kiwoticum.js',
                options: {
                    transform: ['coffeeify']
                }
            },
            papa: {
                src: 'app/scripts/papa.js',
                dest: '.tmp/scripts/papa.js',
                options: {
                    transform: ['coffeeify'],
                    standalone: "papa"
                }
            }
        },

        uglify: {
            //options: {
            //},
            kiwoticum: {
                files: {
                    '../server/public/kiwoticum.min.js': [
                        'app/vendor/scripts/*.js',
                        '.tmp/scripts/papa.js',
                        '.tmp/scripts/kiwoticum.js'
                    ]
                }
            }
        },

        less: {
            dist: {
                options: {
                    paths: ["app/styles"],
                    cleancss: true,
                    compress: true,
                    ieCompat: false
                },
                files: {
                    "../server/public/kiwoticum.css": "app/styles/kiwoticum.less"
                }
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 8000,
                    base: '../server/public'
                }
            }
        },

        watch: {
            files: ['app/**/*'],
            tasks: ['build']
        },

        jade: {
            compile: {
                options: {
                    data: function(dest, src) {
                        return require('package.json');
                    }
                },
                files: {
                    "../server/public/kiwoticum.html": ["app/views/kiwoticum.jade"],
                }
            }
        } //,

        //'gh-pages': {
            //options: {
                //base: 'public'
            //},
            //src: '**/*'
        //}
    });

    grunt.registerTask('build', [/*'texturepacker',*/ 'browserify', 'uglify', 'less', 'jade']);
    grunt.registerTask('serve', ['connect', 'watch']);
    //grunt.registerTask('publish', ['build', 'gh-pages']);

    grunt.registerTask('default', ['build', 'serve']);
};
