quizApp.controller('searchCtrl', function ($scope,$sce,quizModel) {

$scope.waitingForInput = false;
$scope.status = "";



$(window).scroll(function() {
   if(($(window).scrollTop() + $(window).height() == $(document).height()) && $scope.nextParams != null) {
       $scope.songs($scope.nextParams);
   }
});

$scope.newSearch = function(query){
	$("#search").animate({marginTop:'100px'}, 500, 'swing');
	$scope.results = [];
	var searchParams = {"query":query,"type":"track","limit":50}
	$scope.songs(searchParams);
}

$scope.songs = function(searchParams) {
	$scope.waitingForInput = true;
	$scope.status = "Loading ..."
	quizModel.songSearch.get(searchParams, function(data){
		for (track in data.tracks.items){
			$scope.results.push(data.tracks.items[track]);
		}

		$scope.waitingForInput = false;

		if ($scope.results.length == 0){
			$scope.status = "No results found, try again."
			return
		}
		else if(data.tracks.next != null){
			$scope.nextParams = JSON.parse("{\"" + data.tracks.next.substring(34).replace(/=/g,'":"').replace(/&/g,'","').replace(/\?/g,'') + "\"}");
		}else{
			$scope.nextParams = null;
			$scope.status = "No more results found, try again."
			return
		}
		$scope.status = ""
	},function(data){
  			console.log("There was a fatal error... goood!");
  	});
}

$scope.selectTrack = function(id){
	window.location = "#/track/" + id;
}

$scope.playIt = function(url,id){
	console.log("play");
	$("#preview")[0].setAttribute('src', url);
	$("#preview")[0].play();
	$scope.playing = id;
}

$scope.stopIt = function(){
	console.log("stop");
	$scope.playing = "";
	$("#preview")[0].pause();
	$("#preview")[0].currentTime = 0;
}

$("#preview")[0].addEventListener('ended', function(){
	console.log("end");
	$scope.stopIt();
});

});