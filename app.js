var app = angular.module('twitterFeed', ["firebase"]);
app.controller('loginController',['$scope', '$window', 'firebaseArray', '$firebaseObject', function ($scope, $window, $firebaseArray, $firebaseObject){
	var ref = new Firebase("http://radiant-inferno-8430.firebaseio.com");
	ref.authWithOAuthPopup("twitter", function(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	  }
	});
}]);