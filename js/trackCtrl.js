quizApp.controller('trackCtrl', function ($scope,quizModel,$routeParams,$sce) {

	//$scope.trackId = $routeParams.trackId
	$scope.waitingForInput = true;
	quizModel.song.get({id:$routeParams.trackId}, function(data){
		$scope.track = data;
		$scope.waitingForInput = false;
	});

	$scope.done = function(q,a,b,c,d){
		//kolla att allt är ifyllt
		quizModel.setQuestion(quizModel.createQuestion(q,a,b,c,d,$scope.track.id,$scope.track.album.images[1].url));
		console.log(quizModel.Quiz);
		window.location = "#/search/";
	}


});