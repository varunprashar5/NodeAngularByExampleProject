'use strict';

angular.module('woobeeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngFileUpload',
  'angular-growl',
  'angular-loading-bar',
  'ngAnimate',
  'infinite-scroll',
  'ui-rangeSlider'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, growlProvider, cfpLoadingBarProvider) {
    $urlRouterProvider
      .otherwise('/');

	growlProvider.globalTimeToLive(3000);
    growlProvider.globalPosition('bottom-right');
    cfpLoadingBarProvider.includeSpinner = true; 
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth,$state, $cookieStore) {
	
	 // Change title of app
	 $rootScope.$state = $state;
    
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      
      Auth.isLoggedInAsync(function(loggedIn) {
        if (toState.authenticate && !loggedIn) {
			$location.path('/');
        } else {
			// Control if user is login from another tab with different role
			if(toState.role) {
				var role = $cookieStore.get('role');
				var locPath = $location.path();
				if(role && locPath != '/admin/login') {
					if(toState.role != role) {
						if(role == 'user'){
							$location.path('/');
						} else if(role == 'admin') {
							$location.path('/admin/dashboard');
						} else {
							$location.path('/');
						}
						event.preventDefault(); 
					}
				}
			}
		}
      });
      
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!toState.authenticate && loggedIn) {
			var role = $cookieStore.get('role');
				if(role == 'user'){
					$location.path('/');
				} else if(role == 'admin') {
					if(toState.url == '/admin/login') {
						$state.transitionTo('dashboard');
					} else {
						$cookieStore.remove('token');
						$cookieStore.remove('role');
						$cookieStore.remove('loginStatus');
					}
				} else {
					$location.path('/');
				}
				event.preventDefault(); 
			}
      });
    });
    
    // change class of body after login
	$rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(path) {
		if(path) {
			var part = path.split('/');
			part[1] == 'admin' ? $rootScope.adminPanel = true :  $rootScope.adminPanel = false ;
		}
    });
  });
