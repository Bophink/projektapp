quizApp.controller('CarouselCtrl', function($scope,quizModel) {
  
  // '-10' due to angular restrictions to pausing the carousel
  $scope.myInterval = -10;

  //Sets number of questions/page When page loads
  if($(window).width() > 992){
    $scope.nrOfQperSlide=6; 
  }else if($(window).width() < 768){
    $scope.nrOfQperSlide=3;
  }else{
    $scope.nrOfQperSlide=4;
  }

  $scope.questions = quizModel.Quiz.questions;
  
  

  $scope.update = function(oldWidth){
    var newWidth = $(window).width();

    if(quizModel.Quiz.questions){
      //console.log("updates Carousel"+ quizModel.Quiz.questions.length);

      //Kontrollerar om man nått en brytpunkt vid window.resize eller om man lagt till/ tagit bort fråga
      if(oldWidth >= 992 && newWidth < 992){
        $scope.$apply(function(){
          $scope.nrOfQperSlide=4;
          $scope.createCarousel(4);
        });
      }else if(oldWidth < 992 && newWidth >= 992){
        $scope.$apply(function(){
          $scope.nrOfQperSlide=6;
          $scope.createCarousel(6);
        });
      }else if((oldWidth < 992 && oldWidth >= 768) && (newWidth < 768)){
        $scope.$apply(function(){
          $scope.nrOfQperSlide = 3;
          $scope.createCarousel(3);
        });
      }else if((oldWidth < 768) && (newWidth >= 768)){
        $scope.$apply(function(){
          $scope.nrOfQperSlide=4;
          $scope.createCarousel(4);
        });
      }else if(quizModel.Quiz.questions.length != $scope.quisLen){
        $scope.createCarousel($scope.nrOfQperSlide);
      }

      ow = newWidth;
    }
  }

  $scope.createCarousel = function(nrOfQperSlide){
    //console.log("Carousel is happening");
    $scope.slides = [];
    var slide = [];
    $scope.quisLen = quizModel.Quiz.questions.length;

    for(var k = 0; k<quizModel.Quiz.questions.length; k++){
      var localQ = quizModel.Quiz.questions[k];
      localQ.position = k+1;
      slide.push(localQ);

        if((k+1)%nrOfQperSlide === 0 || (k+1) === quizModel.Quiz.questions.length){
          $scope.slides.push(slide);
          slide = [];
        }
    }
  }  

  $scope.selectTrack = function(pos){
    window.location = "#/track/quiz-" + pos;
  }

  $scope.removeTrack = function(pos){
    quizModel.removeQuestion(pos-1);
    $scope.update();
  }

  ow = $(window).width();
  $(window).on("resize.doResize", function(){
        $scope.update(ow);
      
  });

  $scope.$on("$destroy", function(){
    $(window).off("resize.doResize");
  });

  $scope.update();
});
