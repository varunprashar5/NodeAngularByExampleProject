'use strict';

angular.module('woobeeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/xx',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
