var path = require('path');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        express: {
			custom: {
				options: {
					server: path.resolve('./app.js'),
					port: 1337
				}
			}
        }
	});

	grunt.loadNpmTasks('grunt-express');
	grunt.registerTask('default', ['express']);
};
