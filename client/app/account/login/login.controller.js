'use strict';

angular.module('woobeeApp')
  .controller('LoginCtrl', function ($scope, Auth, $state, $rootScope,growl, $cookieStore) {
     
    $scope.user = {};
    $scope.errors = {};
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $cookieStore.put('loginStatusAdmin', true);
          $state.go('dashboard');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
	
  });
