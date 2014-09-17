/**
 * Created by leiting on 14/9/13.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            slidebar: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'config/config.js','js/utils/utils.js','js/slidebar/slidebardata.js','js/slidebar/slidebaritem.js','js/slidebar/slidebar.js'
                ],
                dest: 'dist/dashboard.debug.js'
            },
            chartsetting: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'js/chartsetting/runSetting.js'
                ],
                dest: 'dist/chartsetting.debug.js'
            },
            chartview: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n'
                },
                src: [
                    'config/config.js','js/utils/utils.js','js/chartview/chartdata.js','js/chartview/chartinstance.js','js/chartview/chartview.js'
                ],
                dest: 'dist/chartview.debug.js'
            }
        }
});

grunt.loadNpmTasks('grunt-contrib-concat');

grunt.registerTask('default', ['concat']);
};