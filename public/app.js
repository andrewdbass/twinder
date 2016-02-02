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

	$scope.login = function() {
		authFactory.login().then(function() {
			console.log("done")
		})
	}
	$scope.logout = authFactory.logout;

	$scope.twitterResult = {};

	$scope.timelineArray = [];

	var getTimeline = function(){
		$http.get('/api/getTweets').then(function(data) {
			$scope.timelineArray = data.data;
		}, function(err) {
			$scope.timeline = err;
		})	
	}
	
	

});

app.factory('authFactory', function($timeout,$http){
	var service = {};
	
	service.ref = new Firebase("https://twinder.firebaseio.com");
	var userData = {};
	service.login = function(){
		service.ref.authWithOAuthPopup("twitter",function(error, authData) {
			return $http.post('/api/tokens?accesToken='+authData.twitter.accessToken+'&accessTokenSecret=321'+authData.twitter.accessTokenSecret).success()
		});
		
	}
	service.logout = function() {
		service.ref.unauth();
	};
	service.userData = function(){
		return service.ref.getAuth();
	}
	return service;
});