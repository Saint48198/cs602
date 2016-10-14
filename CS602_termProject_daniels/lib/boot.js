const express = require('express');;
const fs = require('fs');

module.exports = (parent, options) => {
	"use strict";

	let verbose = options.verbose;

	fs.readdirSync(__dirname + '/../controllers').forEach((file) => {
		verbose && console.log('\n   %s:', file);
		const app = express();
		const obj = require('./../controllers/' + file);
		const prefix = obj.prefix || '';
		const name = obj.name || file;

		let handler;
		let method;
		let path;

		// allow specifying the view engine
		if (obj.engine) {
			app.set('view engine', obj.engine);
		}
		app.set('views', __dirname + '/../controllers/' + name + '/views');

		// generate routes based
		// on the exported methods
		for (let key in obj) {
			// "reserved" exports
			if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) {
				continue;
			}

			switch (key) {
				case 'index':
					method = 'get';
					path = '/';
					break;
				case 'session':
					method = 'get';
					path = '/' + name;
					break;
				case 'logout':
					method = 'get';
					path = '/' + key;
					break;
				case 'list':
					method = 'get';
					path = '/' + name + 's';
					break;
				case 'create':
					method = 'post';
					path = '/' + name;
					break;
				case 'auth':
					method = 'post';
					path = '/' + key;
					break;
				case 'show':
					method = 'get';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'updateAddTeacher':
					method = 'post';
					path = '/' + name + '/:' + name + '_id/add_teacher';
					break;
				default:
					throw new Error('unrecognized route: ' + name + '.' + key);
			}

			/*// route exports
			switch (key) {
				case 'show':
					method = 'get';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'list':
					method = 'get';
					path = '/' + name + 's';
					break;
				case 'edit':
					method = 'get';
					path = '/' + name + '/:' + name + '_id/edit';
					break;
				case 'update':
					method = 'put';
					path = '/' + name + '/:' + name + '_id';
					break;
				case 'create':
					method = 'post';
					path = '/' + name;
					break;
				case 'index':
					method = 'get';
					path = '/';
					break;
				default:
					/!* istanbul ignore next *!/
					throw new Error('unrecognized route: ' + name + '.' + key);
			}*/

			// setup
			handler = obj[key];
			path = prefix + path;

			// before middleware support
			if (obj.before) {
				app[method](path, obj.before, handler);
				verbose && console.log('     %s %s -> before -> %s', method.toUpperCase(), path, key);
			} else {
				app[method](path, handler);
				verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
			}
		}

		// mount the app
		parent.use(app);
	});
};