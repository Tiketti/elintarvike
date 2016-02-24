// create our angular module and inject firebase
angular.module('App', ['firebase', 'ngAnimate'])

.controller('mainController', function($scope, $firebase, $http) {

  $scope.placeholder = "hae...";
  $scope.results = [];
  $scope.searchTerm = null;
  $scope.searchTimer = null;
  $scope.minSearchTermLength = 4;
  $scope.searchTimeOut = 1000 * 0.8;
  $scope.showResults = false;

  $scope.searchTermUpdated = function() {

    // search term too short, do nothing, hide results
    if($scope.searchTerm == null || $scope.searchTerm.length < $scope.minSearchTermLength) {
      $scope.results = [];
      $scope.showResults = false;

      return;
    }

    // start timer
    clearTimeout($scope.searchTimer);

    // give user a moment to finish typing.
    // only start searching when specified time has passed
    $scope.searchTimer = setTimeout(function doSearch() {
      // console.log('searchTerm: %s', $scope.searchTerm);

        $scope.results = [];

        // hello server
        $http.get('/api/search/' + $scope.searchTerm)
        .then(function success(response) {
          // console.log('data: %s', response);
          // console.dir(response.data);

          $scope.results = response.data;
        },
        function error(response) {
          console.log('error!');
        });

      if($scope.results.length > 0) $scope.showResults = true;
      $scope.$apply();

    }, $scope.searchTimeOut)
  }

});
