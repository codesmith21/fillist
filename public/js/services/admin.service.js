angular.module('admin.services', []).service('AdminService', ['$http', function ($http) {

    this.saveInstrumentPosition = function (reqData) {
        return $http.post('/saveInstrumentPosition', reqData);
    };

    this.processFile = function (reqData) {
        return $http.post('/processFile', reqData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

}]);