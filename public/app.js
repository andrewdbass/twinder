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
		authFactory.login().then()
		
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

app.factory('authFactory', function($timeout,$http,$q){
	var service = {};
	
	service.ref = new Firebase("https://twinder.firebaseio.com");
	service.login = function(){
		
		service.ref.authWithOAuthPopup("twitter",function(error, authData) {
			if(error) 
			else{
				return $http.post('/api/tokens?accesToken='+authData.twitter.accessToken+'&accessTokenSecret=321'+authData.twitter.accessTokenSecret)
			}
			
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