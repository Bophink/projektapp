quizApp.controller('quizScoreCtrl', function ($scope,quizModel,$routeParams) {

	$scope.calculatePraise = function(){
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
			'1':'Perfect score!'};
		var maxScore = quizModel.Quiz.questions.length * 10;
		console.log('Praise: ' + ($scope.getPoints()/maxScore).toString().substr(0,3));
		return praiseDict[($scope.getPoints()/maxScore).toString().substr(0,3)];
	}

	$scope.getQuestions = function(){
		$scope.questions = [];
		//loops through all the questions in quiz and creates a temporary local question
		for (var k=0; k < quizModel.Quiz.questions.length; k++){
			var localQ = quizModel.Quiz.questions[k];
	 		localQ['question'] = localQ['question'].slice(0,200);
	 		// adds the local question to the scope
	 		$scope.questions.push(localQ);
	 		// calls function to recieve song from Spoitfy API and add it to the question
	 		$scope.getSong(k, localQ);
		}
	}

	$scope.getSong = function(k, question){
		// retrieves track from Spotify
		quizModel.song.get({id:question.songId}, function(track){
			question.song = track.name;
			question.artist = track.artists[0].name;
			question.album = track.album.name;
			question.songImg = track.album.images[2].url;
			question.preview_url = track.preview_url;
			question.songId = track.id;
			// Overwrites the question in scope with the same question + track information
			$scope.questions[k] = question;
		});
	}

	$scope.getUserAnswers = function(){
		return quizModel.userAnswers;
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
	$scope.praise = $scope.calculatePraise(); 
	$scope.userAnswers = $scope.getUserAnswers();
	$scope.getQuestions();
});