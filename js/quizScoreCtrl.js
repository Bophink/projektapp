quizApp.controller('quizScoreCtrl', function ($scope,quizModel,$routeParams) {


	$scope.getUserAnswers = function(){
		return quizModel.userAnswers;
	}

	$scope.getQuestions = function(){
		$scope.localQuestions = [];
		for (var k=0; k<quizModel.Quiz.questions.length; k++){
			var localQ = quizModel.Quiz.questions[k];
	 		localQ['position'] = k+1;
	 		console.log('localQ: ' + localQ);
	 		$scope.localQuestions.push(localQ);
		}

		console.log($scope.localQuestions);
		return $scope.localQuestions;
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	$scope.userAnswers = $scope.getUserAnswers();


});