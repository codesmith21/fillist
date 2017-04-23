angular.module('fillist.routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})
		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'AdminController'
		});

	$locationProvider.html5Mode(true);

}]);