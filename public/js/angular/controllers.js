'use strict';

/* Controllers */

angular.module('ezPAARSE.controllers', [])
  .controller('AppCtrl', function ($scope, $state, userService, $http) {

    userService.onLogin(function (user) {
      $scope.user = user;
    });
    userService.onLogout(function () {
      $scope.user = null;
    });

    $scope.login  = { group: 'user' };
    $scope.groups = [
      { value: 'user', label: "Utilisateur" },
      { value: 'admin', label: "Administrateur" }
    ];

    $scope.fakeConnect = function () {
      userService.login($scope.login.name, $scope.login.group);
      $scope.user = userService.user;
      $state.transitionTo('process');
    };

    $scope.hasAccess = function () {
      return userService.hasAccess('admin');
    }

    $scope.logout = function () {
      var cb = function () {
        userService.logout();
        $scope.user = null;
        $state.transitionTo('login');
      };

      $http.get('/logout').then(cb, cb);
    }

  }).controller('LoginCtrl', function ($scope, $state, $http, userService, $element) {
    $scope.credentials = {};

    $scope.login = function (form) {
      console.dir(form);
      $scope.loading = true;

      $http.post('/login', $scope.credentials)
      .success(function (user) {
        userService.login(user.username, user.group);
        $scope.user    = userService.user;
        $scope.loading = false;

        $element.modal('hide');
        $state.transitionTo('process');
      })
      .error(function () {
        $scope.loading = false;
        alert('Mauvais identifiants');
      });
    };
  });