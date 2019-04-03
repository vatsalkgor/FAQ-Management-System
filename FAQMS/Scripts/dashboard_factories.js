var dashboard = angular.module('dashboard', ['ui.bootstrap', 'ui.bootstrap.pagination']);
dashboard.factory("questionService", function ($http) {
    return {
        getQues: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get('/Admin/GetQuestions').then(function (response) {
                return response.data;
            })
        },
        getQuesForDept: function (id) {
            return $http.post("/Admin/GetQuestionsForDepartment", { id: id }).then(function (response) {
                return response.data
            })
        },
        searchQuestions: function (query) {
            return $http.post("SearchQuestion", { query: query }).then(function (response) {
                return response.data
            })
        },
        toggleStatus: function (id, status) {
            return $http.post("UpdateQueStatus", { id: id, new_status: status }).then(function (response) {
                return response.data;
            })
        },
        delQue: function (id) {
            return $http.post("DelQue", { id: id }).then(function (response) {
                return response.data;
            })
        },
        toggleSelectedStatus: function (data, new_stat) {
            return $http.post("MakeAllActive", { data: data, new_stat: new_stat }).then(function (response) {
                return response.data
            })
        },
        deleteSelected: function (data) {
            return $http.post("DeleteSelected", { data: data })
        },
        createQuestion: function (data) {
            return $http.post("PutQuestion", data).then(function (response) {
                return response.data
            })
        }
    }
})

dashboard.factory("DeptFactory", function ($http) {
    return {
        getDept: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get("/Admin/GetDepts").then(function (response) {
                return response.data
            })
        },
        getDeptCount: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get("/Admin/GetDeptsCount").then(function (response) {
                return response.data
            })
        },
        addDept: function (data) {
            return $http.post("AddDept", { data: data }).then(function (response) {
                return response.data
            })
        },
        updateDept: function (id,new_dept) {
            return $http.post("UpdateDept / " + id + " /" + new_dept).then(function (response) {
                return response.data
            })
        },
        deleteDept: function (id) {
            return $http.post("DeleteDept", { id: id }).then(function (response) {
                return response.data
            })
        },
        searchDept: function (query) {
            return $http.post("SearchDept", { query: query }).then(function (response) {
                return response.data
            })
        }
    }
})

dashboard.factory("ModuleFactory", function ($http) {
    return {
        getMod: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get("/Admin/GetMods").then(function (response) {
                return response.data
            })
        },
        searchModById: function (id) {
            return $http.post("SearchModById", { id: id }).then(function (response) {
                return response.data
            })
        },
        addMod: function (mod,d) {
            return $http.post("AddMod", { m: mod, d: d }).then(function (response) {
                return response.data
            })
        },
        updateMod: function () {
            return $http.post("UpdateMod/" + id + "/" + new_tag).then(function (response) {
                return response.data
            })
        },
        deleteMod: function (id) {
            return $http.post("DeleteMod", { id: id }).then(function (response) {
                return response.data
            })
        },
        searchMod: function (query) {
            return $http.post("SearchMod", { query: query }).then(function (response) {
                return response.data
            })
        },
        getAllModules: function () {
            $(".page-loader-wrapper-custom").show();
            return $http.get("/Admin/GetAllModule").then(function (response) {
                return response.data
            })
        }
    }
})

dashboard.factory("TagsFactory", function ($http) {
    return {
        getTags: function () {
            return $http.get("/Admin/GetTags").then(function (response) {
                return response.data
            })
        },
        addTag: function (tag) {
            return $http.post("AddTag", { tag: tag }).then(function (response) {
                return response.data
            })
        },
        updateTag: function (id,new_tag) {
            return $http.post("UpdateTag/" + id + "/" + new_tag).then(function (response) {
                return response.data
            })
        },
        deleteTag: function (id) {
            return $http.post("DeleteTag", { id: id }).then(function (response) {
                return response.data
            })
        },
        searchTag: function (query) {
            return $http.post("SearchTag", { query: query}).then(function (response) {
                return response.data
            })
        }
    }
})