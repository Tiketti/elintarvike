angular.module('App', ['firebase', 'ngAnimate'])

.controller('mainController', function($scope, $firebase, $http) {

  $scope.placeholder = "hae...";
  $scope.results = [];
  $scope.searchTerm = null;
  $scope.searchTimer = null;
  $scope.minSearchTermLength = 4;
  $scope.searchTimeOut = 1000 * 0.8;
  $scope.showResults = false;

  var host = location.origin.replace(/^http/, 'ws')
  var ws = new WebSocket(host);

  // search results are received one by one
  ws.onmessage = function (event) {

    $scope.results.push(JSON.parse(event.data));
    $scope.showResults = true;
    $scope.$apply();

  };

  $scope.searchTermUpdated = function() {

    // search term too short, do nothing, hide results
    if($scope.searchTerm == null || $scope.searchTerm.length < $scope.minSearchTermLength) {
      $scope.results = [];
      $scope.showResults = false;

      return;
    }

    // clear timer, start new one
    clearTimeout($scope.searchTimer);

    // give user a moment to finish typing.
    // only start searching when specified time has passed
    $scope.searchTimer = setTimeout(function doSearch() {

        console.log($scope.searchTerm);
        $scope.results = [];
        $scope.$apply();

        ws.send($scope.searchTerm);

    }, $scope.searchTimeOut)
  }

});
