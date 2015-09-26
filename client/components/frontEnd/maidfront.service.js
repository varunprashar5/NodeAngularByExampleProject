'use strict';

angular.module('woobeeApp')
        .factory('MaidFrontSer', function ($resource) {

            return $resource('/api/maidfront/:id', {}, {'get': {method: 'GET'},
                'save': {method: 'POST', isArray: true},
                'query': {method: 'GET', isArray: true},
                'remove': {method: 'DELETE'},
                'delete': {method: 'DELETE'},
                'compare_maid': {
                    method: 'POST', isArray: true,
                    params: {
                        id: 'comp_maid'
                    }
                }

            });

        });
