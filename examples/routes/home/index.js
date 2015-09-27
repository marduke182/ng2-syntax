import angular from 'angular';
import uiRouter from 'ui-router';

export default angular
  .module('app.homeRoute', [
    uiRouter
  ])
  .config(/* @ngInject */($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        template: '<div>Must show this text</div>'
      });
  })
  .name;
