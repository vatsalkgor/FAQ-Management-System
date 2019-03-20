var dashboard = angular.module('layout', ['ui.bootstrap', 'ui.bootstrap.pagination']);
dashboard.controller('Layout', function ($scope) {
    //http request to get the count of all depts
    $scope.count = { delivery: 20, ops: 52, audit: 65, er: 124, finance: 15 };
});
dashboard.factory("questionService", function ($http) {
    return {
        getQues: function () {
            return $http.get('/Admin/GetQuestions').then(function (response) {
                return response.data;
            })
        }
    }
})
dashboard.controller('Dashboard', ['$scope', "questionService", "$http", "$window", "$compile", function ($scope, questionService, $http, $window, $compile) {
    $scope.dept = "Delivery";
    $scope.selected = [];



    $scope.change = function (d) {
        $scope.dept = d;
    }
    //helper function to shorten the answer to 150 characters
    function refineQues(r) {
        //Substring Logic
        var img_regex = /<img[^>]*>/g;
        var other_regex = /<[^>]*>/g;
        for (var i = 0; i < r.length; i++) {
            if (r[i].Answer.length > 100) {
                short_ans = r[i].Answer.replace(img_regex, "Image ")
                short_ans = short_ans.replace(other_regex, "")
                short_ans = short_ans.substr(0, 101) + "...";
            } else {
                short_ans = r[i].Answer.replace(img_regex, "Image ")
                short_ans = short_ans.replace(other_regex, "")
            }
            r[i].sa = short_ans;
        }
        return r;
    }

    //question promise to get all questions
    var getQuesPromise = questionService.getQues();
    getQuesPromise.then(function (response) {

        $scope.questions_answers = refineQues(response)
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

    //Toggle State of Question
    $scope.toggleStatus = function (id, key) {
        $http.post("UpdateQueStatus", { id: id, new_status: !$scope.questions_answers[key].Status }).then(function (response) {
            if (response.data) {
                questionService.getQues().then(function (response) {
                    $scope.questions_answers = response
                })
                alert("Status Updated. ");
                $window.location.reload()
            }
            else {
                alert("Something Went Wrong. Contact Admin.")
            }
        })
    }

    //Delete Question Logic
    $scope.del_que = function (id) {
        if (confirm("Are you sure you want to Delete the question? This is an irreversible Action.")) {
            $http.post("DelQue", { id: id }).then(function (response) {
                if (response.data) {
                    alert("Question Deleted.")
                    $window.location.reload();
                } else {
                    alert("Something went wrong.")
                }
            })
        }
    }

    //question click logic
    $scope.showQuestion = function (id) {
        var status = $scope.questions_answers[id].Status ? "Inactive" : "Active";
        //angular.element("#desc_question").html(
        var el = "<div class=card>" +
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
            "<div class=col-md-3><button ng-click='del_que(" + $scope.questions_answers[id].Id + ")' class='btn btn-danger'>Delete</button></div>" +
            "<div class=col-md-3><button ng-click='toggleStatus(" + $scope.questions_answers[id].Id + "," + id + ")' class='btn btn-danger'>" + status + "</button></div>" +
            "<div class=col-md-3><button class='btn btn-danger' onclick='qclose(" + id + ")'>Close</button></div>"
            + "</div>"
            + "</div>"
            + "</div> "
        var temp = $compile(el)($scope)
        $("#desc_question").html(temp)
        $("#desc_question")[0].scrollIntoView({ behavior: "smooth" });
    }

    //mark active logic function
    $scope.active = function () {
        if ($scope.selected.length != 0) {
            var data = []
            isStatusInactive = true;
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.selected[i]) {
                    if ($scope.questions_answers[i].Status) {
                        isStatusInactive = false;
                        break;
                    } else {
                        data.push($scope.questions_answers[i].Id)
                    }
                }
            }
            if (isStatusInactive) {

                $http.post("MakeAllActive", { data: data, new_stat: true }).then(function (response) {
                    if (response.data) {
                        alert("Status changed for selected Questions.")
                        $window.location.reload();
                    } else {
                        alert("Something went wrong. Contact Admin.")
                    }
                })
            } else {
                alert("Select only those question which have inactive status.")
            }
        } else {
            alert("Please select at least 1 question.")
        }
    }

    //mark inactive logic function
    $scope.inactive = function () {
        if ($scope.selected.length != 0) {
            var data = []
            isStatusActive = true;
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.selected[i]) {
                    if (!$scope.questions_answers[i].Status) {
                        isStatusActive = false;
                        break;
                    } else {
                        data.push($scope.questions_answers[i].Id)
                    }
                }
            }
            if (isStatusActive) {
                $http.post("MakeAllActive", { data: data, new_stat: false }).then(function (response) {
                    if (response.data) {
                        alert("Status changed for selected Questions.")
                        $window.location.reload();
                    } else {
                        alert("Something went wrong. Contact Admin.")
                    }
                })
            } else {
                alert("Select only those question which have    active status.")
            }
        } else {
            alert("Please select at least 1 question.")
        }
    }

    $scope.deleteAll = function () {
        if ($scope.selected.length != 0) {
            var data = []
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.selected[i]) {
                    data.push($scope.questions_answers[i].Id)
                }
            }
            $http.post("DeleteSelected", { data: data }).then(function (response) {
                if (response.data) {
                    alert("Questions deleted Successfully.")
                    $window.location.reload();
                } else {
                    alert("Something went wrong. Contact Admin.")
                }
            })
        } else {
            alert("Please select at least 1 question.")
        }
    }
}])

