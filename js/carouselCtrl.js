quizApp.controller('CarouselCtrl', function($scope,quizModel) {

  $scope.initialize = function(){
    $scope.questions = quizModel.Quiz.questions;  
  }

  $scope.selectTrack = function(pos){
    window.location = "#/track/quiz-" + pos;
  }

  $scope.removeTrack = function(pos){
    // skickar in frågan som ska tas bort samt en funktion som fungerar som callback-funktion i modellen
    quizModel.removeQuestion($scope.questions[pos-1], function(){
      $scope.initialize; 
      quizModel.shiftPosition($scope.questions, $scope.initialize);
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
      quizModel.shiftPosition($scope.questions,$scope.initialize);
    },
    accept: function (sourceItemHandleScope, destSortableScope) {
      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
    }
  };

  $scope.initialize();
});





