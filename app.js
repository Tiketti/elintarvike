// create our angular module and inject firebase
angular.module('App', ['firebase', 'ngAnimate'])

.controller('mainController', function($scope, $firebase) {

  $scope.placeholder = "ladataan...";
  $scope.foodData = [];
  $scope.results = [];
  $scope.searchTerm = null;
  $scope.previousSearchTerm = '';
  $scope.searchTimer = null;
  $scope.minSearchTermLength = 4;
  $scope.searchTimeOut = 1000 * 0.8;
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
      $scope.placeholder = "hae...";
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

  $scope.searchTermUpdated = function() {
    // search term too short, do nothing, hide results
    if($scope.searchTerm == null || $scope.searchTerm.length < $scope.minSearchTermLength) {
      $scope.results = [];
      $scope.showResults = false;
      // $scope.previousSearchTerm = $scope.searchTerm;
      return;
    }

    // search term hasn't changed, return
    if($scope.searchTerm == $scope.previousSearchTerm) return;

    // start timer
    clearTimeout($scope.searchTimer);

    // give user a moment to finish typing.
    // only start searching when specified time has passed
    $scope.searchTimer = setTimeout(function doSearch() {
      console.log('searchTerm: %s', $scope.searchTerm);

      if($scope.searchTerm.length > $scope.minSearchTermLength && $scope.previousSearchTerm != "" && $scope.searchTerm.startsWith($scope.previousSearchTerm)) {

        $scope.previousSearchTerm = $scope.searchTerm;

        // user keeps adding to earlier search, loop through
        // already filtered list of results
        for(var i = $scope.results.length; i--; i >= 0) {
          var item = $scope.results[i];

          if(item.Name.indexOf($scope.searchTerm.toUpperCase()) < 0) {
            console.log('search not found for item %s', item.Name);
            $scope.results.splice(i, 1);
          }
        }

      } else {
        // search term has changed enough, start from whole data set
        $scope.results = [];
        $scope.previousSearchTerm = $scope.searchTerm;

        $scope.foodData.forEach(function(item) {
          if(item.Name.indexOf($scope.searchTerm.toUpperCase()) > -1) $scope.results.push(item);
        });

      }

      if($scope.results.length > 0) $scope.showResults = true;
      $scope.$apply();

    }, $scope.searchTimeOut)
  }

  $scope.initialFetch();

});
