var app = angular.module('twinder', ["firebase", 'ngResource']);

app.controller('AppController', function( $scope, $window, $timeout, $http, $q, $resource, $firebaseArray, authFactory){
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

	$scope.login = function() {
		authFactory.login().then(function(data){$scope.getTimeline()})	
	}

	$scope.logout = authFactory.logout;

	$scope.timelineArray = [];

	$scope.getTimeline = function(){
		debugger
		$http.get('/api/getTweets').then(function(data) {
			$scope.timelineArray = data.data;
		}, function(err) {})	
	}
});

app.factory('authFactory', function($timeout,$http,$q){
	var service = {};
	
	service.ref = new Firebase("https://twinder.firebaseio.com");
	service.login = function(){
		var defd = $q.defer();
		service.ref.authWithOAuthPopup("twitter",function(error, authData) {
			 $http.post('/api/tokens?accessToken='+authData.twitter.accessToken+'&accessTokenSecret='+authData.twitter.accessTokenSecret).then(function(data){
			 	defd.resolve(data)
			 }, function(val){
			 	defd.reject(val)
			 })
			
		})
		return defd.promise
	}
	service.logout = function() {
		service.ref.unauth();
	};
	service.userData = function(){
		return service.ref.getAuth();
	}
	return service;
});