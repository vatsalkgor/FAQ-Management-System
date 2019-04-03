var public = angular.module('Home', []);
public.factory("questions", function ($http) {
    return {
        getTop: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get('/Home/GetTop').then(function (response) {
                return response.data;
            })
        },  
        moduleQuestion: function (m) {
            return $http.post("/Home/ModuleQuestion", { mod: m }).then(function (response) {
                return response.data
            })
        },
        findRelated: function (id) {
            //console.log(id)
            return $http.post("/Home/FindRelatedQuestion", { id: id }).then(function (response) {
                return response.data;
            })
        },
        searchQuestion: function (query) {
            return $http.post("/Home/SearchQuestion", { query: query }).then(function (response) {
                return response.data;
            })
        }
    }
});
public.factory("deptmod", function ($http) {
    return {
        getDeptMod: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get("/Home/GetDeptMod").then(function (response) {
                return response.data
            })
        }
    }
})