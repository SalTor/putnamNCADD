module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    update: true,
                    trace:  true,
                    loadPath: require('node-bourbon').includePaths,
                    cacheLocation: 'public/assets/css/cache/.sass-cache'
                },
                files: [
                    {'public/assets/css/style.css': 'development/scss/style.scss'}
                ]
            }
        },
        concat: {
            options: { separator: ';\n' },
            dev_libraries: {
                src: [
                    './node_modules/jquery/dist/jquery.min.js',
                    './development/js/libraries/cufon-yui.js',
                    './development/js/libraries/cufon-georgia.js',
                    './development/js/libraries/coin-slider.min.js'
                ],
                dest: './.tmp/js/putnam-ncadd__libraries.js'
            },
            dev_source: {
                src: [
                    'development/js/script.js'
                ],
                dest: './.tmp/js/putnam-ncadd__source.js'
            },
            dev: {
                options: {
                    sourceMap: true,
                    banner: '/*!\n\t================================\n\t   Last built on - <%= grunt.template.today("yyyy-mm-dd") %>\n\t================================\n*/\n\n'
                },
                src: [
                    './.tmp/js/putnam-ncadd__libraries.js',
                    './.tmp/js/putnam-ncadd__source--compiled.js'
                ],
                dest: 'public/assets/js/putnam-ncadd.min.js'
            }
        },
        babel: {
            options: {
                presets: ['es2015']
            },
            release: {
                files: {
                    './.tmp/js/putnam-ncadd__source--compiled.js': './.tmp/js/putnam-ncadd__source.js'
                }
            }
        },
        uglify: {
            options: {
                except: [
                    './.tmp/js/putnam-ncadd__libraries.js'
                ],
                enclose: {},
                sourceMap: true,
                compress: {
                    drop_console: true,
                    unused: true,
                    warnings: true
                }
            },
            release: {
                files: {
                    'public/assets/js/putnam-ncadd.min.js': [
                        './.tmp/js/putnam-ncadd__libraries.js',
                        './.tmp/js/putnam-ncadd__source--compiled.js'
                    ]
                }
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 3 versions']
                    })
                ]
            },
            dist: {
                src: 'public/assets/css/style.css'
            }
        },
        notify: {
            build: {
                options: {
                    title: 'Putnam NCADD Website',
                    message: 'Files have been updated'
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'public/assets/css/style.css',
                        'index.html',
                        '**/*.html',
                        'public/assets/js/putnam-ncadd.min.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: 'public'
                }
            }
        },
        watch: {
            stylesheets: {
                files: ['development/scss/style.scss', 'development/scss/**/*.scss'],
                tasks: ['sass', 'postcss', 'notify']
            },
            templates: {
                files: ['public/*.html', 'public/**/*.html'],
                tasks: ['notify']
            },
            javascript: {
                files: [ 'development/js/script.js' ],
                tasks: ['concat:dev_source', 'babel', 'concat:dev', 'notify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('build',   ['release']);
    grunt.registerTask('default', ['base', 'browserSync', 'watch']);
    grunt.registerTask('base',    ['sass', 'postcss', 'concat:dev_libraries', 'concat:dev_source', 'babel', 'concat:dev', 'notify']);
    grunt.registerTask('release', ['sass', 'postcss', 'concat:dev_libraries', 'concat:dev_source', 'babel', 'uglify', 'notify']);
};
