var app = angular.module('twinder', ['firebase', 'ngSanitize', 'infinite-scroll']);

app.controller('AppController', function( $scope, $window, $timeout, $http, $q, $firebaseArray, $firebaseObject, $filter, authFactory){



	
	/*var timelineRef = new Firebase("https://twindertool.firebaseio.com/home_timeline")
	$scope.timelineArray = $firebaseArray(timelineRef);

	var likedRef = new Firebase("https://twindertool.firebaseio.com/liked_timeline")
	$scope.likedTweets = $firebaseArray(likedRef)
	$scope.likedTweets.$loaded().then(function(data) {
		$scope.likedTweetsFeed = []
		if($scope.likedTweets.length<31){
			for(var i = $scope.likedTweets.length-1; i>-1; i--){
				$scope.likedTweetsFeed.push($scope.likedTweets[i])
			}
			$scope.feedIndex = 0	
		}
		else{
			for(var i = $scope.likedTweets.length-1; i>$scope.likedTweets.length-31; i--){
				$scope.likedTweetsFeed.push($scope.likedTweets[i])
				$scope.feedIndex = i
				
			}
		}
		
	})

	var dislikedRef = new Firebase("https://twindertool.firebaseio.com/disliked_timeline")
	$scope.dislikedTweets = $firebaseArray(dislikedRef)

	var last = new Firebase("https://twindertool.firebaseio.com/last")
	var lastObj = $firebaseObject(last)
	lastObj.$bindTo($scope, "lastOne").then(function(data) {})*/

	$scope.userData = authFactory.userData();
	
	//listener for change in auth
	authFactory.ref.onAuth(function(authData) {
		$scope.userData = authData;
		//this next part makes the data auto load
		$timeout(function() {
	       $scope.$apply();
	    }, 500).then(function(data){
	    	if(authData){
	    		console.log($scope.userData.twitter.username)
		    	var timelineRef = new Firebase("https://twindertool.firebaseio.com/home_timeline")
				$scope.timelineArray = $firebaseArray(timelineRef);

				var likedRef = new Firebase("https://twindertool.firebaseio.com/liked_timeline")
				$scope.likedTweets = $firebaseArray(likedRef)
				$scope.likedTweets.$loaded().then(function(data) {
					$scope.likedTweetsFeed = []
					if($scope.likedTweets.length<31){
						for(var i = $scope.likedTweets.length-1; i>-1; i--){
							$scope.likedTweetsFeed.push($scope.likedTweets[i])
						}
						$scope.feedIndex = 0	
					}
					else{
						for(var i = $scope.likedTweets.length-1; i>$scope.likedTweets.length-31; i--){
							$scope.likedTweetsFeed.push($scope.likedTweets[i])
							$scope.feedIndex = i
							
						}
					}
					
				})

				var dislikedRef = new Firebase("https://twindertool.firebaseio.com/disliked_timeline")
				$scope.dislikedTweets = $firebaseArray(dislikedRef)

				var last = new Firebase("https://twindertool.firebaseio.com/last")
				var lastObj = $firebaseObject(last)
				lastObj.$bindTo($scope, "lastOne").then(function(data) {
					$scope.getTimeline()
				})

	    	}
	    })				
	})

	$scope.login = function() {
		authFactory.login().then(function(data){
			
		})	
	}

	$scope.logout = authFactory.logout;
	$scope.composeTweetText
	$scope.sendTweet = function(){
		$http.post("/api/tweet/"+$scope.composeTweetText).then(function(data){
			$scope.toggleCompose()
			$scope.composeTweetText = ""
		}, 
		function(err){
			console.log(err)
		})

	}
	$scope.showReply = false
	$scope.toggleReply = function(tweet) {
		$scope.showReply = !$scope.showReply
		if(tweet){
			$scope.replyTweetId = tweet.id_str
			if(tweet.user.screen_name){
				$scope.composeTweetText = "@"+tweet.user.screen_name
			}
		}
	}

	$scope.reply = function(){
		//console.log($scope.replyTweetId)
		$http.post("/api/reply/"+$scope.replyTweetId+"/"+$scope.composeTweetText).then(function(data){
			$scope.toggleReply()
			$scope.composeTweetText = ""
			$scope.relpyToId= ""
		}, 
		function(err){
			console.log(err)
		})

	}
	//retweet
	$scope.retweet = function(tweet){
		tweet.retweeted = true
		$scope.likedTweets.$save(tweet)
		$http.post('/api/retweet/'+tweet.id_str).then(function(data){
		}, 
		function(err){
			console.log(err)
		})
	}
	//unretweet
	$scope.unretweet = function(tweet){
		tweet.retweeted = false
		$scope.likedTweets.$save(tweet)
		$http.post('/api/unretweet/'+tweet.id_str).then(function(data){
		}, 
		function(err){
			console.log(err)
		})
	}
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
	$scope.showCompose = false
	$scope.toggleCompose = function() {
		$scope.showCompose = !$scope.showCompose
	}
	//adds tweets to Feed with Infinite Scroll
	$scope.addTweets = function(){
		if($scope.feedIndex>0){
			if($scope.feedIndex>20){
				var n = 20
				while(n--){
					$scope.feedIndex--
					$scope.likedTweetsFeed.push($scope.likedTweets[$scope.feedIndex])
				}
			}
			else{
				var n = $scope.feedIndex
				while(n--){
					$scope.feedIndex--
					$scope.likedTweetsFeed.push($scope.likedTweets[$scope.feedIndex])
				}
			}
		}	
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
app.directive("compose", function() {
	return {
		restrict: 'E',
		templateUrl: "templates/compose.html"
	}
});
app.directive('reply', function() {
	return{
		restrict: 'E',
		templateUrl: "templates/reply.html"
	}
})