//controller for Create Question/Edit Question
dashboard.controller("questions", function ($scope, $http) {
    $scope.createQ = function (isValid) {
        if (isValid && $scope.form.answer != "" && $scope.form.answer != "<p><br></p>") {
            var data = {};
            data.question = $scope.form.question.$viewValue;
            data.dept = $scope.form.d.$viewValue;
            data.mod = $scope.form.mod.$viewValue;
            data.tags = $scope.form.selected_tags.$viewValue;
            data.notes = $scope.form.notes.$viewValue;
            data.answer = $("#answer").summernote('code');
            $http.post("PutQuestion", data).then(function (response) {
                if (response.data) {
                    alert("Successfully Added Question.")
                } else {
                    alert("Something Went wrong. Please Contact Admin.")
                }
            })
        } else {
            alert("Please Fill all fields including Answer in the given Text Editor")
        }
    }

    $scope.previewQ = function () {
        answer = $("#answer").summernote('code');
        $("#previewanswer").html(answer)
    }
})


// Tags Managment Factory for reteriving Tags.
dashboard.factory("getTags", function ($http) {
    return {
        getTags: function () {
            return $http.get("/Admin/GetTags").then(function (response) {
                return response.data
            })
        }
    }
})

//controller for Tags Management
dashboard.controller("tagsmgmt", function ($scope, getTags, $http) {
    tagsPromise = getTags.getTags();
    tagsPromise.then(function (response) {
        $scope.tags = response;
    })

    $scope.new_tag;
    $scope.add = function (tag) {
        $http.post("AddTag", { tag: tag }).then(function (response) {
            if (response.data == 0) {
                alert("Please Enter a Tag.")
            } else if (response.data == 1) {
                alert("Tag Already Exists.")
            } else {
                $("#addTag").modal("hide");
                alert("Successfully Added.");
                getTags.getTags().then(function (response) {
                    $scope.tags = response
                })
            }
        })
    }

    $scope.save = function (id) {
        new_tag = $("#" + id).html()
        //HTTP POST request for updating the value
        $http.post("UpdateTag/" + id + "/" + new_tag).then(function (response) {
            if (response.data == 1) {
                getTags.getTags().then(function (response) {
                    $scope.tags = response
                })
                alert("Successfully Updated.")
            }
            else if (response.data == -1) {
                alert("Something went wrong. Contact Admin.")
            } else {
                getTags.getTags().then(function (response) {
                    $scope.tags = response
                })
                alert("New tag already exist. Please provide unique names for each tag.")
            }
        })
    }
    $scope.delete = function (id) {
        //ask for confirmation
        if (confirm("Are you sure you want to delete the tag? This Action is irreversible.")) {
            //HTTP delete request for delete
            $http.post("DeleteTag", { id: id }).then(function (response) {
                console.log(response.data);
                if (response.data == 1) {
                    alert("Tag deleted.")
                    getTags.getTags().then(function (response) {
                        $scope.tags = response
                    })
                } else {
                    alert("Something Went Wrong. Please contact Admin.")
                }
            })
        }

    }

    //search on hitting enter
    $("#tag_search").keyup(function (e) {
        if (e.which == 13) {
            if ($(this).val() != "") {
                $http.post("SearchTag", { query: $(this).val() }).then(function (response) {
                    $scope.tags = response.data;
                })
            }
        }
    })

})
