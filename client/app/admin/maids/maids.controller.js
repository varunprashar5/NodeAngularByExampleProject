'use strict';

angular.module('woobeeApp')
    .controller('MaidsCtrl', function($scope, $state, MaidSer, $modal, getMaids, growl, $http, $location) {
	
		$scope.maidsList = [];
		$scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 3;
        var blockFirstReq = 0;
        $scope.currentPage = 1;
        $scope.maidsList = getMaids.data[0].data;
        $scope.count = getMaids.data[0].count;
        $scope.toogleShow = $scope.maidsList.length > 0 ? true : false;
        $scope.paginationBtns = $scope.count > 10 ? true : false;
        

        $scope.$watch('currentPage', function() {
            if (blockFirstReq > 0) {
                var offset = (($scope.currentPage - 1) * $scope.numPerPage);
                var data = {
                    pageNumber: $scope.currentPage,
                    maidsPerPage: $scope.numPerPage
                };
                pagination(data);
            } else {
                blockFirstReq = 1;
            }
        });

        function pagination(data) {
            $http.post('/api/maid/allmaids', data).then(
                function(res) {
                    $scope.maidsList = res.data[0].data;
                    $scope.count = res.data[0].count;
                    $scope.toogleShow = $scope.maidsList.length > 0 ? true : false;
                    $scope.paginationBtns = $scope.count > 10 ? true : false;
                },
                function(err) {
					
                }
            );
        }

        // hide page on child view
        $scope.$watch(function() {
                return $state.current.name;
            },
            function(path) {
                if (path) {
                    $scope.showMainPage = path != 'maids' ? true : false;
                }
            });


        // Edit Maid
        $scope.editMaid = function(maids) {
            var id = maids._id;
            $scope.maidIndex = $scope.maidsList.indexOf(maids);
            $state.go('maids.manageMaids', {
                id: id
            });
        };

        // Remove maid from DB
        $scope.deleteMaid = function(maid) {
            $scope.animationsEnabled = true;
            $scope.DeleteMsg = "Are you sure that you want to delete this maid ?";
            var modalInstance = $modal.open({
                templateUrl: 'app/common/delete.html',
                controller: 'DeleteCtrl',
                resolve: {
                    msg: function() {
                        return $scope.DeleteMsg;
                    }
                }
            });

            modalInstance.result.then(
                function(res) {
                    var idx = $scope.maidsList.indexOf(maid);
                    var id = $scope.maidsList[idx]._id;
                    $scope.toogleShow = $scope.maidsList.length == 0 ? false : true;
                    MaidSer.delete({
                            id: id
                        },
                        function(res) {
                            $scope.maidsList.splice(idx, 1);
                            growl.success('Maid deleted successfully !');
                        },
                        function(err) {
                            console.log(err);
                        }
                    );
                },
                function(err) {
                    console.log(err);
                }
            );
        };

        // fetch more maids from server (pagination or lazy loading)
        //~ var pageNumber = 2;
        //~ var maidsPerPage = 7;
        //~ var request = true;

        //~ $scope.myPagingFunction = function() {
        //~ if(request) {
        //~ $scope.loadmoredata = true;
        //~ request = false;
        //~ var data = {pageNumber:pageNumber,maidsPerPage:maidsPerPage};
        //~ $http.post('/api/maid/allmaids', data).then(
        //~ function(res) {
        //~ if(res.data.length) {
        //~ $scope.maidsList = $scope.maidsList.concat(res.data);
        //~ pageNumber += 1;
        //~ maidsPerPage += 2;
        //~ request = true;
        //~ } else {
        //~ $scope.datafinish = true;
        //~ }
        //~ $scope.loadmoredata = false;
        //~ },
        //~ function(err){
        //~ request = true;
        //~ $scope.loadmoredata = false;
        //~ }
        //~ );
        //~ }
        //~ }
        //~ 
        
        // Search maids from database
        $scope.maidSearch = function() {
            console.log('search');
        }
    });
