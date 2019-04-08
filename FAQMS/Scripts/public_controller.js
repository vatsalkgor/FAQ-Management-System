public.controller('Index', ["questions", "deptmod", "$scope", "$sce", function (questions, deptmod, $scope, $sce) {
    $scope.module = "Our Most Viewed Question";
    $scope.question_answers;
    $scope.whichModule = function (m, mod) {
        $(".page-loader-wrapper-custom").show();
        questions.moduleQuestion(m).then(function (response) {
            $scope.question_answers = response
            for (var i = 0; i < $scope.question_answers.length; i++) {
                $scope.question_answers[i].TrustedAns = $sce.trustAsHtml($scope.question_answers[i].Answer)
            }
        })
        //get the data from server here and display it in the body
        $scope.module = mod + " Module";
        $(".page-loader-wrapper-custom").hide();

    }
    questions.getTop().then(function (response) {
        $scope.question_answers = response;
        for (var i = 0; i < $scope.question_answers.length; i++) {
            $scope.question_answers[i].TrustedAns = $sce.trustAsHtml($scope.question_answers[i].Answer)
        }
        $(".page-loader-wrapper-custom").hide();
    })
    deptmod.getDeptMod().then(function (response) {
        $scope.deptmods = response
        $(".page-loader-wrapper-custom").hide();
    })

    $scope.findRelated = function (id) {

        setTimeout(function () {
            if ($("#q" + id).attr('aria-expanded') === 'true') {
                $(".page-loader-wrapper-custom").show();
                questions.findRelated(id).then(function (response) {
                    $scope.related = response
                    for (var i = 0; i < $scope.related.length; i++) {
                        $scope.related[i].TrustedAns = $sce.trustAsHtml($scope.related[i].Answer)
                    }
                })
                $(".page-loader-wrapper-custom").hide();
            } else {
                questions.updateTimespend(id).then((response) => console.log(response));
            }
        }, 10)


    }
    $scope.relClick = function (id) {
        if (inMainQuestion(id)) {
            setTimeout(function () {
                if ($("#q" + $scope.related[id].Id).attr('aria-expanded') !== "true") {
                    $("#q" + $scope.related[id].Id).click();
                }
                $("#q" + $scope.related[id].Id)[0].scrollIntoView({ behavior: "smooth" });
            },500)
        }
        else {
            $scope.question_answers.push($scope.related[id]);
            setTimeout(function () {
                $("#q" + $scope.related[id].Id).click();
                $("#q" + $scope.related[id].Id)[0].scrollIntoView({ behavior: "smooth" });
                $scope.findRelated($scope.related[id].Id);

            }, 500)
        }
    }

    function inMainQuestion(id) {
        for (var i = 0; i < $scope.question_answers.length; i++) {
            if ($scope.question_answers[i].Id == $scope.related[id].Id) {
                return true;
            }
        }
        return false;
    }

    $("#public_search").keyup(function (e) {
        if (e.which == 13 && $(this).val() != "") {
            $(".page-loader-wrapper-custom").show();
            questions.searchQuestion($(this).val()).then(function (response) {
                $scope.question_answers = response;
                for (var i = 0; i < $scope.question_answers.length; i++) {
                    $scope.question_answers[i].TrustedAns = $sce.trustAsHtml($scope.question_answers[i].Answer)
                }
            })
            $scope.module = "Search Result For " + $(this).val()
            $(".page-loader-wrapper-custom").hide();
        }
    })
}]);