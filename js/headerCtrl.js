quizApp.controller('headerCtrl', function ($scope, $firebaseObject, quizModel) {
	var location = window.location.hash.split("/");
	$scope.view = location[0]+"/"+location[1];
	//tar ej hänsyn till sista paremtern i quiz och track
	$scope.questions = function(){
		return quizModel.Quiz.questions.length;
	}
	$scope.getTitle = function(){
		return quizModel.Quiz.title;
	}
});