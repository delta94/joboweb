"use strict";

app.controller('eDashCtrl', function ($scope, $state, $http, $sce, toastr, $q
    , CONFIG
    , AuthUser
    , $window
    , $log
    , $rootScope
    , $timeout
    , ModalService) {

    $rootScope.$watch('newNoti', function (newNoti) {
        $rootScope.og = {
            title: '(' + newNoti + ') Jobo' || 'Jobo'
        }
    });

    $(document).ready(function () {
        $('[data-toggle="popover"]').popover();
    });
    $rootScope.$watch('onlineList', function (newvlue) {
        if (newvlue) {
            $rootScope.aside = true
        }
    });
    $scope.init = function () {

        if ($rootScope.storeData) {
            $scope.initData($rootScope.storeData)

        } else {
            $scope.$on('handleBroadcast', function (event, storeData) {
                $scope.initData($rootScope.storeData)
            });
        }

    };
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.initData = function (storeData) {
        if (!storeData) {
            $state.go('store', {id: null})
            toastr.info('Hãy tạo cửa hàng đầu tiên của bạn')
        } else if (!$rootScope.storeData.location) {
            $state.go('store', {id: null})
            toastr.info('Hãy tạo cửa hàng đầu tiên của bạn')
        } else if (!$rootScope.storeData.job) {
            toastr.info('Hãy cập nhật địa chỉ cửa hàng?')
            $state.go('store', {id: 'job'})
        } else {
            $rootScope.newfilter = {
                job: $rootScope.service.getfirst($rootScope.storeData.job),
                userId: $rootScope.storeId,
                p: 1
            }
            $scope.getUserFiltered($rootScope.newfilter)
        }
    }

    $rootScope.newfilterFilter = function (type, key) {
        $rootScope.newfilter[type] = key
        $rootScope.newfilter.p = 1
        if ($rootScope.newfilter.experience == false) {
            delete $rootScope.newfilter.experience
        }
        if ($rootScope.newfilter.figure == false) {
            delete $rootScope.newfilter.figure
        }

        console.log($rootScope.newfilter)
        $rootScope.usercard = []
        $scope.getUserFiltered($rootScope.newfilter)
    }
    $scope.setAge = function () {
        $scope.age = true
    }
    $scope.age = false;
    $rootScope.newAgeFilter = function (type, key1, key2) {
        $rootScope.jobCard = []
        $rootScope.storeCard = []
        $rootScope.newfilter.p = 1
        $rootScope.newfilter.age1 = key1
        $rootScope.newfilter.age2 = key2
        console.log($rootScope.newfilter)
        $rootScope.usercard = []
        $scope.getUserFiltered($rootScope.newfilter)
        $scope.age = false
    }


    $scope.showVideo = function (user) {
        $scope.showVid = user.userId
        $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
    }

    $scope.loading = false;
    $scope.loadMore = function () {
        console.log('request load')
        if (!$scope.loading && $rootScope.newfilter && $rootScope.newfilter.p < $scope.response.total_pages)  {
            $scope.loading = true;

            console.log('loading')
            $rootScope.newfilter.p++
            $scope.getUserFiltered($rootScope.newfilter);
            $timeout(function () {
                $scope.loading = false;
            }, 500)
        }
    }
    $rootScope.maxMatchUser = 0


    $scope.getUserFiltered = function (newfilter) {
        console.log('filtering..', newfilter)
        $scope.loading = true
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/users',
            params: newfilter
        }).then(function successCallback(response) {
            console.log("respond", response);
            $scope.response = response.data;
            if ($rootScope.maxMatchUser == 0) {
                $rootScope.maxMatchUser = $scope.response.data[0].match
                console.log($rootScope.maxMatchUser)
            }

            $timeout(function () {
                if (!$rootScope.usercard) {
                    $rootScope.usercard = []
                }
                for (var i in $scope.response.data) {
                    var profileData = $scope.response.data[i]
                    $scope.response.data[i].matchPer = Math.round($scope.response.data[i].match * 100 / $rootScope.maxMatchUser)

                    if (profileData.act) {
                        var ref = 'activity/like/' + $rootScope.storeId + ':' + profileData.userId
                        firebase.database().ref(ref).on('value', function (snap) {
                            $scope.response.data[i].act = snap.val()
                        })
                    }

                }
                $rootScope.usercard = $rootScope.usercard.concat($scope.response.data);
                console.log($rootScope.usercard)
                $scope.loading = false
            })
        }, function (error) {
            console.log(error)
            $scope.loading = false

        })


    };


    $scope.applyThis = function (id, key) {
        if ($scope.selectedJob && $scope.selectedJob[id] && $scope.selectedJob[id][key]) {
            delete $scope.selectedJob[id][key]
        } else {

            if (!$scope.selectedJob) {
                $scope.selectedJob = {}
            }
            if (!$scope.selectedJob[id]) {
                $scope.selectedJob[id] = {}
            }
            $scope.selectedJob[id][key] = true;
        }
    };

    $scope.offer = function (id) {
        if (!$scope.jobOffer) {
            $scope.jobOffer = {}
        }
        $scope.jobOffer[id] = true
    }
    $scope.like = function (card, action, selectedJob) {
        AuthUser.storeLike(card, action, selectedJob).then(function (out) {
            console.log(out)
            delete $scope.jobOffer[card.userId]
        })
    };

    $scope.chatto = function (id) {
        $state.go("employer.chats", {to: id, slide: 1})
    };

})
;
