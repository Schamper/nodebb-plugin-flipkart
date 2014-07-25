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
			res.render(Config.plugin.id + '/admin', {});
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
		var regex = /(<a href=")((?:https?:\/\/)?(?:www\.)?(?:flipkart\.com)(?:\S*)?)(">)/g,
			match = regex.exec(postContent);

		if (match) {
			var parameter = 'affid',
				urlObj = url.parse(match[2], true);

			urlObj.query[parameter] = Config.global.get('affiliateID');
			urlObj.search = '';

			postContent = postContent.replace(regex, '$1' + url.format(urlObj) + '$3');
		}

		callback(null, postContent);
	};

})(module.exports);