/* Routes */
(function() {
	'use strict';

	angular
		.module('app.user')
		.config(config);

	//config
	function config($stateProvider, $urlRouterProvider) {
		// admin
		$stateProvider
			.state('user', {
				url: '/user',
				abstract: true,
				views: {
					"default": {
						templateUrl: "app/user/shell.html"
					}
				}
			})
			.state('user.dashboard', {
				url: '/dashboard',
				views: {
					"view": {
						templateUrl: "app/user/dashboard.html"
					}
				}
			})
			.state('user.report', {
				url: '/report',
				views: {
					"view": {
						templateUrl: "app/user/open-po-report.html"
					}
				}
			})
			.state('user.calendar', {
				url: '/calendar',
				views: {
					"view": {
						templateUrl: "app/user/calendar-view.html"
					}
				}
			})
			.state('user.materials', {
				url: '/materials',
				views: {
					"view": {
						templateUrl: "app/user/materials-suppliers-list.html"
					}
				}
			})
	}

})();
