quizApp.controller('quizScoreCtrl', function ($scope,quizModel,$routeParams) {

	$scope.songList = [];
	for(var i = 0; i<quizModel.Quiz.questions.length; i++){
		quizModel.song.get({id:quizModel.Quiz.questions[i].songId}, function(data){
			console.log("track " + track)
			var track = data;
			$scope.songList.push(track);
		});
		//console.log($scope.songList);
	}
	console.log($scope.songList);

	$scope.getUserAnswers = function(){
		return quizModel.userAnswers;
	}

	$scope.getQuestions = function(){
		$scope.localQuestions = [];
		for (var k=0; k<quizModel.Quiz.questions.length; k++){
			var localQ = quizModel.Quiz.questions[k];
	 		localQ['position'] = k+1;
	 		localQ['question'] = localQ['question'].slice(0,200);
	 		$scope.localQuestions.push(localQ);
		}
		return $scope.localQuestions;
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	$scope.playIt = function(url,id){
		$("#preview")[0].setAttribute('src', url);
		$("#preview")[0].play();
		$scope.playing = id;
	}

	$scope.stopIt = function(url){
		$scope.playing = "";
		$("#preview")[0].pause();
		$("#preview")[0].currentTime = 0;
	}

	$scope.userAnswers = $scope.getUserAnswers();


});