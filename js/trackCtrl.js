quizApp.controller('trackCtrl', function ($scope,quizModel,$routeParams,$sce) {


	var trackId = $routeParams.trackId;
	$scope.alert = [];
	$scope.fbId='';
	// quiz-position
	if($routeParams.trackId.substring(0,5) === "quiz-"){
		$scope.quizPosition = Number($routeParams.trackId.substring(5))-1;
		//console.log($scope.quizPosition);
		//console.log(quizModel.Quiz.questions);
		
		$scope.question = quizModel.Quiz.questions[$scope.quizPosition];
		console.log("in läst i track: "+$scope.question.question);
		trackId = $scope.question.songId;
		$scope.q = $scope.question.question;
		$scope.a = $scope.question.answers['a'];
		$scope.b = $scope.question.answers['b'];
		$scope.c = $scope.question.answers['c'];
		$scope.d = $scope.question.answers['d'];
		$scope.fbId = $scope.question.fbId;
	}

	$scope.waitingForInput = true;
	quizModel.song.get({id:trackId}, function(data){
		//console.log(data);
		$scope.track = data;
		$scope.waitingForInput = false;
		quizModel.biography.get({id:'spotify:artist:' + $scope.track.artists[0].id}, function(data){
			//console.log(data);
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
		for(var j = 0; j < answers.length-1; j++){
			for(var i = j+1; i <= answers.length-1; i++){
				if (answers[j] == answers[i]){
					$scope.alert.push({'type':'Duplicate answers!','text':'Please make sure that not 2 answers are the same.'});
					return
				}
			}
		}
		//get lendth of questions!?
		quizModel.carouselSlideTo = ((quizModel.Quiz.questions.length+2)*-220)+$(window).width(); 
		quizModel.setQuestion(quizModel.createQuestion(q,a,b,c,d,$scope.track.id,$scope.track.album.images[1].url),$scope.quizPosition,function(){window.location = "#/search/"});
		quizModel.results = {};
	}

});