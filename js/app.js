
var quizApp = angular.module('quizApp', ['ngRoute','ngResource','ngCookies','ui.sortable','firebase']);

quizApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/start', {
        templateUrl: 'partials/start.html',
        controller: 'homeCtrl'
      }).
      when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'searchCtrl'
      }).
      when('/track/:trackId', {
        templateUrl: 'partials/track.html',
        controller: 'trackCtrl'
      }).
      when('/quiz/:quizId?', {
        templateUrl: 'partials/quiz.html',
        controller: 'quizCtrl'
      }).
      when('/quizScore', {
        templateUrl: 'partials/quizScore.html',
        controller: 'quizScoreCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
  }
]);

quizApp.config(function($sceDelegateProvider){
  $sceDelegateProvider.resourceUrlWhitelist(['self','https://p.scdn.co/mp3-preview/*']);
});