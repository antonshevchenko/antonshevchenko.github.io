---
title: Make Multiple Versions of Your App with Grunt
cover: http://distilleryimage3.ak.instagram.com/a9f01810fdf611e2bdcf22000a1fbe62_7.jpg
description: Use GruntJS to create multiple versions of your project.
layout: post
tags: [grunt, gruntjs, web, tutorial]
---
[Grunt](http://gruntjs.com "Grunt: The JavaScript Task Runner") is a powerful automation tool that lets you run repetitive tasks such as concatenating, minifying and "uglifying" code. But can you use Grunt to automate the process of creating different versions of a single app? You sure can!

####Preamble

I was working on a mobile app for iOS and Android and was tasked with creating different versions of the same base app for different organizations, each having their own logo, app icon, splash screen, styling and configuration.

At first, I wrote a quick code replacement script by using [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy "grunt-contrib-copy repo")'s `process` method and replacing any text using standard JavaScript regex. However, this quickly turned out to be very complex and overall not a clean solution.

That's when I found out about the [grunt-replace](https://github.com/outaTiME/grunt-replace "grunt-replace repo") plugin.

In the next few lines I will be showing how to create your very own script, using some of the greatest Grunt plugins out there, to automatically create different versions of your base app by changing its configuration.

<!--excerpt-->

####Plugins Used

- [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat "grunt-contrib-concat repo")
- [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy "grunt-contrib-copy repo")
- [grunt-replace](https://github.com/outaTiME/grunt-replace "grunt-replace repo")

####Task Flow

It is good to establish a task flow from the start, so you know what each task can expect to be done before it runs.

In this particular case, I wanted to replace placeholders in my code before anything else. Then I would copy files (such as app icons and logos) to their destination directories and finish with a simple concatenation of my CSS and scripts.

Here is the task flow I've established for my `default` task:

```javascript
registerTask('default', ['replace', 'copy', 'concat']);
```

####Defining Placeholders

Grunt-replace uses the `@@foo` syntax to define placeholders. 

Let's say you have a SASS variable declared as `$mainColor`. To change its value dynamically using grunt-replace, you could define a placeholder like so:

```sass
$mainColor: @@color;
```

And in your Gruntfile's `replace` task, you could do this:

```javascript
replace: {
    dist: {
        options: {
            patterns: [
                {
                    match: 'color', // placeholder's name
                    replacement: '#FF1337' // replace with this value
                }
            ]
        },
        files: [
            { 
                expand: true, flatten: true, src: 'path/to/source.file', dest: 'path/to/destination' 
            }
        ]
    }
}
```

For more complex replacements, check out the [documentation.](https://github.com/outaTiME/grunt-replace/blob/master/docs/README.md "grunt-replace repo")

---

<iframe src="https://giphy.com/embed/mEOjrcTumos80" width="100%" height="281" frameBorder="0">
</iframe>

<h4 class="text-center">So far, so good.</h4>

<p class="text-center">Now we need a way to tell our Gruntfile to generate different app versions.</p>

<p class="text-center">This is where command line parameters come in.</p>

---

####Passing Command Line Parameters

Command line parameters will tell us what configuration to apply to our final app.

This is where [grunt options](http://gruntjs.com/api/grunt.option "Grunt option docs") come in handy.

These parameters are passed in the command line like so:

```bash
$ grunt --foo=bar
```

> `foo` is the option name, `bar` the value.

Back in our Gruntfile, add this line (replacing `foo` with an option name you would like to use):

```javascript
var foo = grunt.option('foo');
```

Now you can have access to any command line parameter value passed into `foo` and can use it in your tasks as you deem fit.

####Configuration

This part is a personal choice. I like to have a configuration file with predefined sets of values for each [grunt option](http://gruntjs.com/api/grunt.option "Grunt option docs") that will be sent from the command line. If you think that you don't need such functionality, feel free to skip over this step.

If you are planning to use a configuration file, here is what you could do.

Create a `config.json` file in the root of your project (on the same directory level as the `Gruntfile.js`). Each [grunt option](http://gruntjs.com/api/grunt.option "Grunt option docs") value can be associated with a JSON object containing all the values you would like to be applied throughout your app.

A sample `config.json`:

```json
{
    "foo": {
        "color": "#FF1337"
    },
    "bar": {
        "color": "#ABCDEF1"
    }
}
```

This, in tandem with [grunt-replace](https://github.com/outaTiME/grunt-replace "grunt-replace repo"), will let you easily replace placeholders with predefined values. For example, a parameter of `foo` will mean that the `@@color` placeholder will have a value of `#FF1337`.

####Putting it All Together

By now, you've implemented a way to get parameters (defining which version of your app to create), you've registered and created your tasks, you put placeholders where you would like to change the content of your code and you may or may not have a configuration file to associate values for each parameter you may get.

For reference, here is a complete Gruntfile:

```javascript
module.exports = function(grunt) {

    // Grunt option.
    var organization = grunt.option('organization');

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Import your configuration file (if you created one).
        config: grunt.file.readJSON('config.json'),

        concat: {
            css: {
                src: ['public/css/dist/main.css', '<%= config.vendor.css %>'],
                dest: 'public/css/dist/main.css',
            },
            js: {
                src: ['<%= config.vendor.js %>', '<%= config.app.js %>'],
                dest: 'public/js/dist/main.js',
            },
        },

        replace: {
            prod: {
                options: {
                    patterns: [
                        {
                            match: 'color',
                            replacement: '<%= config.' + organization + '.color %>',
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['public/less/variables.less'],
                        dest: 'public/less/dist',
                    },                                    
                ],
            },        
        },

        copy: {
            prod: {                
                files: [
                    {                        
                        expand: true,
                        flatten: true,
                        src: 'public/img/' + '<%= config.' + organization + '.logo %>',
                        dest: 'public/img/dist',                        
                    },
                ],
            },
        },

    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Register tasks.
    grunt.registerTask('default', ['replace', 'copy', 'concat']);

};
```

And its associated `config.json`:

```json
{
    "app": {
        "css": [
            "public/css/*.css"
        ],
        "js": [
            "public/js/main.js"
        ]
    },
    "vendor": {
        "css": [
            "public/vendor/bootstrap/css/bootstrap.css"
        ],
        "js": [
            "public/vendor/angular/js/angular.js",
            "public/vendor/bootstrap/js/bootstrap.js"
        ]
    },
    "apple": {
        "color": "#FF3B30",
        "logo": "apple-macintosh-logo.png"
    },
    "ibm": {
        "color": "#106AC4",
        "logo": "ibm-8008.jpg"
    }
}
```