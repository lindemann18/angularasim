module.exports = function(grunt){
	grunt.initConfig({
			pkg:grunt.file.readJSON('package.json'),
		watch:{
			sass:{
				files:['sass/*scss'],
				tasks:['sass']
			}
		},
		sass:{
			options:{
				style:"compact"
			},
			dist:{
				files:{
					'css/asim.css':"sass/asimstyle.scss"
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask("default",['watch']);
	grunt.registerTask("development",['sass']);
}