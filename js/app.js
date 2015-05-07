
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

quizApp.directive("previewAudio", function(){
  return function($scope, element, attrs){
    $scope.playIt = function(url,id){
      element[0].setAttribute('src', url);
      element[0].play();
      $scope.playing = id;
    }

    $scope.stopIt = function(){
      element[0].pause();
      element[0].currentTime = 0;
      $scope.playing = "";
    }

    element[0].addEventListener('ended', function(){
      $scope.stopIt();
    });
  }
});

quizApp.directive("searchField", function(){
  return function($scope, element, attrs){

    var typingTimer = null; // initierar en timer.
    var doneTypingInterval = 300; //tid i ms som användaren får vänta efter att han skrivit till API-anrop.

    element[0].onkeyup = function(){
      clearTimeout(typingTimer);
      typingTimer = setTimeout($scope.newSearch($scope.query), doneTypingInterval);
    };
    //on keydown, clear the countdown 
    element[0].onkeydown = function(){
      clearTimeout(typingTimer);
    };
  }
});


quizApp.directive("overviewCarousel", function(quizModel, $window){
    return function($scope, element, attrs){
      var win = angular.element($window);

      $scope.evaluateOverflow = function(){
        if(quizModel.carouselPosition < 100){
          $scope.overFlowLeft = true;
        }else{
          $scope.overFlowLeft = false;
        }


        if(win.width() - element[0].scrollWidth - element[0].offsetLeft  < -400){
          $scope.overFlowRight = true;
        }else{
          $scope.overFlowRight = false;
        }
      }

      element.css("margin-left",quizModel.carouselPosition);
      if(quizModel.carouselSlideTo != null){
        //this is fine ...
        element.animate({marginLeft: quizModel.carouselSlideTo + 'px'}, 600, 'swing');
        quizModel.carouselPosition = quizModel.carouselSlideTo;
        quizModel.carouselSlideTo = null;
      }


      $scope.stopSlide = function(distance){
       clearInterval($scope.sliding);
      }

      $scope.slide = function(distance){
        $scope.sliding = setInterval(function(){
        margin = parseInt(element.css("margin-left"));
        //stoppvillkor vänster
        if(margin + distance >= 100  && distance > 0){
          margin = 100;
          $scope.overFlowLeft = false;
          //this is fine ...
          element.animate({marginLeft: margin + 'px'}, 50, 'swing');
          $scope.stopSlide()
        }else if (win.width() - element[0].scrollWidth - element[0].offsetLeft  < 0 || distance > 0){
          $scope.overFlowLeft = true;
          $scope.overFlowRight = true;
          $scope.$apply();
          margin = parseInt(element.css("margin-left")) + distance;
          //this is fine ...
          element.animate({marginLeft: margin + 'px'}, 50, 'linear');
        }else{
          $scope.overFlowRight = false;
          $scope.stopSlide(); 
        }
        quizModel.carouselPosition = margin;
      }, 100);
    }
  }
});

quizApp.directive("quizAudio", function(){
  return function($scope, element, attrs){
    element.bind("timeupdate", function(){
      if(!$scope.qAnswered){
        $scope.timeElapsed = element[0].currentTime;
        if ($scope.timeElapsed < 3){
          $scope.points = 10;
        }else if ($scope.timeElapsed > 3 && $scope.timeElapsed <= 6){
          $scope.points = 9;
        }else if ($scope.timeElapsed > 6  && $scope.timeElapsed <= 9){
          $scope.points = 8;
        }else if ($scope.timeElapsed > 9  && $scope.timeElapsed <= 12){
          $scope.points = 7;
        }else if ($scope.timeElapsed > 12  && $scope.timeElapsed <= 15){
          $scope.points = 6;
        }else if ($scope.timeElapsed > 15  && $scope.timeElapsed <= 19){
          $scope.points = 5;
        }else if ($scope.timeElapsed > 19  && $scope.timeElapsed <= 23){
          $scope.points = 4;
        }else if ($scope.timeElapsed > 23  && $scope.timeElapsed <= 26){
          $scope.points = 3;
        }else if ($scope.timeElapsed > 26  && $scope.timeElapsed <= 29){
          $scope.points = 2;
        }else if ($scope.timeElapsed > 29){
          $scope.points = 1;
          element.animate({volume: 0}, 1000);
        }
      }
      $scope.$apply();
    });

    $scope.resetAudio = function(){
      element[0].currentTime = 0;
      element[0].play();
    }
  }
});
