'use strict';

angular.module('woobeeApp')
  .controller('HomeCtrl', function ($scope, Auth, $state, $window, $rootScope) {
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
          $state.go('dashboard');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
	
	$scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
	
  });
