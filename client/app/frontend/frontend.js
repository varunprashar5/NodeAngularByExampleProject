'use strict';

angular.module('woobeeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        authenticate: false,
        role: 'user',
        title:'WootBee | Home',
        views: {
			"header": { templateUrl: 'app/frontend/header/header.html' },
			"body":  { templateUrl: 'app/frontend/home/home.html',
						controller: 'HomeCtrl'}
			}
      });
  });
