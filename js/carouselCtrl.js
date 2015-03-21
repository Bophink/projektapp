quizApp.controller('CarouselCtrl', function($scope,quizModel) {
  
  // '-10' due to angular restrictions to pausing the carousel
  $scope.myInterval = -10;

  $scope.update = function(){
    $scope.slides = [];
    var slide = [];
    var quiz = quizModel.getQuiz();

    for(var k = 0; k<quiz.questions.length; k++){
      var localQ = quiz.questions[k];
      localQ.position = k+1;
      slide.push(localQ);

      // width => 992px -> laptop & desktop
      if($(window).width() >= 992){
        if((k+1)%6 === 0 || (k+1) === quiz.questions.length){
          $scope.slides.push(slide);
          slide = [];
        }
      }
      //  992 > width => 768 -> tablet
      else if($(window).width() < 992 && $(window).width() >= 768){
        if((k+1)%4 === 0 || (k+1) === quiz.questions.length){
          $scope.slides.push(slide);
          slide = [];
        }
      }
      // width < 768   -> phone
      else{
        if((k+1)%3 === 0 || (k+1) === quiz.questions.length){
          $scope.slides.push(slide);
          slide = [];
        } 
      }
    }
  }  

  $scope.selectTrack = function(pos){
    window.location = "#/track/quiz-" + pos;
  }

  $scope.removeTrack = function(pos){
    quizModel.removeQuestion(pos-1);
    this.update();
  }

  $(window).on("resize.doResize", function(){
      $scope.$apply(function() {
        $scope.update();
      });
  });

  $scope.$on("$destroy", function(){
    $(window).off("resize.doResize");
  });

  $scope.update();
});
