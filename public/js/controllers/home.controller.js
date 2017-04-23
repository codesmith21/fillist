angular.module('home', []).controller('HomeController', function($http, $scope, HomeService) {
	
	$scope.form1 = {};
	
	$scope.init = function() {
		HomeService.getAllInstruments().then(function (response) {
			$scope.allInstruments = response.data;
			$scope.allInstruments.error = false;
		}, function(error) {
			$scope.allInstruments.error = true;
			$scope.allInstruments.errorMessage = error.data.message;
		});
	}
	$scope.getPosition = function() {
		if($scope.form1.id) {
			HomeService.getInstrumentPosition($scope.form1.id).then(function (response) {
				$scope.instPos = response.data.position;
			}, function(error) {
				$scope.instPos = error.data.message;
			});
		} else {	
			alert ("Please enter instrument id");
			$scope.instPos = null;
		}
	}
});