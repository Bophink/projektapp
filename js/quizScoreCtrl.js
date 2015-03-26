quizApp.controller('quizScoreCtrl', function ($scope,quizModel,$routeParams) {



	$scope.praise = function(){
		var praiseDict = {
			'0':'Are you drunk?',
			'0.1':'Are you even trying?',
			'0.2':'Bruh...',
			'0.3':'Practice makes perfect',
			'0.4':'\"Good job\"',
			'0.5':'Good job!',
			'0.6':'Great!',
			'0.7':'Awesome',
			'0.8':'Wow!',
			'0.9':'Amazeballs!',
			'1.0':'Perfect score!'};
		var maxScore = quizModel.Quiz.questions.length * 10;
		console.log(($scope.getPoints()/maxScore).toString().substr(0,3));
		return praiseDict[($scope.getPoints()/maxScore).toString().substr(0,3)];
	}

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