quizApp.controller('trackCtrl', function ($scope,quizModel,$routeParams,$sce) {

	//$scope.trackId = $routeParams.trackId
	var trackId = $routeParams.trackId;
	$scope.alert = [];
	// quiz-position
	if($routeParams.trackId.substring(0,5) === "quiz-"){
		var quizPosition = Number($routeParams.trackId.substring(5))-1;
		$scope.question = quizModel.getQuestion(quizPosition);
		trackId = $scope.question.songId;
		$scope.q = $scope.question.question;
		$scope.a = $scope.question.answers['a'];
		$scope.b = $scope.question.answers['b'];
		$scope.c = $scope.question.answers['c'];
		$scope.d = $scope.question.answers['d'];
	}

	$scope.waitingForInput = true;
	quizModel.song.get({id:trackId}, function(data){
		console.log(data);
		$scope.track = data;
		$scope.waitingForInput = false;
		quizModel.biography.get({id:'spotify:artist:' + $scope.track.artists[0].id}, function(data){
			console.log(data);
			for (bio in data.response.biographies){
				if (data.response.biographies[bio].site == 'last.fm' && data.response.biographies[bio].text.length > 200){
					$scope.bio = data.response.biographies[bio];
				}
			}
		});
		
	});

	$scope.closeAlert = function(index){
		$scope.alert.splice(index,1);
	}
	

	$scope.done = function(q,a,b,c,d){
		if(q == undefined || a == undefined || b == undefined || c == undefined || d == undefined || q == "" || a == "" || b == "" || c == "" || d == ""){
			$scope.alert.push({'type':'Error!','text':'Please make sure that you have filled out all the text fields.'});
			return
		}
		var answers = [a,b,c,d];
		for(var c = 0; c < answers.length-1; c++){
			for(var i = c+1; i <= answers.length-1; i++){
				if (answers[c] == answers[i]){
					$scope.alert.push({'type':'Duplicate answers!','text':'Please make sure that not 2 answers are the same.'});
					return
				}
			}
		}
		quizModel.setQuestion(quizModel.createQuestion(q,a,b,c,d,$scope.track.id,$scope.track.album.images[1].url),quizPosition);
		quizModel.results = {};
		window.location = "#/search/";
	}

});