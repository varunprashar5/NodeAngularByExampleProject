'use strict';

angular.module('woobeeApp')
  .controller('HeaderCtrl', function ($scope,$state,Auth) {
	   
	   $scope.getCurrentUser = Auth.getCurrentUser;
	   $scope.logout = function() {
		  Auth.logout();
		  $state.go('login');
		};
  });
