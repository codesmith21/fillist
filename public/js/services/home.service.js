angular.module('home.services', []).service('HomeService', ['$http', function($http) {

    this.getAllInstruments = function () {
        return $http.get('/showAll');
    };
    this.getInstrumentPosition = function (id) {
        return $http.get('/instrument/'+id);
    };

}]);