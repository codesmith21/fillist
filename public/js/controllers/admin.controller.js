var adminModule = angular.module('admin', []);

adminModule.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

adminModule.controller('AdminController', function ($scope, AdminService) {

	$scope.form1 = {};
	$scope.saveResponse = {};

	$scope.saveLineData = function () {
		if ($scope.form1.lineText) {
			AdminService.saveInstrumentPosition({ "record": $scope.form1.lineText }).then(function (response) {
				$scope.saveResponse.message = response.data.message;
				$scope.saveResponse.status = "OK";
			}, function (error) {
				$scope.saveResponse.message = error.data.message;
				$scope.saveResponse.status = "ERROR";
			});
		} else {
			alert("Please enter line in the text area");
			$scope.saveResponse = {};
		}
	}

	$scope.saveFile = function () {
		if ($scope.file) {
			var fd = new FormData();
			fd.append("file", $scope.file);
			AdminService.processFile(fd).then(function (response) {
				$scope.saveResponse2 = response.data;
			}, function (error) {
				$scope.saveResponse2 = error.data;
			});
		} else {
			alert("Please select fillist file");
			$scope.saveResponse2 = null;
			$scope.file = null;
			document.getElementById("save-file").onreset();	
		}
	}
});