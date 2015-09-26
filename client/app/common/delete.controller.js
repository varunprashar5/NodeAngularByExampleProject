'use strict';

angular.module('woobeeApp')
  .controller('DeleteCtrl', function ($scope, $modalInstance, msg) {
		$scope.message = msg;
			$scope.ok = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
  });
