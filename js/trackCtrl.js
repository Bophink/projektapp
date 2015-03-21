quizApp.controller('trackCtrl', function ($scope,quizModel,$routeParams,$sce) {

	//$scope.trackId = $routeParams.trackId
	console.log("param1: "+$routeParams.trackId);
	console.log($routeParams.trackId.substring(0,5));
	var trackId = $routeParams.trackId;
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
			$scope.bio = data.response.biographies[0];
			
			console.log($scope.bio);
		});
		
	});


	

	$scope.done = function(q,a,b,c,d){
		//kolla att allt är ifyllt
		quizModel.setQuestion(quizModel.createQuestion(q,a,b,c,d,$scope.track.id,$scope.track.album.images[1].url),quizPosition);
		console.log(quizModel.Quiz);
		window.location = "#/search/";
	}

	


});