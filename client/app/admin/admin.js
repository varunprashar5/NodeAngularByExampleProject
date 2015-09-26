'use strict';

angular.module('woobeeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin/xx',
        role: 'admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });
