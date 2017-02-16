//страница загружает страницу пользователя, работает как ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
angular.module('userModule', [])
    // .controller('userCtrl', function ($scope, $http, $location, $state, Upload, $timeout, jwtHelper, $stateParams, $rootScope) {
    .controller('userCtrl', function ($scope, $http, $location, $state, $timeout, jwtHelper, $stateParams, $rootScope) {

        $scope.username = $stateParams.username;

        var token = window.localStorage.getItem('jwt');
        if (token == null) {
            $state.transitionTo('login');
        } else {
            $http.post('/isauth', {
                token: token
            })
                .then(function (data) {
                    $state.go('user', { username: $rootScope.name });
                })
                .then(function () {
                    $http.get('/checkprofile')
                        .then(function (data) {
                            $scope.hiddenProfile = data.data.private;
                        });
                })
                .catch(function (err) {
                    $state.transitionTo('login');
                });
        };


        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function () {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });
        $scope.log = '';

        $scope.images = [];

        $scope.upload = function (files) {
            $scope.progressPercentage = 0;
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: '/upload',
                            data: {
                                username: $scope.username,
                                file: file
                            }
                        }).then(function (resp) {
                            $timeout(function () {
                                $scope.log = 'file: ' +
                                    resp.config.data.file.name +
                                    ', Response: ' + JSON.stringify(resp.data) +
                                    '\n' + $scope.log;

                                ///console.log(resp);
                            });
                        }, null, function (evt) {
                            $scope.progressPercentage = parseInt(100.0 * //
                                evt.loaded / evt.total);
                        });
                    }
                }
            }
        };


        $scope.cangeVisibleProfile = function () {
            $http.post('/changeprivate', { "private": $scope.hiddenProfile })
                .then(function (data) {
                    $scope.hiddenProfile = data.data.private;
                });
        };
    });