quizApp.controller('CarouselCtrl', function($scope,quizModel) {

  $scope.initialize = function(){
    $scope.C2 = quizModel.Quiz.questions;  
  }

  $scope.selectTrack = function(pos){
    window.location = "#/track/quiz-" + pos;
  }

  $scope.removeTrack = function(index){
    // skickar in frågan som ska tas bort samt en funktion som fungerar som callback-funktion i modellen
    quizModel.removeQuestion($scope.C2[index], function(){
      $scope.initialize; 
      quizModel.shiftPosition($scope.C2, $scope.initialize);
    });
  }

  //Carousel 2
  //Definiera scrollzoner
 
  $scope.scrollZones = [
    {'speed':110,'margin':'0','width':'2%'},
    {'speed':70,'margin':'2%','width':'2%'},
    {'speed':45,'margin':'4%','width':'2%'},
    {'speed':30,'margin':'6%','width':'2%'},
    {'speed':20,'margin':'8%','width':'2%'},
    {'speed':10,'margin':'10%','width':'2%'},
    ];

  $scope.sortableOptions = {
    containment: '#sortable-container',
    //restrict move across columns. move only within column.
    orderChanged: function(obj){
      // skickar in karusellobjektet med frågor, samt intialize() som callback-funktion
      quizModel.shiftPosition($scope.C2,$scope.initialize);
    },
    accept: function (sourceItemHandleScope, destSortableScope) {
      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
    }
  };

 // $("#sortable-container").css('marginLeft',quizModel.carouselPosition);
 //  $scope.slide = function(distance){
 //    $scope.sliding = setInterval(function(){
 //      //fixa stoppvillkor
 //      var carousel = $("#sortable-container");
 //      margin = parseInt(carousel.css("margin-left"));
 //      if(margin >= 0 && distance > 0){
 //        margin = 0;
 //        $scope.stopSlide()
 //      }else if ($(window).width() - carousel[0].scrollWidth - parseInt(carousel.css("margin-left"))  < 2 || distance > 0){
 //        margin = parseInt(carousel.css("margin-left")) + distance;
 //        console.log(margin);
 //        carousel.animate({marginLeft: margin + 'px'}, 50, 'linear');
 //      }else{
 //        $scope.stopSlide(); 
 //      }
 //      quizModel.carouselPosition = margin;
 //    }, 100);
 //  }

  //$scope.slideToEnd();
  $scope.initialize();
});


quizApp.directive("overviewCarousel", function(quizModel){
    return function($scope, element, attrs){
      element.css("margin-left",quizModel.carouselPosition);
      console.log(quizModel.carouselSlideTo)
      if(quizModel.carouselSlideTo != null){
        element.animate({marginLeft: quizModel.carouselSlideTo + 'px'}, 300, 'linear');
        quizModel.carouselSlideTo = null;
      }

      $scope.stopSlide = function(distance){
       clearInterval($scope.sliding);
      }

      $scope.slide = function(distance){
        $scope.sliding = setInterval(function(){
        //fixa stoppvillkor
        //var carousel = element;
        margin = parseInt(element.css("margin-left"));
        if(margin >= 0 && distance > 0){
          margin = 0;
          $scope.stopSlide()
        }else if ($(window).width() - element[0].scrollWidth - element[0].offsetLeft  < 0 || distance > 0){
          // console.log("window: " + $(window).width());
          // console.log("element :" + element.width());
          // console.log("element :" + element[0].scrollWidth);
          // console.log("overflow left: " + parseInt(element.css("margin-left")));
          // console.log($(window).width() - element[0].scrollWidth - parseInt(element.css("margin-left")));
          console.log(element);
          margin = parseInt(element.css("margin-left")) + distance;
          element.animate({marginLeft: margin + 'px'}, 50, 'linear');
        }else{
          $scope.stopSlide(); 
        }
        quizModel.carouselPosition = margin;
      }, 100);
    }
  }
});



