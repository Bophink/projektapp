quizApp.controller('searchCtrl', function ($scope, $window, $document, $sce, quizModel) {

	$scope.waitingForInput = false;
	$scope.status = "";
	var win = angular.element($window);

	if ( quizModel.searchResults != null){
		$scope.results = quizModel.searchResults.results;
		$scope.query = quizModel.searchResults.query;
		$scope.type = quizModel.searchResults.type;
		$scope.firstSearch = true;
	}

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

	win.scroll(function() {
	   	if((win.scrollTop() + win.height() - $document.height() > -50) && $scope.nextParams != null) {
	       $scope.songs($scope.nextParams);
	   }
	},null);

	$scope.newSearch = function(query,type){
		$scope.type = type;
		$scope.query = query;
		if (query == ""){
			//felhantering
			console.log("empty search string")
			return
		}
		//this is fine...
		$scope.firstSearch = true;
		//document.getElementById("search").className = "search-animateSlideUp";
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
			$scope.status = "";
			},function(data){
	  			console.log("There was a fatal error... goood!");
	  		}
	  	);
	}
});


