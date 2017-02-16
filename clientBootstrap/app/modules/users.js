// странница загружает список пользователей, работает как HOME
angular
    .module('usersModule', [])
    .controller('usersCtrl', function ($scope, $http, $location, $state, $stateParams, $rootScope) {

        $http.post('/showusers')
            .then(function (response) {
                $scope.users = response.data.users;
            });
    });