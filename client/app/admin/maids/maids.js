'use strict';
angular.module('woobeeApp')
	.config(function ($stateProvider) {
		$stateProvider
		.state('maids', {
			url: '/admin/maids',
			authenticate: true,
			role: 'admin',
			title: 'WootBee | Maids',
			views: {
				"header": {templateUrl: 'components/navbar/header.html'},
				"body": { templateUrl: 'app/admin/maids/maids.html',
						  controller: 'MaidsCtrl'}
			},
			resolve: {
				getMaids: function($http) {
					var data = {pageNumber:1,maidsPerPage:7};
					return $http.post('/api/maid/allmaids', data);
				}
			}
		})
		.state('maids.manageMaids', {
			url: '/manage/:id',
			authenticate: true,
			title: 'WootBee | Manage Maids',
			role: 'admin',
			templateUrl: 'app/admin/maids/manageMaids.html',
			controller: 'ManageMaidsCtrl',
			resolve: {
				getMaidData: function($stateParams, $http, $state){
					var id = $stateParams.id;
					if(id) {
						return $http.get('/api/maid/'+id)
						.then(
							function(res){
								return res.data;	
							}
						);
					}
				}
			}
		})
		.state('dashboard', {
			url: '/admin/dashboard',
			authenticate: true,
			title: 'WootBee | Dashboard',
			role: 'admin',
			views: {
				"header": {templateUrl: 'components/navbar/header.html'},
				"body": {templateUrl: 'app/admin/dashboard/dashboard.html',
					controller: 'DashboardCtrl'}
			}
		}
	);
});
