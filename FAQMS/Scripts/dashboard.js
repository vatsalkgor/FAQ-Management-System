var dashboard = angular.module('layout', []);
dashboard.controller('Layout', function ($scope) {
    $scope.count = { delivery: 20, ops: 52, audit: 65, er: 124, finance: 15 }; 
    
});

dashboard.controller('Dashboard', function ($scope) {
    $scope.dept = "Delivery";
    $scope.change = function (d) {
        $scope.dept = d;
    }
})