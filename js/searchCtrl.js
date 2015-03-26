quizApp.controller('searchCtrl', function ($scope,$sce,quizModel) {

$scope.waitingForInput = false;
$scope.status = "";

if ( quizModel.searchResults != {}){
	$scope.results = quizModel.searchResults.results;
	$scope.query = quizModel.searchResults.query;
	$scope.type = quizModel.searchResults.type;
}

typingTimer = null;	// initierar en timer.
doneTypingInterval = 300; //tid i ms som användaren får vänta efter att han skrivit till API-anrop.

$scope.sort = function(attr){
	if ($scope.sorted == attr[0]){
		var order = -1;
		$scope.sorted = attr[0] + "R";
	}else{
		var order = 1;
		$scope.sorted = attr[0];
	}
	$scope.results.sort(function(a,b){ 
		var attrA = a;
		var attrB = b;
		for (var level in attr){
			attrA = attrA[attr[level]];
			attrB = attrB[attr[level]];
		}
		var attrA = attrA.toLowerCase(); 
		var attrB = attrB.toLowerCase();
		if (attrA < attrB){
			return -1 * order;
		}else if (attrA > attrB){
			return 1 * order;
		}
		return 0
	});
	}

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
	var duplicate = false;
		for (track in data.tracks.items){
			duplicate = false;
			if ($scope.type == undefined || ($scope.type == 'artist' && $scope.query == data.tracks.items[track].artists[0].name) || ($scope.type == 'album' && $scope.query == data.tracks.items[track].album.name)){
				for (var alreadyIn in $scope.results){
					if($scope.results[alreadyIn].name == data.tracks.items[track].name && $scope.results[alreadyIn].artists[0].name == data.tracks.items[track].artists[0].name && $scope.results[alreadyIn].album.name == data.tracks.items[track].album.name ){
						duplicate = true;
					}
				}
				if (!duplicate){
					$scope.results.push(data.tracks.items[track]);
				}
			}
		quizModel.searchResults = {'results':$scope.results,'query':$scope.query,'type':$scope.type};
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
}
});