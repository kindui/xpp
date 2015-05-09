module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            base: {
                options: {
//                    banner: '/* <%= pkg.name || pk.title %> - v<%= pkg.version %> - <%= pkg.homepage  %> - <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %>*/\n'
                },
                src: [
                    "src/1-head.js",
                    "src/2-class.js",
                    "src/3-common.js",
                    "src/4-widget.js",
                    "src/5-app.js",
                    "src/6-foot.js"
                ],
                dest: 'dist/xpp.js'
            }
        },
        uglify: {
            task1: {
                options: {
                    banner: '/*<%= pkg.author %>|<%= grunt.template.today("yyyy-mm-dd")%>*/\n'
                },
                files: {
                    'dist/xpp.min.js': ['dist/xpp.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        }
//        jsdoc : {
//            widget : {
//                src: [
//                    'widget/animate/animate2.0.js'
//                    //                    'widget/*/*.js'
//
//                ],
//                options: {
//                    destination: 'doc'
//                }
//            }
//
//        }
    });
    //自定义任务
    //自动给文件添加版本号和修改时间
    function writeVersion(filepath){
        var version = grunt.config("pkg.version");
        var released = grunt.template.today("yyyy-mm-dd");
        var code = grunt.file.read(filepath);
        code = code.replace(/@VERSION/g, version);
        code = code.replace(/@RELEASED/g, released);
        grunt.file.write(filepath, code);
    }
    function wrapCode(filepath){
        var code = grunt.file.read(filepath);
        code = '(function (window) {\n' + code + '\n})(window);';
        grunt.file.write(filepath, code);
    }
    grunt.registerTask("post-concat", function () {
        writeVersion('dist/xpp.js');
        wrapCode('dist/xpp.js');
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
//    grunt.loadNpmTasks('grunt-jsdoc');
    //子任务
//    grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);
    grunt.registerTask("default", ["concat", "post-concat", "uglify","watch"]);

};