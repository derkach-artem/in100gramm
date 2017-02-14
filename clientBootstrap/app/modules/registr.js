angular
	.module('registrModule', [])
	.controller('registrCtrl', function ($scope, $http, $location) {
		$scope.register = function (username, email, password, password2) {
			$http.post('/registrate', {
				username: username,
				email: email,
				password: password,
				password2: password2
			})
				.then(function (response) {
					window.localStorage['jwt'] = angular.toJson(response.data.token);
					$location.path('/home');
				});
		};
	});