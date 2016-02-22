// create our angular module and inject firebase
angular.module('App', ['firebase'])

// create our main controller and get access to firebase
.controller('mainController', function($scope, $firebase) {

  $scope.foodData = [];
  $scope.result = {};
  $scope.searchTerm = null;
  $scope.searchTimer = null;
  $scope.maxResultCount = 10;
  $scope.minSearchTermLength = 3;
  $scope.searchTimeOut = 1000 * 0.5;
  $scope.showResults = false;;

  $scope.fb = new Firebase("https://ilenif.firebaseio.com/");


  $scope.initialFetch = function() {
    $scope.fb.once("value", function(data) {

      data.forEach(function(item) {
        $scope.foodData.push(item.val()["item"]);
        // console.log(item);
      });
      console.log('data retrieved');
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

  $scope.doTestSearch = function() {
    $scope.fb.once("value", function(data) {
      console.log('');
    });
  }

  $scope.searchTermUpdated = function() {
    $scope.showResults = ($scope.searchTerm != null && $scope.searchTerm.length >= $scope.minSearchTermLength);

    // start timer
    clearTimeout($scope.searchTimer);

    // start searching when specified time has passed
    $scope.searchTimer = setTimeout(function doSearch() {
      console.log('searchTerm: %s', $scope.searchTerm);

      $scope.showResults = true;
      // $scope.$apply();

    }, $scope.searchTimeOut)
  }

  $scope.searchTermUpdatedFbVersion = function() {
      // start timer
      clearTimeout($scope.searchTimer);

      // start searching when specified time has passed

      $scope.searchTimer = setTimeout(function doSearch() {
        console.log('searchTerm: %s', $scope.searchTerm);

        // $scope.fb.on("value", function(snapshot) {
        //   console.log(snapshot.val());
        // }, function (errorObject) {
        //   console.log("The read failed: " + errorObject.code);
        // });

        // do search
        $scope.fb
        .orderByChild("Name")
        .equalTo($scope.searchTerm.toUpperCase())
        .on("value", function(snapshot) {
          //console.log(snapshot.key());
          console.log("snapshot.val(): %s", snapshot.val());

          if(snapshot.val() != null) {
            // todo: make search result an array - can be many hits when fuzzy searching
            $scope.result.name = snapshot.val()[0]["Name"];
            $scope.result.id = snapshot.val()[0]["Enerc"];
          }

        });

      }, $scope.searchTimeOut)
  }

  $scope.initialFetch();

});
