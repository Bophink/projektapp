// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
quizApp.factory('quizModel',function ($resource, $cookieStore, $firebaseObject, $firebaseArray) { 
  
// var Quiz = {
// 	quizId : 1,
// 	title: 'My rock quiz', 
// 	creator : UserName/Id,
//	questions : [{
// 		question:'What is the name of the song?',
// 	    position:1,
// 	    songId:xxxxxxxxxx,
// 		correctAnswer: “2”, 
// 		answers: {
// 			1:”Austria”,
// 			2:”Australia!!”,
// 			3:”Estrella”,
// 			4:”Oyster Jaah!”
//			}
// 		},
//		{question:'Who is the artist that sings?',
//		etc...}
//	]
// };

var points = 0;

var Quiz = this.Quiz = {};

this.Quiz.questions=[];

this.searchResults = {}

var userAnswers = this.userAnswers = [];
//var currentQuizObj = ""; // the Quiz the user is currently creating/modifying.

var echonestApiKey = "6WKAD9UOX8AQCCF9O";

this.songSearch = $resource('https://api.spotify.com/v1/search');
this.song = $resource('https://api.spotify.com/v1/tracks/:id');
this.biography = $resource('http://developer.echonest.com/api/v4/artist/biographies',{"api_key":echonestApiKey,"license":'cc-by-sa'});

this.createQuiz = function(title, creator){
	console.log("create new quiz");

	// generera quizID
	//Quiz['quizId'] = 1;
	this.Quiz['title'] = title;
	this.Quiz['creator'] = creator;
	this.Quiz['questions'] = [];

	//add to Firebase

	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");

	//pushen returnerar sökvgen till objektet i Firebase.
	this.Quiz['quizId'] = ref.push({'title':title,
			'creator':creator,
			'questions':''
		}).path.o[1];
	quizRef= ref.child(this.Quiz.quizId);
	//console.log(this.Quiz.quizId);
	quizRef.update({'quizId':this.Quiz['quizId']});//lägger in Id (huvudnoden i objectet så vi kan hitta den senare)

}

this.renameQuiz = function(quizID, newTitle){
	//Gör så det fungerar med Firebase.
	this.Quiz['title'] = newTitle;
	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizID+"/");
	ref.update({'title' : title}); // tror koden är rätt men ej testad
}

this.getQuiz = function(sentQuiz){
	// vi fixar denna när vi har implementerat inloggning
	console.log("Hämtar quiz: "+sentQuiz.quizId+" Till modellen");
	this.Quiz.title = sentQuiz.title;
	this.Quiz.creator = sentQuiz.creator;
	this.Quiz.quizId = sentQuiz.quizId;

	this.Quiz.questions = [];
	var questionsRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+sentQuiz.quizId+"/questions/");
	console.log("https://radiant-inferno-6844.firebaseio.com/quizzes/"+sentQuiz.quizId+"/questions/");
	//this.Quiz.questions = [];
	 //AJAX


    questionsRef.on("value", function(snap){
    	snap.forEach(function(childSnapshot) {
    		var key= childSnapshot.key();
    		Quiz.questions.push(childSnapshot.val());//Lägger till frågorna i en lista.
    		//console.log(key + childSnapshot.val());
    	})
    },function (errorObject) {
    	console.log("The read failed: " + errorObject.code);
    })

	
	//this.Quiz.questions = $firebaseArray(questionsRef);
	//console.log(this.Quiz);
}
	

this.createQuestion = function(question,a,b,c,d,songId, albumImgUrl, fbId){
	return {"question":question,"songId":songId,"answers":{"a":a,"b":b,"c":c,"d":d},"img": albumImgUrl,"fbId":fbId};
}

this.setQuestion = function(questionObj,index){
	//Firebase referens till questions i det specifika quizet.
	var questionsRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizId+"/questions/");

	//console.log(questionObj);
	//Byta index till en FireBase index? eller båda?!
	
	//index = typeof index !== 'undefined' ? index : Quiz.questions.length;
	
	if(typeof index !== "undefined"){//if the question should be modified
		
		console.log(this.Quiz.questions);
		//Firebase
		//console.log("Vill ändra index: "+index);
		//questions[index]= questionObj;
		//console.log("newObj");
		//console.log(questions[index]);
		//console.log("index är: "+index);
		//console.log(questionObj);
		var qRef = questionsRef.child(questionObj.fbId);
		questionObj.position = index+1;
		qRef.update(questionObj);
		console.log("edit question fbId: "+questionObj.fbId+" . "+questionObj.position+" . "+index);
		//Modellen
		//console.log("alla frågor");
		//console.log(this.Quiz.questions);

		Quiz.questions[index]= questionObj;
		console.log(this.Quiz.questions);
	}else{// add new question
		console.log("add new Question"+questionObj.question);
		//Firebase
		//var fbId = questionRef.push(questionObj).path.o[3];
		//pushar på frågan sist. Behöver kolla $add, $save etc för att flytta runt frågor
		fbId = questionsRef.push(questionObj).path.o[3];

		//console.log(fbId);
		
		
		//Modellen
		questionObj['fbId'] = fbId;
		questionObj['position'] = index+1;
		this.Quiz.questions[index]=questionObj;
		//console.log("i new"+questionObj.fbId);

		
		questionsRef.child(fbId).update({'fbId':fbId});
		//console.log("Modellen");
		//console.log(this.Quiz.questions);
		console.log(this.Quiz.questions);
	}
	


}

this.getQuestion = function(index){
	return this.Quiz.questions[index];

}

this.removeQuestion = function(index){
	//Firebase
	//Anton!!!! denna var dte som inte fungerade va?
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz['quizId']+"/questions");
	questionRef= quizRef.child(this.Quiz.questions[index].fbId);
	questionRef.remove();

	//Modellen
	this.Quiz.questions.splice(index,1);
	
}

this.shiftPosition = function(currentPosition, newPosition){
	//Används denna?

	//Firebase
	//Ej implementerat

	//Modellen
	selectedQuestion = this.Quiz.questions.splice(currentPosition,1);
	this.Quiz.questions.splice(newPosition,0,selectedQuestion);
}


this.getQuizResult = function(){
	return points;
}

this.setQuizResult = function(num){
	points = num;
}

//logOut() {loggedin = false}


	//this.createQuiz ('testquizet','testarn');

  return this;

});