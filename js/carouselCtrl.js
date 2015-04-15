quizApp.controller('CarouselCtrl', function($scope,quizModel) {

  $scope.C2 = [];
  var quiz = quizModel.getQuiz();

  for(var k = 0; k<quiz.questions.length; k++){
    var localQ = quiz.questions[k];
    localQ.position = k+1;
    $scope.C2.push(localQ);
  }

  $scope.selectTrack = function(pos){
    window.location = "#/track/quiz-" + pos;
  }

  $scope.removeTrack = function(pos){
    quizModel.removeQuestion(pos-1);
  }
  //Carousel 2
  //Definiera scrollzoner
  $("#sortable-container").css('marginLeft',quizModel.carouselPosition);
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
      console.log(obj);
      quizModel.shiftPosition(obj.source.index,obj.dest.index)
    },
    accept: function (sourceItemHandleScope, destSortableScope) {
      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
    }
  };
  $scope.slide = function(distance){
    $scope.sliding = setInterval(function(){
      //fixa stoppvillkor
      var carousel = $("#sortable-container");
      margin = parseInt(carousel.css("margin-left")) + distance;
      if(margin >= 0 && distance > 0){
        margin = 0;
      }
      console.log($(window).width() - carousel[0].scrollWidth - parseInt(carousel.css("margin-left")));
      if ($(window).width() - carousel[0].scrollWidth - parseInt(carousel.css("margin-left"))  < 2 || distance > 0){
        carousel.animate({marginLeft: margin + 'px'}, 100, 'linear');
      }
      quizModel.carouselPosition = margin;
    }, 100);
  }

  $scope.stopSlide = function(distance){
   clearInterval($scope.sliding);
  }
});
//