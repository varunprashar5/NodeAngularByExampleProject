'use strict';

angular.module('woobeeApp')
    .controller('LoginpopupCtrl', function($scope, Auth, $state, currentState, $modalInstance, $window) {
        currentState == 'login' ? $scope.modal = {
            title: "login"
        } : $scope.modal = {
            title: "signup"
        };
        $scope.user = {};
        $scope.errors = {};
        $scope.login = function(form) {
            $scope.login_submitted = true;

            if (form.$valid) {
                Auth.login({
                        email: $scope.user.email,
                        password: $scope.user.password
                    })
                    .then(function(res) {
                        // Logged in, redirect to home
                        $state.go('home');
                        var data = {status: 'success'};
                        $modalInstance.close(data);
                    })
                    .catch(function(err) {
                        $scope.errors.other = err.message;
                    });
            }
        };

        $scope.register = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                Auth.createUser({
                        name: $scope.user.name,
                        email: $scope.user.email,
                        password: $scope.user.password
                    })
                    .then(function() {
                        // Account created, redirect to home
						var data = {status: 'success'};
                        $modalInstance.close(data);
                        $state.go('home');
                    })
                    .catch(function(err) {
                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        }
        
        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    });
