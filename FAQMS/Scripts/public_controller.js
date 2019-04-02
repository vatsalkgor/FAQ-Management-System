public.controller('Index', ["questions", "deptmod", "$scope", "$sce", function (questions, deptmod, $scope, $sce) {
    $scope.module = "Our Most Viewed Question";
    $scope.loading = true;
    $scope.question_answers;
    $scope.whichModule = function (m, mod) {
        questions.moduleQuestion(m).then(function (response) {
            $scope.question_answers = response
            for (var i = 0; i < $scope.question_answers.length; i++) {
                $scope.question_answers[i].TrustedAns = $sce.trustAsHtml($scope.question_answers[i].Answer)
            }
        })
        //get the data from server here and display it in the body
        $scope.module = mod + " Module";
        console.log($scope.module)
    }
    questions.getTop($scope).then(function (response) {
        $scope.question_answers = response;
        for (var i = 0; i < $scope.question_answers.length; i++) {
            $scope.question_answers[i].TrustedAns = $sce.trustAsHtml($scope.question_answers[i].Answer)
        }
        $scope.loading = false;
        console.log($scope.loading);
    })
    deptmod.getDeptMod().then(function (response) {
        $scope.deptmods = response
    })

    $scope.findRelated = function (id) {
        $scope.loading = true;
        
        questions.findRelated(id).then(function (response) {
            $scope.related = response
            for (var i = 0; i < $scope.related.length; i++) {
                $scope.related[i].TrustedAns = $sce.trustAsHtml($scope.related[i].Answer)
            }
        })
        $scope.loading = false;
    }
    $scope.relClick = function (id) {
        console.log(id)
        if (!inMainQuestion(id)) {
            $scope.question_answers.push($scope.related[id]);
            $scope.findRelated($scope.related[id].Id);
            $("button[data-target=" + $scope.related[id].Id+"]").click();
            console.log("#" + $scope.related[id].Id);
            setTimeout(function () { $("#" + $scope.related[id].Id)[0].scrollIntoView({ behavior: "smooth" }) }, 500);
        }
        else {
            $scope.findRelated($scope.related[id].Id)
            $("button[data-target=" + $scope.related[id].Id+"]").click();
            console.log("#" + $scope.related[id].Id);
            setTimeout(function () { $("#" + $scope.related[id].Id)[0].scrollIntoView({ behavior: "smooth" }) }, 500);
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
            questions.searchQuestion($(this).val()).then(function (response) {
                $scope.question_answers = response;
                for (var i = 0; i < $scope.question_answers.length; i++) {
                    $scope.question_answers[i].TrustedAns = $sce.trustAsHtml($scope.question_answers[i].Answer)
                }
            })
            $scope.module = "Search Result For " + $(this).val()
        }
    })
}]);