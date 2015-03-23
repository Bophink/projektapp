quizApp.controller('searchCtrl', function ($scope,$sce,quizModel) {

$scope.waitingForInput = false;
$scope.status = "";


typingTimer = null;	// initierar en timer.
doneTypingInterval = 300; //tid i ms som användaren får vänta efter att han skrivit till API-anrop.


$(window).scroll(function() {
   	if(($(window).scrollTop() + $(window).height() - ($(document).height()) > -50) && $scope.nextParams != null) {
       $scope.songs($scope.nextParams);
   }
});

$scope.newSearch = function(query,type){
	$scope.type = type;
	$scope.query = query;
	if (query == ""){
		return
	}
	$("#search").animate({marginTop:'100px'}, 500, 'swing');
	$scope.results = [];
	var searchParams = {"query":query,"type":"track","limit":50}
	$scope.songs(searchParams,type,query);
}

$scope.songs = function(searchParams) {
	$scope.waitingForInput = true;
	$scope.status = "Loading ..."
	quizModel.songSearch.get(searchParams, function(data){
		for (track in data.tracks.items){
			if ($scope.type == undefined || ($scope.type == 'artist' && $scope.query == data.tracks.items[track].artists[0].name) || ($scope.type == 'album' && $scope.query == data.tracks.items[track].album.name)){
				$scope.results.push(data.tracks.items[track]);
			}
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

$scope.playIt = function(url,id){
	$("#preview")[0].setAttribute('src', url);
	$("#preview")[0].play();
	$scope.playing = id;
}

$scope.stopIt = function(){
	$("#preview")[0].pause();
	$("#preview")[0].currentTime = 0;
	$scope.playing = "";
}

$("#preview")[0].addEventListener('ended', function(){
	$scope.stopIt();
});

$('.track-search-field').keyup(function(){
    clearTimeout(typingTimer);
    typingTimer = setTimeout($scope.doneTyping, doneTypingInterval);//$scope.doneTypingInterval);
    //console.log(typingTimer);
});
//on keydown, clear the countdown 
$('.track-search-field').keydown(function(){
    clearTimeout(typingTimer);
    //console.log("nollställd "+typingTimer);
});

//user is "finished typing," do something
$scope.doneTyping = function() {
	$scope.newSearch($scope.query);
	console.log("gör sök på: "+$scope.query);
}
});