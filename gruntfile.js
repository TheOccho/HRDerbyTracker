/*
 *
 * responsive Login Register Grunt Build
 * @author paolo
 *
 *
 * */

/*global module:false*/
'use strict';

module.exports = function(grunt) {

    // files that will be built
    var jsFile = "main";
    var lessFile = "startup";

    var path = require('path');
    var util = require('util');
    var requireConfigs = require('./bower_components/bam.requirejs.configs/config');
    var version = grunt.file.readJSON('./bower.json').version;
    var _ = grunt.util._;

    //extend require configs that this section needs for the build script
    requireConfigs = _.merge(requireConfigs, {
        paths: {
            "tpl": "../src/tpl"
        }
    });

    // load configs
    var config = require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), '/node_modules/bam-grunt-tasks/grunt-configs'),
        init: false,
        config: {
            // configs specific to this project
            version: version,
            buildDate : grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT Z"),
            requireConfigs : requireConfigs
        },
        loadGruntTasks: {
            config: require('./node_modules/bam-grunt-tasks/package.json')
        }
    });

    // load BAM grunt tasks
    grunt.loadTasks('./node_modules/bam-grunt-tasks/tasks/common');
    grunt.loadTasks('./node_modules/bam-grunt-tasks/tasks/site');
    grunt.loadTasks('./node_modules/bam-grunt-tasks/tasks/sections');

    // init configs
    grunt.initConfig(config);

    grunt.registerTask('copyToBuildFolder', function() {
        grunt.config.set('copy', {
            build: {
                expand: true,
                cwd: './builds-temp/builds/',
                src: '**',
                flatten: false,
                dest: './builds/'
            },
			templates: {
				expand: true,
                cwd: './src/tpl',
                src: '**',
                flatten: false,
                dest: './builds/'+ version +'/tpl'
			},
            images: {
                expand: true,
                cwd: './images',
                src: '**',
                flatten: false,
                dest: './builds/'+ version +'/images'
            },
            css: {
                expand: true,
                cwd: './css',
                src: '**',
                flatten: false,
                dest: './builds/'+ version +'/css'
            },
            json: {
                expand: true,
                cwd: './json',
                src: '**',
                flatten: false,
                dest: './builds/'+ version +'/json'
            }
        });

        grunt.task.run('copy');
    });

    grunt.registerTask('runAll', function() {
        var jsPath = '../src/js/';
        var releaseDirectory = "builds/" + version + "/";

        grunt.task.run('requirejsBuild:' + jsFile + ':' + jsPath );
        /*grunt.task.run('readMe:./tmp/:' + releaseDirectory +'/scripts/');
        grunt.task.run('uglifyJSFolder:./tmp/scripts/:' + releaseDirectory + '/scripts/');
        grunt.task.run('addBanner:' + releaseDirectory);
        grunt.task.run('copyToBuildFolder');*/

    });

    // default task runner
    grunt.registerTask('default', ['cleanUp:preBuild', 'runAll'/*, 'cleanUp:postBuild'*/]);

};