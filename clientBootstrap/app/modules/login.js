angular.module('loginModule', ['angular-jwt'])
	.controller('loginCtrl', function ($scope, $http, $location, jwtHelper, $state) {

		$scope.sendLogin = function (username, password) {
			$http.post('/login', {
				username: username,
				password: password
			})
				.then(function (response) {
					window.localStorage['jwt'] = angular.toJson(response.data.token);
					var expToken = window.localStorage['jwt'];
					// if (expToken) {
					// 	var tokenPayload = jwtHelper.decodeToken(expToken);
					 	 $state.transitionTo('home');
					// } else {
					 	//$location.path('/home');
					// }
				})
		};
	});