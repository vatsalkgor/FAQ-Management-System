var dashboard = angular.module('layout', ['ui.bootstrap','ui.bootstrap.pagination']);
dashboard.controller('Layout', function ($scope) {
    $scope.count = { delivery: 20, ops: 52, audit: 65, er: 124, finance: 15 };

});
dashboard.factory("questionService", function ($http) {
    return {
        getQues: function () {
            return $http.get('GetQuestions').then(function (response) {
                return response.data;
            })
        }
    }
})
dashboard.controller('Dashboard', ['$scope', "questionService", function ($scope, questionService) {
    $scope.dept = "Delivery";
    $scope.change = function (d) {
        $scope.dept = d;
    }
    var myPromise = questionService.getQues();
    myPromise.then(function (response) {
        $scope.questions_answers = response
        $scope.filteredTodos = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 10
            , $scope.maxSize = 5;

        $scope.$watch("currentPage + numPerPage", function () {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;
            $scope.filteredTodos = $scope.questions_answers.slice(begin, end);
        });
    })
    //questions_answers_data = GetQuestions.get_question_answers();
    //questions_answers_data.then(function (result) {
    //    $scope.questions_answers = result
    //    console.log($scope.questions_answers);
    //});
    //console.log(GetQuestions.length)
    //pagination logic

    //$scope.filteredTodos = []
    //    , $scope.currentPage = 1
    //    , $scope.numPerPage = 10
    //    , $scope.maxSize = 5;

    //$scope.$watch("currentPage + numPerPage", function () {
    //    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    //        , end = begin + $scope.numPerPage;
    //    //console.log($scope.questions_answers.length)
    //    $scope.filteredTodos = $scope.questions_answers.slice(begin, end);
    //});
    //console.log($scope.filteredTodos.length);

    //question click logic
    $scope.showQuestion = function (id) {
        angular.element("#desc_question").html(
            "<div class=card>" +
            "<div class=header>" +
            "<h2>" + $scope.questions_answers[id].Question + "</h2>" +
            "<ul class=header-dropdown>" +
            "<li class=dropdown onclick='qclose(" + id + ")'>" +
            "<a href=javascript:void(0)><i class=material-icons>close</i></a>" +
            "</li>" +
            "</ul>"
            + "</div>" +
            "<div class=body>" +
            "<div class=row>" +
            "<div class=col-md-12>" +
            "<p>" + $scope.questions_answers[id].Answer + "</p>" +
            "</div>" +
            "<div class=col-md-3><button class='btn btn-success waves-effect'>Edit</button></div>" +
            "<div class=col-md-3><button class='btn btn-danger'>Delete</button></div>" +
            "<div class=col-md-3><button class='btn btn-danger'>Inactive</button></div>" +
            "<div class=col-md-3><button class='btn btn-danger' onclick='qclose(" + id + ")'>Close</button></div>"
            + "</div>"
            + "</div>"
            + "</div> ")
        $("#desc_question")[0].scrollIntoView({ behavior: "smooth" });
    }
}])