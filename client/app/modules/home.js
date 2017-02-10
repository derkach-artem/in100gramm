angular
    .module('homeModule', [])
    .controller('homeCtrl', function ($scope, $http, $location) {
        

        $scope.isAuth = function(){
            var token = window.localStorage['jwt'];
            if (token === 'undefined'){
                $location.path('/login');    
            } else {
                $http.post('/isauth', {
                    "token" : token
                }).succsess(function(response){
                    console.log(response);
                })
            }  
        }

        $scope.isAuth();
    });