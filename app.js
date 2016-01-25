var app = angular.module('twinder', ["firebase"]);
app.controller('LoginController',['$scope','$window', '$firebaseArray', '$firebaseObject', '$timeout', function($scope,$window,$firebaseArray, $firebaseObject, $timeout){
	ref = new Firebase("https://twinder.firebaseio.com");
	$scope.userData = ref.getAuth();

	ref.onAuth(function(authData) {
		$scope.userData = authData;
		//this next part makes the data auto load
		$timeout(function() {
	       $scope.$apply();
	    }, 500);				
	});
	$scope.login = function() {
		ref.authWithOAuthPopup("twitter",function(error, authData) {});
	};
	$scope.logout = function() {
		ref.unauth();
	};

}]);
