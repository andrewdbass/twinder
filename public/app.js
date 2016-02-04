var app = angular.module('twinder', ["firebase", 'ngResource']);

app.controller('AppController', function( $scope, $window, $timeout, $http, $q, $resource, $firebaseArray, authFactory){
	var ref = new Firebase("https://twindertool.firebaseio.com");
	
	var timelineRef = new Firebase("https://twindertool.firebaseio.com/home_timeline")
	$scope.timelineArray = $firebaseArray(timelineRef);

	var likedRef = new Firebase("https://twindertool.firebaseio.com/liked_timeline")
	$scope.likedTweets = $firebaseArray(likedRef)

	var dislikedRef = new Firebase("https://twindertool.firebaseio.com/disliked_timeline")
	$scope.dislikedTweets = $firebaseArray(dislikedRef)

	$scope.userData = authFactory.userData();
	
	//listener for change in auth
	authFactory.ref.onAuth(function(authData) {
		$scope.userData = authData;
		//this next part makes the data auto load
		$timeout(function() {
	       $scope.$apply();
	    }, 500);				
	})

	$scope.login = function() {
		authFactory.login().then(function(data){$scope.getTimeline()})	
	}

	$scope.logout = authFactory.logout;

	
	
	$scope.getTimeline = function(){
		if($scope.lastTweetId){
			$http.get('/api/getTweets/'+$scope.lastTweetId).then(function(data) {
				if(data.data.length){
					(console.log(data.data))
					$scope.lastTweetId = data.data[0].id
					console.log($scope.lastTweetId)
					data.data.reverse().forEach(function(tweet){
						$scope.timelineArray.$add(tweet)
					})
				}
				
			}, function(err) {})
		}
		else{
			$http.get('/api/getTweets/').then(function(data) {
			if(data.data){
				$scope.lastTweetId = data.data[0].id
				data.data.reverse().forEach(function(tweet){
					$scope.timelineArray.$add(tweet)
				})
			}
			
		}, function(err) {})
		}
			
	}
	$scope.passJudgement = function(tweet, liked){
		if(liked){
			$scope.likedTweets.$add(tweet)
		}
		else{
			$scope.dislikedTweets.$add(tweet)
		}
		$scope.timelineArray.$remove($scope.timelineArray[0])
	}
});

app.factory('authFactory', function($timeout,$http,$q){
	var service = {};
	
	service.ref = new Firebase("https://twindertool.firebaseio.com");
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