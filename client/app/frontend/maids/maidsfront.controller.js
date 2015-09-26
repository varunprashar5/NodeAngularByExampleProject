'use strict';
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

angular.module('woobeeApp')
        .controller('maidsFrontCtrl', function ($scope, $state, MaidSer, $timeout, $stateParams, MaidFrontSer, $modal) {
            $scope.maids = [];
            $scope.maid = {};
            $scope.maid.gender = 'both';
            $scope.maid.meal_type = 'both';
            $scope.maid.memberType = 'both';
            $scope.animation = "flip-in";
            $scope.compare_animation = "slide-down";

            var numPerPage = 6;
            $scope.currentPage = 1;
            var loc_name = $stateParams.loc_name;
            var data = {
                pageNumber: $scope.currentPage,
                maidsPerPage: numPerPage,
                loc_name: loc_name
            };

            var entries = MaidFrontSer.query(data, function () {
                $scope.maids = entries[0].data;
                $scope.currentPage += 1;
                if ($scope.maids.length >= entries[0].count) {
                    $scope.stopScrollReq = true;
                    $scope.datafinish = true;
                }
            });




            $scope.price = {
                range: {
                    min: 0,
                    max: 10000
                },
                minPrice: 0,
                maxPrice: 10000,
                step: 500
            };
            $scope.exp = {
                range: {
                    min: 0,
                    max: 20
                },
                minExp: 0,
                maxExp: 20,
                step: 1
            };

            $scope.speciality = [];
            $scope.specialityArr = [{special: 'north'}, {special: 'indian'}, {special: 'south'}, {special: 'gujrati'}, {special: 'south'}, {special: 'chinese'}];

            $scope.toggleVal = function (indexval, val) {
                if ($scope.speciality.indexOf(val) > -1) {
                    $scope.speciality.splice($scope.speciality.indexOf(val), 1);
                } else {
                    $scope.speciality.push($scope.specialityArr[indexval].special);
                }
                $scope.search_maid();
            }

            $scope.search_maid = function () {
                $scope.maid.specialityarr = {};
                $scope.maid.specialityarr.special = $scope.speciality;
                $scope.maid.price = $scope.price;
                $scope.maid.exp = $scope.exp;

                MaidFrontSer.save($scope.maid, function (data) {
                    if (data.length > 0) {
                        $scope.maids = data;
                        $scope.isEmpty = false;
                    } else {
                        $scope.maids = '';
                        $scope.isEmpty = true;
                    }
                }); //saves an entry. Assuming $scope.entry is the Entry object  

            };

            $scope.compares = [];
            $scope.compare_active = false;
            $scope.showCompare = false;

            $scope.viewProfile = function (id) {


                //return false;
                var maidsProfile = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/app/frontend/maids/maidProfile.html',
                    controller: 'maidModalCtrl',
                    resolve: {
                        maid_data: function () {
                            return id;
                        },
                        type: function () {
                            return "profile";
                        }
                    }
                });
            };

            $scope.compare_maids = function () {
                $scope.showCompare = true;
                var compares = [];
                compares.splice(0, compares.length);
                angular.forEach($scope.compares, function (val, key) {

                    compares.push(val._id);

                });
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/app/frontend/maids/compare.html',
                    controller: 'maidModalCtrl',
                    resolve: {
                        maid_data: function () {
                            return compares;
                        },
                        type: function () {
                            return "compare";
                        }
                    }
                });
            };

            $scope.alreadyChecked = function (id) {
                var flag = 0;
                angular.forEach($scope.compares, function (val, key) {
                    if (val._id == id) {
                        flag = 1;
                    }
                });
                if (flag) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.comp = function (obj_this, maid) {

                var obj = angular.element(document.querySelector("#" + obj_this.target.id));
                var img = angular.element(document.querySelector("#" + obj_this.target.id + "_img"));
                if ($(obj).prop('checked')) {
                    if ($scope.compares.length >= 4) {
                        $scope.compare_active = true;
                        $(obj).prop('checked', false);
                        alert("Lmit exceeded");
                    } else {
                        var flag = 1;
                        angular.forEach($scope.compares, function (val, key) {
                            if (val._id == $(obj).attr('maid_id')) {
                                flag = 0;
                            }
                        });
                        if (flag) {
                            $scope.compares.push(maid);
                            if ($scope.compares.length >= 2) {
                                $scope.compare_active = true;
                            }
                        }
                    }
                } else {
                    $scope.compares.remove(obj.attr('maid_id'));
                    var compares = [];
                    compares.splice(0, compares.length);
                    angular.forEach($scope.compares, function (val, key) {
                        if (val._id != obj.attr('maid_id')) {
                            compares.push(val);
                        }
                    });
                    $scope.compares.splice(0, $scope.compares.splice);
                    $scope.compares = compares;

                    if ($scope.compares.length < 2) {
                        $scope.compare_active = false;
                    }
                }
                console.log($scope.compares);
            };

            $scope.del_compare = function (id) {
                //$scope.compares.remove(id);
                console.log(id);
                var compares = [];
                compares.splice(0, compares.length);
                angular.forEach($scope.compares, function (val, key) {
                    if (val._id != id) {
                        compares.push(val);
                    }
                });
                $scope.compares.splice(0, $scope.compares.splice);
                $scope.compares = compares;

                var obj = angular.element(document.querySelector("#b" + id));
                $(obj).prop('checked', false);
                if ($scope.compares.length < 2) {
                    $scope.compare_active = false;
                }
            };

            $scope.stopScrollReq = false;
            var blockFirstReq = 0;
            $scope.myPagingFunction = function () {
                if (blockFirstReq > 0) {
                    var data = {
                        pageNumber: $scope.currentPage,
                        maidsPerPage: numPerPage,
                        loc_name: loc_name
                    };
                    $scope.stopScrollReq = true;
                    $scope.loadmoredata = true;
                    var entries = MaidFrontSer.query(data, function () {
                        console.log(entries[0].data);
                        $scope.maids = $scope.maids.concat(entries[0].data);
                        $scope.currentPage += 1;
                        if ($scope.maids.length >= entries[0].count || entries[0].data.length == 0) {
                            $scope.stopScrollReq = true;
                            $scope.datafinish = true;
                        } else {
                            $scope.stopScrollReq = false;
                        }
                        $scope.loadmoredata = false;
                    });
                } else {
                    blockFirstReq = 1;
                }
            };



        }).controller('maidModalCtrl', ['$scope', '$modalInstance', 'MaidFrontSer', 'maid_data', 'type', 'MaidSer', function ($scope, $modalInstance, MaidFrontSer, maid_data, type, MaidSer) {

        if (type == "compare") {
            MaidFrontSer.compare_maid(maid_data, function (data) {
                $scope.maids = data;
            });
        } else if (type == "profile") {
            MaidSer.get({id: maid_data}, function (res) {
                $scope.maid = res;
            },
                    function (err) {
                        alert("ERROR");
                    });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);
