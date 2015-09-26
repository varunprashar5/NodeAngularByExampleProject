'use strict';

angular.module('woobeeApp')
  .controller('ManageMaidsCtrl', function ($scope, $state, MaidSer, $timeout, $stateParams, getMaidData, Upload, growl, $location, $log) {
	$scope.flag = 'add';
	var id = '';
	$scope.maidData = {gender:'male', 
		meal_type:'veg', 
		active:'yes', 
		cleaning:'yes', 
		verified:'no', 
		party_order:'no',
		vessel_cleaning:'no', 
		marital_status:'single', 
		image:'default.jpg',
		id_image:'avatar.png',
		cuisine:{
				north:false, 
				south:false, 
				chinese:false, 
				gujrati:false,
				punjabi:false,
				parsi:false,
				thai:false,
				bengali:false,
				hyderabadi:false,
				kashmiri:false,
				mughlai:false,
				maharashtrian:false,
				rajasthani:false,
				oriya:false,
				udipu:false,
				others:false
			}
	};
	
	function getIndex(val) {
        for (var i = 0; i < $scope.idTypes.length; i++) {
            if ($scope.idTypes[i].value == val) {
                return i;
            }
        }
    }
	$scope.members = ['cook','maid'];
	$scope.idTypes = [
						{value:'aadhar_card',name:'Aadhar card'},
						{value:'pan_card', name:'Pan Card'},
						{value:'driving_licence',name:'Driving Licence'},
						{value:'society_card',name: 'Society Card'},
						{value:'voter_card', name: 'Voter Card'},
						{value:'others',name: 'Others'}					
					];
	
	
	if(getMaidData) {
		$scope.maidData = getMaidData;
		var index = getIndex($scope.maidData.id_type);
		$scope.selectedIdType1 = $scope.idTypes[index];
		$scope.flag = 'edit';
		id = $stateParams.id;
	}
	
	$state.reload = function reload() {
		$state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
	}
	
	
	// Save maid data in database
		$scope.manageMaid = function() {
			$scope.maidData.id_type = $scope.selectedIdType1.value;
			if($scope.flag == 'add') {
				MaidSer.save($scope.maidData, 
				function(resp, headers){
					//success callback
					growl.success("Maid added successfully!");
					$scope.maidsList.push($scope.maidData);
					$state.go('maids');
					$timeout(function(){
						$state.reload();
					},300);
				},
				function(err){
					// error callback
					console.log(err);
				});
			} else {
				MaidSer.updateUser({id:id},$scope.maidData, 
				function(resp, headers){
					//success callback
					growl.success("Maid updated successfully!");
					$state.go('maids');
					if($scope.maidIndex) {
						$scope.maidsList[$scope.maidIndex] = $scope.maidData;
					} else {
						$timeout(function(){
							$state.reload();
						},300);
					}
				},
				function(err){
					// error callback
					console.log(err);
				});
			}
		};
	// Upload maid image
	$scope.$watch('file', function (file) {
      $scope.upload($scope.file, 'maidImage');
    });
    
	$scope.$watch('id_proof', function (id_proof) {
      $scope.upload($scope.id_proof,'idProof');
    });
    $scope.upload = function (files, type) {
        if (files) {
			Upload.upload({
				url: '/api/maid/uploadimage',
				fields: {type:type},
				file: files
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				//console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			}).success(function (data, status, headers, config) {
				//console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
				if(type == 'maidImage') {
					$scope.maidData.image = data.imagename;
				} else if(type == 'idProof') {
					$scope.maidData.id_image = data.imagename;
				}
				growl.success('Image uploaded successfully !');
			}).error(function (data, status, headers, config) {
				console.log('error status: ' + status);
			});
		}
    };
  
    $scope.randomNo = Math.random();
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
  
  });
