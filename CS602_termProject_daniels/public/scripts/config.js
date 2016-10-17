require.config({
	baseUrl: '/scripts/',

	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'backbone': '../bower_components/backbone/backbone-min',
		'underscore': '../bower_components/underscore/underscore-min',
		'handlebars': '../bower_components/handlebars/handlebars.amd.min',
		'json3': '../bower_components/json3/lib/json3.min',
		'es5-shim': '../bower_components/es5-shim/es5-shim.min',
		'es6-shim': '../bower_components/es6-shim/es6-shim.min',
		'base': 'libs/base',
		'util': 'libs/utilities'
	},

	'shim': {
		'es6-shim': {
			'deps': ['es5-shim']
		},
		'jquery': {
			'deps': ['es6-shim', 'json3'],
			'exports': '$'
		},
		'backbone': {
			'deps': ['jquery', 'underscore', 'handlebars'],
			'exports': 'Backbone'
		},
		'handlebars': {
			'exports': 'Handlebars'
		},
		'underscore': {
			'exports': '_'
		},
		'base': {
			'deps': ['backbone', 'jquery', 'handlebars']
		},
		'util': {
			'deps': ['jquery', 'underscore'],
			'exports': 'UTIL'
		}
	}
});
