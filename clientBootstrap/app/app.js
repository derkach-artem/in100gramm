angular.module('app', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ui.router', 'loginModule', 'registrModule', 'usersModule', 'userModule', 'userIDModule'])

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });

        $urlRouterProvider.otherwise("/users");

        $stateProvider
            .state('users', {
                url: "/users",
                templateUrl: "../templates/users.html",
                controller: 'usersCtrl'
            })

            .state('login', {
                url: "/login",
                templateUrl: "../templates/login.html",
                controller: 'loginCtrl'
            })

            .state('registr', {
                url: "/registr",
                templateUrl: "../templates/registr.html",
                controller: 'registrCtrl'
            })
            .state('user', {
                // url: "/user/{username}",
                url: "/user/:username",
                templateUrl: "../templates/user.html",
                controller: 'userCtrl'
            })
            .state('userID', {
                url: '/user',
                templateUrl: "../templates/user.html",
                controller: "userIDCtrl"
            })
    })
    .factory('auth', function () {
        var login = {};

        login.isLogin = function () {
            let token = window.localStorage.getItem('jwt')

            if (token) {
                return true
            } else {
                return false
            }
        }

        return login;
    })
    .run(['$rootScope', '$location', 'auth', '$stateParams',
        function ($rootScope, $location, auth, $stateParams) {
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            })
        }])
    .controller('appCtrl', function ($scope, $http, $location, auth, $rootScope, $stateParams) {

        $scope.users = [];
        console.log('APP START');

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $scope.isLogin = auth.isLogin();
        });

        $scope.logout = function () {
            $http.get('/logout')
                .then(function (response) {
                    window.localStorage.removeItem('jwt');
                    $location.path('/login');
                });
        };

        $scope.showUsers = function () {
            $http.post('/showusers')
                .then(function (response) {
                    $scope.users = response.data.users;
                });
        };
    });