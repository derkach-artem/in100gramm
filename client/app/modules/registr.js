angular
	.module('registrModule', [])
	.controller('registrCtrl', function($scope, $http) {
        $scope.register = function(username, email, password, password2){
			$http.post('/registrate', {
				username : username,
				email : email,
				password : password,
				password2 : password2
			})
				.success(function(response){
					console.log(response);
				})
			;
        };
	});