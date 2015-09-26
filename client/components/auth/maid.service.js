'use strict';

angular.module('woobeeApp')
  .factory('MaidSer', function ($resource) {
    return $resource('/api/maid/:id', {
      id: '@_id'
    },
		{
		  updateUser: {
			method: 'PUT'
		  }
	  });
  });
