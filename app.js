var app = angular.module('twinder', ["firebase", 'ngResource']);

app.controller('LoginController', function( $scope, $window, $timeout, $http, $q, $resource, authFactory){
	var ref = new Firebase("https://twinder.firebaseio.com");
	$scope.userData = authFactory.userData();
	
	//listener for change in auth
	authFactory.ref.onAuth(function(authData) {
		$scope.userData = authData;
		//this next part makes the data auto load
		$timeout(function() {
	       $scope.$apply();
	    }, 500);				
	});

	$scope.login = authFactory.login;
	$scope.logout = authFactory.logout;

	

});

app.factory('authFactory', function($timeout){
	var service = {};
	
	service.ref = new Firebase("https://twinder.firebaseio.com");
	var userData = {};
	service.login = function(){
		service.ref.authWithOAuthPopup("twitter",function(error, authData) {});
	}
	service.logout = function() {
		service.ref.unauth();
	};
	service.userData = function(){
		return service.ref.getAuth();
	}
	return service;
});