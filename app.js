var app = angular.module('twinder', ["firebase"]);
app.controller('LoginController',['$scope','$window', '$firebaseArray', '$firebaseObject', function($scope,$window,$firebaseArray, $firebaseObject){
	var ref = new Firebase("https://twinder.firebaseio.com");
	
	$scope.login = function() {
	ref.authWithOAuthPopup("twitter",function(error, authData) {
		if(error){
			$window.alert("Login Failed!" + error);
		}
		else{
			$window.alert("Authenticated successfully with payload:" +authData)
		}
	});

	};
	
}]);
//https://drive.google.com/folderview?id=0B7mFI-OzUoSXWTFoQVh1SmFTa3c&usp=sharing