dashboard.controller('Dashboard', ['$scope', "questionService", "DeptFactory", "$window", "$compile", function ($scope, questionService,DeptFactory, $window, $compile) {
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

    //helper function for pagination
    function pagination(q) {
        $scope.filteredTodos = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 10
            , $scope.maxSize = 10;

        $scope.$watch("currentPage + numPerPage", function () {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                , end = begin + $scope.numPerPage;
            $scope.filteredTodos = q.slice(begin, end);
        });
    }

    $scope.questions = "All Questions"
    $scope.selected = [];
    DeptFactory.getDeptCount().then(function (response) {
        $scope.depts = response;
        $(".page-loader-wrapper").hide();
    })
    $scope.change = function (id, name) {
        $(".page-loader-wrapper").show();
        if ($window.location.href.split("/")[4] != "Dashboard") {
            $window.location.href = "/Admin/Dashboard"
        }
        $scope.questions = "Questions for Department " + name;
        questionService.getQuesForDept(id).then(function (response) {
            $scope.questions_answers = refineQues(response)
            //Pagination Logic 
            pagination($scope.questions_answers);
        })
        $(".page-loader-wrapper").hide();

    }

    //question promise to get all questions
    questionService.getQues().then(function (response) {
        $scope.questions_answers = refineQues(response)
        //Pagination Logic 
        pagination($scope.questions_answers);
        $(".page-loader-wrapper").hide();
    })

    $("#search").keyup(function (e) {
        if (e.which == 13 && $(this).val() != "") {
            $(".page-loader-wrapper").show();
            questionService.searchQuestions($(this).val()).then(function (response) {
                $scope.questions_answers = refineQues(response)
                pagination($scope.questions_answers);
            })
        $(".page-loader-wrapper").hide();
        }
    })

    //Toggle State of Question
    $scope.toggleStatus = function (id, key) {
        questionService.toggleStatus(id, !$scope.questions_answers[key].Status).then(function(response){
            if (response) {
                questionService.getQues().then(function (response) {
                    $scope.questions_answers = response
                })
                alert("Status Updated. ");
            }else {
                alert("Something Went Wrong. Contact Admin.")
            }
        })
    }

    //Delete Question Logic
    $scope.del_que = function (id) {
        if (confirm("Are you sure you want to Delete the question? This is an irreversible Action.")) {
            questionService.delQue(id).then(function (response) {
                if (response) {
                    alert("Question Deleted");
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
            "<div class=col-md-3><a href=/Admin/EditQuestion/" + $scope.questions_answers[id].Id + "><button class='btn btn-success waves-effect'>Edit</button></a></div>" +
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
                questionService.toggleSelectedStatus(data, true).then(function (response) {
                    if (response) {
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
                questionService.toggleSelectedStatus(data, false).then(function (response) {
                    if (response) {
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
            questionService.deleteSelected(data).then(function (response) {
                if (response) {
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
dashboard.controller("questions", function ($scope,questionService,$window, DeptFactory, ModuleFactory) {
    $scope.createQ = function (isValid) {
        if (isValid && $scope.form.answer != "" && $scope.form.answer != "<p><br></p>") {
            var data = {};
            data.question = $scope.form.question.$viewValue;
            data.dept = $scope.form.d.$viewValue;
            data.mod = $scope.form.mod.$viewValue;
            data.tags = $scope.form.selected_tags.$viewValue;
            data.notes = $scope.form.notes.$viewValue;
            data.answer = $("#answer").summernote('code');
            questionService.createQuestion(data).then(function (response) {
                if (response) {
                    alert("Successfully Added Question.")
                    $window.location.reload()
                } else {
                    alert("Something Went wrong. Please Contact Admin.")
                }
            })
        } else {
            alert("Please Fill all fields including Answer in the given Text Editor")
        }
    }
    DeptFactory.getDept().then(function (response) {
        $scope.dept = response
    })
    $scope.previewQ = function () {
        answer = $("#answer").summernote('code');
        $("#previewanswer").html(answer)
    }
    $scope.change_dept = function (id) {
        $(".page-loader-wrapper").hide();
        ModuleFactory.searchModById(id).then(function (response) {
            $scope.selected_mod = response
        })
        $(".page-loader-wrapper").hide();
    }
    

    ModuleFactory.getAllModules().then(function (response) {
        $scope.all_mod = response
    })
})

//controller for Tags Management
dashboard.controller("tagsmgmt", function ($scope, TagsFactory) {
    TagsFactory.getTags().then(function (response) {
        $scope.tags = response;
    })
    $scope.new_tag;
    $scope.add = function (tag) {
        TagsFactory.addTag(tag).then(function (response) {
            if (response == 0) {
                alert("Please Enter a Tag.")
            } else if (response == 1) {
                alert("Tag Already Exists.")
            } else {
                $("#addTag").modal("hide");
                alert("Successfully Added.");
                TagsFactory.getTags().then(function (response) {
                    $scope.tags = response
                })
            }
        })
    }
    $scope.save = function (id) {
        new_tag = $("#" + id).html()
        //HTTP POST request for updating the value
        TagsFactory.updateTag(id,new_tag).then(function (response) {
            if (response == 1) {
                TagsFactory.getTags().then(function (response) {
                    $scope.tags = response
                })
                alert("Successfully Updated.")
            }
            else if (response == -1) {
                alert("Something went wrong. Contact Admin.")
            } else {
                TagsFactory.getTags().then(function (response) {
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
            TagsFactory.deleteTag(id).then(function (response) {
                if (response == 1) {
                    alert("Tag deleted.")
                    TagsFactory.getTags().then(function (response) {
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
                $(".page-loader-wrapper").hide();
                TagsFactory.searchTag($(this).val()).then(function (response) {
                    $scope.tags = response;
                    console.log($scope.tags)
                })
                $(".page-loader-wrapper").hide();
            }
        }
    })
})

dashboard.controller("Department", function (DeptFactory, ModuleFactory, $scope) {
    DeptFactory.getDept().then(function (response) {
        $scope.dept = response
    })
    ModuleFactory.getMod().then(function (response) {
        $scope.mod = response
    })

    $scope.add_dept = function (dept) {
        DeptFactory.addDept(dept).then(function (response) {
            if (response == 0) {
                alert("Please Enter a Department.")
            } else if (response == 1) {
                alert("Department Already Exists.")
            } else {
                $("#addDept").modal("hide");
                alert("Successfully Added.");
                DeptFactory.getDept().then(function (response) {
                    $scope.dept = response
                })
            }

        })
    }
    $scope.dept_save = function (id) {
        new_dept = $("#d" + id).html()
        //HTTP POST request for updating the value
        DeptFactory.updateDept(id,new_dept).then(function (response) {
            if (response == 1) {
                DeptFactory.getDept().then(function (response) {
                    $scope.dept = response
                })
                alert("Successfully Updated.")
            }
            else if (response == -1) {
                alert("Something went wrong. Contact Admin.")
            } else {
                DeptFactory.getDept().then(function (response) {
                    $scope.dept = response
                })
                alert("New tag already exist. Please provide unique names for each tag.")
            }
        })
    }
    $scope.dept_delete = function (id) {
        if (confirm("Are you sure you want to delete the tag? This Action is irreversible.")) {
            //HTTP delete request for delete
            DeptFactory.deleteDept(id).then(function (response) {
                console.log(response.data);
                if (response == 1) {
                    alert("Department deleted.")
                    DeptFactory.getDept().then(function (response) {
                        $scope.dept = response
                    })
                } else {
                    alert("Something Went Wrong. Please contact Admin.")
                }
            })
        }
    }
    $("#dept_search").keyup(function (e) {
        if (e.which == 13) {
            if ($(this).val() != "") {
                $(".page-loader-wrapper").hide();
                DeptFactory.searchDept($(this).val()).then(function (response) {
                    $scope.dept = response.data;
                })
                $(".page-loader-wrapper").hide();
            }
        }
    })

    $scope.mod_save = function (id) {
        new_mod = $("#m" + id).html()
        //HTTP POST request for updating the value
        ModuleFactory.updateMod(id,new_mod).then(function (response) {
            if (response == 1) {
                ModuleFactory.getMod().then(function (response) {
                    $scope.dept = response
                })
                alert("Successfully Updated.")
            }
            else if (response == -1) {
                alert("Something went wrong. Contact Admin.")
            } else {
                ModuleFactory.getMod().then(function (response) {
                    $scope.dept = response
                })
                alert("New tag already exist. Please provide unique names for each tag.")
            }
        })
    }
    $scope.mod_delete = function (id) {
        if (confirm("Are you sure you want to delete the Module? This Action is irreversible.")) {
            //HTTP delete request for delete
            ModuleFactory.deleteMod(id).then(function (response) {
                if (response == 1) {
                    alert("Module deleted.")
                    ModuleFactory.getMod().then(function (response) {
                        $scope.mod = response
                    })
                } else {
                    alert("Something Went Wrong. Please contact Admin.")
                }
            })
        }
    }
    $scope.add_mod = function (mod, d) {
        ModuleFactory.addMod(mod,d).then(function (response) {
            if (response == 0) {
                alert("Please Enter a Module.")
            } else if (response == 1) {
                alert("Module Already Exists.")
            } else {
                $("#addMod").modal("hide");
                alert("Successfully Added.");
                ModuleFactory.getMod().then(function (response) {
                    console.log(response)
                    $scope.mod = response
                })
            }
        })
    }
    $("#mod_search").keyup(function (e) {
        if (e.which == 13) {
            if ($(this).val() != "") {
                ModuleFactory.seachMod($(this).val()).then(function (response) {
                    $scope.mod = response.data;
                })
            }
        }
    })
})