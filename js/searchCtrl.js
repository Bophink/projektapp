quizApp.controller('searchCtrl', function ($scope, $window, $document, $sce, quizModel) {

	$scope.waitingForInput = false; // bolean for cursor animation
	$scope.status = "";
	var win = angular.element($window); // selects the window object.

	if (quizModel.searchResults != null){ // if there are saved search results
		$scope.results = quizModel.searchResults.results;
		$scope.query = quizModel.searchResults.query;
		$scope.type = quizModel.searchResults.type;
		$scope.firstSearch = true; // activates search animation
	}

	$scope.sort = function(attr){
		// sorting function for the search results.
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

	win.scroll(function() {
		// Listens to the scroll event on page and checks if user is close to the bottom. If so, presents the next page from the API call.
	   	if((win.scrollTop() + win.height() - $document.height() > -50) && $scope.nextParams != null) {
	       $scope.songs($scope.nextParams);
	   	}
	},null);

	$scope.newSearch = function(query,type){
		// Uses the users search input and calls a function to make API call from Spotify.
		$scope.type = type;
		$scope.query = query;
		if (query == ""){ // error handling
			console.log("empty search string")
			return
		}

		$scope.firstSearch = true; // activates search animation
		$scope.results = []; // array to save the results from the API-call
		var searchParams = {"query":query,"type":"track","limit":50} // prepare the API call.
		$scope.songs(searchParams);
	}

	$scope.songs = function(searchParams){
		// Calls the API through the model. Pushes all the track results into an array and handles duplicates. 
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
			quizModel.searchResults = {'results':$scope.results,'query':$scope.query,'type':$scope.type}; // saves the search if user shifts window.
			}
			$scope.waitingForInput = false;

			// Error handling if there are no results, no more results or an unknown error is sent from the API.
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
			$scope.status = "";
			},function(data){
	  			console.log("There was a fatal error... goood!");
	  		}
	  	);
	}
});