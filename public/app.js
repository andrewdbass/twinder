var app = angular.module('twinder', ['firebase', 'ngSanitize']);

app.controller('AppController', function( $scope, $window, $timeout, $http, $q, $firebaseArray, $firebaseObject, $filter, authFactory){

	$scope.testString = $filter('linky')("hi my alternate email is sandeep_giet@yahoo.com .");

	var ref = new Firebase("https://twindertool.firebaseio.com");
	
	var timelineRef = new Firebase("https://twindertool.firebaseio.com/home_timeline")
	$scope.timelineArray = $firebaseArray(timelineRef);

	var likedRef = new Firebase("https://twindertool.firebaseio.com/liked_timeline")
	$scope.likedTweets = $firebaseArray(likedRef)

	var dislikedRef = new Firebase("https://twindertool.firebaseio.com/disliked_timeline")
	$scope.dislikedTweets = $firebaseArray(dislikedRef)

	var last = new Firebase("https://twindertool.firebaseio.com/last")
	var lastObj = $firebaseObject(last)
	lastObj.$bindTo($scope, "lastOne").then(function(data) {
		$scope.lastOne.name = "hi"
		console.log($scope.lastOne)
	})

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

	$scope.likeTweet = function(tweet){
		tweet.favorited = true
		$scope.likedTweets.$save(tweet)
		$http.post('/api/favoriteTweet/'+tweet.id_str).then(function(data){
		}, 
		function(err){
			console.log(err)
		})
	}
	$scope.unlikeTweet = function(tweet){
		tweet.favorited = false
		$scope.likedTweets.$save(tweet)
		$http.post('/api/unfavoriteTweet/'+tweet.id_str).then(function(data){
		}, 
		function(err){
			console.log(err)
		})
	}		


	$scope.getTimeline = function(){
		if(typeof $scope.lastOne.tweetId !== 'undefined'){
			$http.get('/api/getTweets/'+$scope.lastOne.tweetId).then(function(data) {
				if(data.data.length>1){	
					$scope.lastOne.tweetId = data.data[0].id	
					data.data.reverse().forEach(function(tweet){
						$scope.timelineArray.$add(tweet)
					})
				}
				
			}, function(err) {})
		}
		else{
			$http.get('/api/getTweets/').then(function(data) {
			if(data.data){
				$scope.lastOne.tweetId =data.data[0].id
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
	$scope.showLikedTweets = false;
	$scope.toggleLikedTweets = function(){
		$scope.showLikedTweets = !$scope.showLikedTweets
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

app.directive("timeline", function() {
	return {
		restrict: 'E',
		templateUrl: "templates/timeline.html"
	}
});
app.directive("navbar", function() {
	return {
		restrict: 'E',
		templateUrl: "templates/navbar.html"
	}
});
app.directive("approved", function() {
	return {
		restrict: 'E',
		templateUrl: "templates/approvedFeed.html"
	}
});