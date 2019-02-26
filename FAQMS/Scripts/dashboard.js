var dashboard = angular.module('layout', ['ui.bootstrap', 'ui.bootstrap.pagination']);
dashboard.controller('Layout', function ($scope) {
    //http request to get the count of all depts
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
    var getQuesPromise = questionService.getQues();
    getQuesPromise.then(function (response) {
        //Substring Logic
        for (var i = 0; i < response.length; i++) {
            if (response[i].Answer.length > 100) {
                short_ans = response[i].Answer.substr(0, 101) + "...";
            } else {
                short_ans = response[i].Answer;
            }
            response[i].sa = short_ans;
        }
        $scope.questions_answers = response
        //Pagination Logic 
        $scope.filteredTodos = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 10
            , $scope.maxSize = 10;

        $scope.$watch("currentPage + numPerPage", function () {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;
            $scope.filteredTodos = $scope.questions_answers.slice(begin, end);
        });
    })

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

//controller for Create Question/Edit Question

//controller for Tags Management
dashboard.factory("getTags", function ($http) {
    return {
        getTags: function () {
            return $http.get("GetTags").then(function(response){
                return response.data
            })
        }
    }
})

dashboard.controller("tagsmgmt", function ($scope,getTags) {
    tagsPromise = getTags.getTags();
    tagsPromise.then(function(response){
        $scope.tags = response;
    })
    $scope.save = function (id) {
        alert($("#" + id).html())

        //HTTP POST request for updating the value

        //alert here for success/failure
    }
    $scope.delete = function (id) {
        //ask for confirmation

        //HTTP delete request for delete
        alert("deleted");
        
    }
})
// controller for search