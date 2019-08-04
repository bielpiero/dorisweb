var app = angular.module("app", ['ngRoute']);

app.controller("NavigationCtrl", ["$scope", "$location", function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };

    

}]);


app.config(['$routeProvider', function ($routeProvider) {


    $routeProvider.when('/home', {
        templateUrl: "pages/home.html",
        controller: "Pagina1Controller"
    });

    $routeProvider.when('/mapping', {
        templateUrl: "pages/mapping.html",
        controller: "mapping_Controller"
    });

    $routeProvider.when('/expressions', {
        templateUrl: "pages/expressions.html",
        controller: "expressions_Controller"
    });

    $routeProvider.when('/arm', {
        templateUrl: "pages/arm.html",
        controller: "arm_Controller"
    });

    $routeProvider.when('/programming', {
        templateUrl: "pages/programming.html",
        controller: "programming_controller"
    });

    $routeProvider.when('/feelings', {
        templateUrl: "pages/feelings.html",
        controller: "feelings_controller"
    });

    $routeProvider.otherwise({
        redirectTo: "/home"
    });   

}]);


app.controller("Pagina1Controller", ["$scope", function ($scope) {
    $scope.mensaje = "Texto cargado desde el controlador Pagina1Controller";
    svg_first_sector_load = false;
}]);

app.controller("arm_Controller", ["$scope", function ($scope) {
    //$scope.mensaje = "Texto cargado para Arm desde el controlador Pagina1Controller";
    addMessage(12, '');
    svg_first_sector_load = false;
}]);

app.controller("mapping_Controller", ["$scope", function ($scope) {
   
    addMessage(34, '');
    //Section for checking landmarks features and sites
  //  document.addEventListener("load",load_check_map_options);
  load_check_map_options();
  svg_first_sector_load = false;
  document.getElementById("mySVG").setAttribute("data-svg-x",parseFloat(document.getElementById("mySVG").getAttribute("width")));
  document.getElementById("mySVG").setAttribute("data-svg-y",parseFloat(document.getElementById("mySVG").getAttribute("height")));
  setTimeout(function(){
    addMessage(1, '');
    }, 500);
}]);

app.controller("expressions_Controller", ["$scope", function ($scope) {


    //  expressions_Init(message_websocket_recibed);
    addMessage(0, '');
    createVoiceRecocnitionObject();
    svg_first_sector_load = false;


}]);


app.controller("feelings_controller", ["$scope", function ($scope) {
    $scope.mensaje = "Texto cargado desde el controlador de feelings";
    createGraphs();
    svg_first_sector_load = false;
}]);

