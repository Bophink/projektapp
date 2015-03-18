quizApp.controller('CarouselCtrl', function($scope) {
  
  // '-10' due to angular restrictions to pausing the carousel
  $scope.myInterval = -10;

  // connect to quizObject in model
  $scope.slides = [
    {image: 'http://www.smashingmagazine.com/images/music-cd-covers/27.jpg'},
    {image: 'http://www.mp3jam.org/blog/wp-content/uploads/2014/05/d-face-for-christina-aguilera-bionic-album-cover.jpg'},
    {image: 'http://truenorthinc.com/wp-content/uploads/2013/05/album_art_09.jpg'},
    {image: 'http://editorial.designtaxi.com/news-super0703/4.jpg'},
    {image: 'http://www.smashingmagazine.com/images/music-cd-covers/27.jpg'},
    {image: 'http://www.mp3jam.org/blog/wp-content/uploads/2014/05/d-face-for-christina-aguilera-bionic-album-cover.jpg'},
    {image: 'http://truenorthinc.com/wp-content/uploads/2013/05/album_art_09.jpg'}
  ];
  
  $scope.$watch('slides', function(values) {

    var allSlides = [];
    var oneSlide = [];

    for (var i = 0; i < $scope.slides.length; i ++) {
      oneSlide.push($scope.slides[i]); 

      if ((i+1)%6 === 0 || i === $scope.slides.length-1) {
        allSlides.push(oneSlide);
        oneSlide=[];
      }
    }

    $scope.groupedSlides = allSlides;
  }, true);
});
