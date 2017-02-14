angular.module('loginModule', [])
	.controller('loginCtrl', function ($scope, $http, $location) {

		$scope.sendLogin = function (username, password) {
			$http.post('/login', {
				username: username,
				password: password
			})
				.then(function (response) {
					//console.log(response.data.name);
					window.localStorage['jwt'] = angular.toJson(response.data.token);
					$location.path('/home/' + response.data.name);
					console.log('!!!!!!!!!!!!!!!');
				})
		};
	});