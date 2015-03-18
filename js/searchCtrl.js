quizApp.controller('searchCtrl', function ($scope,quizModel) {

$scope.waitingForInput = false;



$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
       $scope.endOfPage();
   }
});

$scope.songs = function(query) {
	$scope.waitingForInput = true;
	var searchParams = {"query":query,type:"track",limit:50}
	quizModel.songSearch.get(searchParams, function(data){
		$scope.results = data.tracks.items;
		$scope.nextParams = JSON.parse("{\"" + data.tracks.next.substring(34).replace(/=/g,'":"').replace(/&/g,'","').replace(/\?/g,'') + "\"}");
		console.log($scope.nextParams)
		$scope.waitingForInput = false;
	});

}

$scope.endOfPage = function(){
	$scope.waitingForInput = true;
	var nextParams = $scope.nextParams;
	quizModel.songSearch.get(nextParams, function(data){
		for (track in data.tracks.items){
			$scope.results.push(data.tracks.items[track]);
		}
		$scope.nextParams = JSON.parse("{\"" + data.tracks.next.substring(34).replace(/=/g,'":"').replace(/&/g,'","').replace(/\?/g,'') + "\"}");
		$scope.waitingForInput = false;
	});
}
$scope.selectTrack = function(id){
	window.location = "#/track/" + id;
}

});