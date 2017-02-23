angular.module('userModule', ['ngFileUpload'])
    .controller('userCtrl', function ($scope, $http, $location, $state, $timeout, jwtHelper, $stateParams, $rootScope, Upload) {

        $scope.images = [];
        $scope.my_images = [];
        $http.get('/checkprofile')
            .then(function (data) {
                if (typeof(data) === boolean){
                    $scope.hiddenProfile = data.data.private;    
                }
                // $scope.hiddenProfile = data.data.private;
                console.log('guest');
            });

        let token = window.localStorage.getItem('jwt');
        $scope.thisUser = false;

        let userId = $stateParams.username;

        $http.post('/getCurrentUser', {
            "userId": userId
        })
            .then(function (data) {
                $scope.currentUser = data.data;
            })
            .then(function () {
                $http.post('/getImagesCurrentUser', $scope.currentUser)
                    .then(function (data) {
                        $scope.images = data.data;
                        $scope.my_images = data.data;
                        console.log($scope.my_images);
                    })
            })
            .then(function () {
                if (token == null) {
                    $scope.thisUser = false;
                } else {
                    $http.post('/checkUser', { token: token })
                        .then(function (data) {
                            if ((data.data.isAdmin == true) || ($scope.currentUser.username == data.data.username)) {
                                $scope.thisUser = true;
                            }
                        })
                }
            });

        $scope.toggle = true;

        $scope.loadImgs = function (files, errFiles) {
            // $scope.progress = 0;
            $scope.files = files;
            $scope.errFiles = errFiles;
            angular.forEach(files, function (file) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { "user_id": $scope.currentUser._id },
                    file: file
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                        $scope.images.push({ url: response.data.url, public_id: response.data.public_id });
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            });
            console.log('DONE');
            $scope.files = null;
        };

        $scope.cangeVisibleProfile = function () {
            $http.post('/changeprivate', { "private": $scope.hiddenProfile })
                .then(function (data) {
                    $scope.hiddenProfile = data.data.private;
                });
        };

        $scope.del = function ($index) {
            // console.log($index);
            // console.log($scope.files);
            $scope.files.splice($index, 1);
        };


        // console.log($scope.my_images);
    });