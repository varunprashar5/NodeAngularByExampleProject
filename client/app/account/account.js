'use strict';

angular.module('woobeeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/admin/login',
        authenticate: false,
        role: 'admin',
        title:'WootBee | Login',
        views: {
				"header": { template: '' },
				"body":   { templateUrl: 'app/account/login/login.html',
							controller: 'LoginCtrl'}
			}
      })
      //~ .state('signup', {
        //~ url: '/signup',
        //~ templateUrl: 'app/account/signup/signup.html',
        //~ controller: 'SignupCtrl'
      //~ })
      .state('settings', {
        url: '/admin/settings',
        authenticate: true,
        role: 'admin',
        title:'WootBee | Change Password',
        views: {
				"header": { templateUrl: 'components/navbar/header.html'},
				"body":   { templateUrl: 'app/account/settings/settings.html',
							controller: 'SettingsCtrl'}
			}
      });
  });
