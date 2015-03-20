quizApp.controller('CarouselCtrl', function($scope,quizModel) {
  
  // '-10' due to angular restrictions to pausing the carousel
  $scope.myInterval = -10;
  $scope.slides = [];
  var slide = [];
  var quiz = quizModel.getQuiz();

  for(var k = 0; k<quiz.questions.length; k++){
    var localQ = quiz.questions[k];
    localQ.position = k;
    slide.push(localQ);
    if((k+1)%6 === 0 || (k+1) === quiz.questions.length){
      $scope.slides.push(slide);
      slide = [];
    }
  }

  $scope.selectTrack = function(pos){
    window.location = "#/track/quiz-" + pos;
  }
});
