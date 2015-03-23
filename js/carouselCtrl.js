quizApp.controller('CarouselCtrl', function($scope,quizModel) {
  
  // '-10' due to angular restrictions to pausing the carousel
  $scope.myInterval = -10;

  //Sets number of questions/page When page loads
  if($(window).width() > 992){
    $scope.nrOfQperSlide=6;
    console.log('i lg '+$scope.nrOfQperSlide);  
  }else if($(window).width() < 768){
    $scope.nrOfQperSlide=3;
    console.log('i xs '+$scope.nrOfQperSlide);
  }else{
    $scope.nrOfQperSlide=4;
    console.log('i sm '+$scope.nrOfQperSlide);
  }
  
  

  $scope.update = function(oldWidth){
    var newWidth = $(window).width();

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
    }else if(quizModel.getQuiz().questions.length != $scope.quisLen){
      $scope.createCarousel($scope.nrOfQperSlide);
      console.log($scope.nrOfQperSlide);
    }

    ow = newWidth;
  }

  $scope.createCarousel = function(nrOfQperSlide){
    console.log("i create");
    $scope.slides = [];
    var slide = [];
    var quiz = quizModel.getQuiz();
    $scope.quisLen = quizModel.getQuiz().questions.length;

    for(var k = 0; k<quiz.questions.length; k++){
      var localQ = quiz.questions[k];
      localQ.position = k+1;
      slide.push(localQ);

        if((k+1)%nrOfQperSlide === 0 || (k+1) === quiz.questions.length){
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
