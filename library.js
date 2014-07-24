(function(Flipkart) {
	var pjson = require('./package.json'),
		Settings = module.parent.require('./settings'),
		AdminSockets = module.parent.require('./socket.io/admin').plugins,
		url = require('url');

	var Config = {
		plugin: {
			name: 'Flipkart',
			id: 'flipkart',
			version: pjson.version,
			description: pjson.description,
			icon: 'fa-shopping-cart',
			route: '/flipkart'
		},
		defaults: {
			affiliateID: ''
		},
		sockets: {
			sync: function() {
				Config.global.sync();
			}
		}
	};

	Config.global = new Settings(Config.plugin.id, Config.plugin.version, Config.defaults);

	Flipkart.load = function(app, middleware, controllers, callback) {
		function renderAdmin(req, res, next) {
			res.render('flipkart/admin', {});
		}

		app.get('/admin' + Config.plugin.route, middleware.admin.buildHeader, renderAdmin);
		app.get('/api/admin' + Config.plugin.route, renderAdmin);

		AdminSockets.flipkart = Config.sockets;

		//callback();
	};

	Flipkart.addNavigation = function(custom_header, callback) {
		custom_header.plugins.push({
			route: Config.plugin.route,
			icon: Config.plugin.icon,
			name: Config.plugin.name
		});

		callback(null, custom_header);
	};

	Flipkart.parse = function(postContent, callback) {
		var regex = /(?:https?:\/\/)?(?:www\.)?(?:flipkart\.com)(?:\S*)?/g,
			match = postContent.match(regex),
			sep,
			urlObj;

		if (match) {
			urlObj = url.parse(match[0], true);

			urlObj.query.affid = Config.global.get('affiliateID');
			urlObj.search = '';

			postContent = postContent.replace(regex, url.format(urlObj));
		}

		callback(null, postContent);
	};

})(module.exports);