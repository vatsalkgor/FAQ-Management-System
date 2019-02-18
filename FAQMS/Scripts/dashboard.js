var dashboard = angular.module('layout', []);
dashboard.controller('Layout', function ($scope) {
    $scope.count = { delivery: 20, ops: 52, audit: 65, er: 124, finance: 15 };

});

dashboard.factory("GetQuestions", function ($http) {
    question_answers = [];
    $http.get("GetQuestions/").then(function (response) {
        angular.forEach(response.data, function (key, value) {

            question_answers.push(key)
        })
    })
    return question_answers;
});

dashboard.controller('Dashboard', ['$scope', 'GetQuestions', function ($scope, GetQuestions) {
    $scope.dept = "Delivery";
    $scope.change = function (d) {
        $scope.dept = d;
    }
    $scope.questions_answers = GetQuestions
    $scope.showQuestion = function (id) {
        angular.element("#desc_question").html('<div class=col-lg-12 col-md-12 col-sm-12 col-xs-12>' +
            "<div class=card>" +
            "<div class=header>" +
            "<h2>" + $scope.questions_answers[id].Question + "</h2>"
            + "</div>" +
            "<div class=body>" +
            "<div class=row>"+
            "<div class=col-md-12>"+
            "<p>" + $scope.questions_answers[id].Answer + "</p>"+
            "</div>" +
            "<div class=col-md-3><button class='btn btn-success waves-effect waves-block'>Edit</button></div>"+
            "<div class=col-md-3><button class='btn btn-danger'>Delete</button></div>"+
            "<div class=col-md-3><button class='btn btn-danger'>Inactive</button></div>"+
            "<div class=col-md-3><button class='btn btn-danger' onclick='qclose()'>Close</button></div>"
            + "</div>"
            + "</div>"
            + "</div> "
            + '</div>')
        $("#desc_question")[0].scrollIntoView({ behavior: "smooth" });
    }
}])