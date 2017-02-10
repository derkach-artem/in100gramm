angular.module('app', ['ngMaterial', 'ui.router', 'loginModule', 'registrModule', 'homeModule'])

    .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('blue');

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('state1', {
                url: "/home",
                templateUrl: "../templates/home.html",
                controller : 'homeCtrl'
            })

            .state('state2', {
                url: "/login",
                templateUrl: "../templates/login.html",
                controller: 'loginCtrl'
            })

            .state('state3', {
                url: "/registr",
                templateUrl: "../templates/registr.html",
                controller: 'registrCtrl'
            });
    })

    .controller('appCtrl', function ($scope, $http, $location) {
        $scope.logout = function () {
            $http.get('/logout')
                .success(function (response) {
                    console.log(angular.toJson(response));
                    window.localStorage.removeItem('jwt');
                    $location.path('/login');
                });
        }
    });