//*************  NODE NEEDS ***************//
//  npm install express --save
//  npm install pg --save
//  npm install body-parser --save
//  npm install path --save
//
//***********   VENDOR NEEDS ***************//
//  npm install bootstrap --save
//  npm install jquery --save
//
//***********   GRUNT NEEDS ***************//
//  npm install grunt --save
//  npm install grunt-contrib-copy --save
//  npm install grunt-contrib-uglify --save
//  npm install grunt-contrib-jshint --save
//  npm install grunt-contrib-watch --save
//
//***********   GRUNT USES  ***************//
//  vendors:  jquery, bootstrap
//  client/app.js
//
//

module.exports = function(grunt){
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'client/app.js',
        dest: 'server/public/assets/scripts/app.min.js'
      }
    },
    jshint:{
      files:'client/app.js'
    },
    watch: {
      scripts:{
        files:'client/app.js',
        tasks: ['jshint', 'uglify'],
        options:{
          spawn: false
        }
      }
    },
    copy: {
      // main: {
      //   expand: true,
      //   cwd: "node_modules",
      //   src: [
      //     "jquery/dist/jquery.min.js",
      //   ],
      //   dest: "server/public/vendors/"
      // },
      jQuery: {
        expand: true,
        cwd: "node_modules/jquery/dist/",
        src: [
          "jquery.min.js",
        ],
        dest: "server/public/vendors/jquery"
      },
      bootstrap: {
        expand: true,
        cwd: "node_modules/bootstrap/dist/css/",
        src: [
          "bootstrap.min.css",
          "bootstrap.min.css.map"
        ],
        dest: "server/public/vendors/bootstrap"
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['copy','uglify','jshint']);

}
