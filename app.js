// create our angular module and inject firebase
angular.module('App', ['firebase', 'ngAnimate'])

// create our main controller and get access to firebase
.controller('mainController', function($scope, $firebase) {

  $scope.foodData = [];
  $scope.result = {};
  $scope.searchTerm = null;
  $scope.searchTimer = null;
  $scope.maxResultCount = 10;
  $scope.minSearchTermLength = 4;
  $scope.searchTimeOut = 1000 * 0.5;
  $scope.showResults = false;

  $scope.fb = new Firebase("https://ilenif.firebaseio.com/");

  $scope.initialFetch = function() {
    $scope.fb.once("value", function(data) {

      data.forEach(function(item) {
        $scope.foodData.push(item.val()["item"]);
        // var o = item.val()["item"];
        // $scope.foodData.push(
        //   {
        //     "Name": o["Name"],
        //     "Enerc": $scope.joulesToCalories(o["Enerc"]),
        //     "Choavl": o["Choavl"],
        //     "Prot": o["Prot"],
        //     "Fat": o["Fat"],
        //     "FineliId": o["FineliId"]
        //   }
        // );

      });
      console.log('data ready');
      $scope.$apply();
    });
  }

  $scope.joulesToCalories = function(val) {
    if(val === null || val.length < 1) return "";

    var dec = parseFloat(val.replace(',', '.'));
    return (dec / 4.184).toFixed(0);
  }

  $scope.formatDecimal = function(val) {
    if(val === null || val.length < 1) return "";

    return parseFloat(val.replace(',', '.')).toFixed(1);
  }

  // $scope.searchTermUpdated = function() {
  //   $scope.showResults = ($scope.searchTerm != null && $scope.searchTerm.length >= $scope.minSearchTermLength);
  //
  //   // start timer
  //   clearTimeout($scope.searchTimer);
  //
  //   // start searching when specified time has passed
  //   $scope.searchTimer = setTimeout(function doSearch() {
  //     console.log('searchTerm: %s', $scope.searchTerm);
  //     $scope.showResults = true;
  //     // $scope.$apply();
  //
  //   }, $scope.searchTimeOut)
  // }

  $scope.initialFetch();

});
