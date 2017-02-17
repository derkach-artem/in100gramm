//страница загружает страницу пользователя, работает как ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
angular.module('userIDModule', [])
    // .controller('userCtrl', function ($scope, $http, $location, $state, Upload, $timeout, jwtHelper, $stateParams, $rootScope) {
    .controller('userIDCtrl', function ($scope, $http, $location, $state, $stateParams, $rootScope) {
        let token = window.localStorage.getItem('jwt');
        if (token == null) {
            $location.path('/login');
        } else {
            $http.post('/checkUser', { token: token })
                .then(function (data) {
                    $location.path('/user/' + data.data.username)
                })
                .catch(function(){
                    console.log("ERROR !!!!");
                })
        }
    });