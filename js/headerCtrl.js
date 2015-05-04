quizApp.controller('headerCtrl', function ($scope, $firebaseObject, quizModel) {
	var location = window.location.hash.split("/");
	$scope.position = location[0]+"/"+location[1];
	//tar ej hänsyn till sista paremtern i quiz och track
	// $scope.title = quizModel.Quiz.title;

	if(quizModel.Quiz === undefined){
		$scope.title = '';
	}else{
		$scope.title = quizModel.Quiz.title;
	}
});