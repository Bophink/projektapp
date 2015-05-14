quizApp.controller('headerCtrl', function ($scope, $firebaseObject, quizModel) {
	//Gets which view we're in to decide if we should display the Quiz title or not in the header
	var location = window.location.hash.split("/");
	$scope.view = location[0]+"/"+location[1];
	//Gets questions from the model so we can decide if the quiz is previewable (and if it is, show the preview button)
	$scope.questions = function(){
		return quizModel.Quiz.questions.length;
	}
	//Gets quiz title
	$scope.getTitle = function(){
		return quizModel.Quiz.title;
	}
});