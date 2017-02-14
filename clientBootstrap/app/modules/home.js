angular
    .module('homeModule', ['ngFileUpload'])
    .controller('homeCtrl', function ($scope, $http, $location, $state, Upload, $timeout) {

        $scope.images = [];

        $scope.cangeVisibleProfile = function () {
            $http.post('/changeprivate', { "private": $scope.hiddenProfile })
                .then(function (data) {
                    $scope.hiddenProfile = data.data.private;
                });
        };

        var token = window.localStorage.getItem('jwt');
        if (token == null) {
            $state.transitionTo('login');
        } else {
            $http.post('/isauth', {
                token: token
            })
                .then(function (data) {
                    $state.transitionTo('home');
                })
                .then(function () {
                    $http.get('/checkprofile')
                        .then(function (data) {
                            $scope.hiddenProfile = data.data.private;
                        });
                })
                // .then(function(){
                //     $http.post('/getpicture')
                //         .then(function(data){
                //             //$scope.images = data;
                //             console.log(data);
                //         })
                // })
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

                                    console.log(resp);
                            });
                        }, null, function (evt) {
                            $scope.progressPercentage = parseInt(100.0 * //
                                evt.loaded / evt.total);
                        });
                    }
                }
            }
        };
    });