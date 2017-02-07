module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        run: {
            application: {
                cmd: "ember",
                args: [
                    "build",
                    "-prod"
                ]
            }
        },

        easy_rpm: {
            options: {                
                summary: "unfetter-discover-ui",
                group: "Applications",
                license: "Apache-2.0",
                vendor: "unfetter",
                release: 1,
                buildArch: "noarch",
                tempDir: "target/build",
                rpmDestination: "target/rpm"
            },
            application: {
                files: [                    
                    {
                        src: [
                            "**/*"
                        ],
                        dest: "/usr/share/unfetter-discover-ui",
                        cwd: "dist"
                    }, {
                        src: [
                            "."
                        ],
                        cwd: "dist",
                        dir: true,
                        dest: "/usr/share/unfetter-discover-ui"
                    }
                ],
                excludeFiles: [
                    "tests/**",
                    "testem.js"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-run");
    grunt.loadNpmTasks("grunt-easy-rpm");

    grunt.registerTask("default", [ "run", "easy_rpm" ]);
};