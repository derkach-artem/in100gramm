angular.module('loginModule', ['angular-jwt'])
	.controller('loginCtrl', function ($scope, $http, $location, jwtHelper, $state, $stateParams, $rootScope) {

		$scope.sendLogin = function (username, password) {
			$http.post('/login', {
				username: username,
				password: password
			})
				.then(function (response) {
					window.localStorage['jwt'] = angular.toJson(response.data.token);
					var expToken = window.localStorage['jwt'];
					$rootScope.name = response.data.name;
					//console.log(response.data.name);
					//$state.go('user', {username : $rootScope.name});/////////
					$state.go('user', {username : response.data.name});
					$rootScope.username = response.data.name
					//$state.transitionTo('users');
					//$location.path('/user/'+ response.data.name);
				});
		};
	});