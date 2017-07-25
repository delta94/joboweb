"use strict";

app.controller("ViewStoreCtrl", function ($scope, $stateParams, $sce, $rootScope, $http, CONFIG, $timeout, $state) {
    $rootScope.aside = false

    $scope.profileId = $stateParams.id;
    loadStore($scope.profileId)
    $scope.currentJob = $stateParams.job;

    $scope.admin = $stateParams.admin;

    console.log('admin', $scope.admin)

    $rootScope.service.Ana('viewStore', {storeId: $scope.profileId})
    $http({
                method: 'GET',
                url: CONFIG.APIURL + '/view/store',
                params: {storeId : $scope.profileId , userId: $rootScope.userId}
        }).then(function successCallback(response) {
                console.log("respond", response);
                $scope.profileData = response.data
                $scope.adminData = $scope.profileData.adminData
                })

    if ($rootScope.userId) {
        init($scope.profileId, $rootScope.userId)
    } else {
        $rootScope.$on('handleBroadcast', function (event, userData) {
            init($scope.profileId, userData.userId)
        });
        $rootScope.$on('storeListen', function (event, userData) {
            init($scope.profileId, userData.userId)
        });
    }
    function loadStore(profileId) {

        var ProfileRef = firebase.database().ref('store/' + profileId);
        ProfileRef.once('value', function (snap) {
            $timeout(function () {
                $scope.profileData = snap.val();
                $scope.profileData.background = '/img/ava-background/background_' + $scope.profileData.industry + '.png';
                console.log($scope.profileData)
                $rootScope.service.loadJob($scope.profileData).then(function (data) {
                    $scope.profileData.job = data
                    if ($scope.currentJob) {
                        $timeout(function () {
                            $scope.currentJobData = $scope.profileData.job[$scope.currentJob]
                        })
                    }
                })
                loadListStore($scope.profileData.createdBy)

                if ($rootScope.userData && $rootScope.userData.admin) {
                    firebase.database().ref('user/' + $scope.profileData.createdBy).once('value', function (snap) {
                        $timeout(function () {
                            $scope.adminData = snap.val()
                        })
                    })

                }
                var staticRef = firebase.database().ref('static/' + profileId);
                staticRef.on('value', function (snap) {
                    $timeout(function () {
                        $scope.staticData = snap.val();
                    })
                })
                // var reviewAct = firebase.database().ref('activity/review/' + profileId);
                // reviewAct.on('value', function (snap) {
                //     $timeout(function () {
                //         $scope.reviewData = snap.val();
                //         if ($scope.reviewData) {
                //             $timeout(function () {
                //                 $scope.ratingModel = $rootScope.service.calReview($scope.reviewData);
                //                 console.log($scope.ratingModel)
                //             })
                //         }
                //     })
                // })
                $rootScope.service.getListReact($scope.profileData.storeId, 'storeId').then(function (data) {
                    $timeout(function () {
                        $scope.listReact = data;
                        console.log('listReact', $scope.listReact)
                    })
                    $scope.limit = {like: 10, liked: 10, match: 10}

                    $scope.incrementLimit = function (type) {
                        $scope.limit[type] = $scope.listReact[type].length
                    }
                })


                // for share
                var profileJobtake = "";
                for (var i in $scope.profileData.job) {
                    if (i != 'other') {
                        profileJobtake += CONFIG.data.job[i] + ", "

                    }
                }
                var profileJob = profileJobtake.slice(0, profileJobtake.length - 2)
                console.log(profileJob);
                $scope.share = {
                    Url: "web.joboapp.com/view/profile/" + profileId,
                    Text: $scope.profileData.storeName + ' tuyển dụng',
                    Title: $scope.profileData.industry + ' ' + $scope.profileData.name,
                    Description: 'Xem tin tuyển dụng với vị trí' + profileJob + 'của' + $scope.profileData.storeName,
                    Type: 'feed',
                    Media: $scope.profileData.avatar,
                    Via: '295208480879128',
                    Hashtags: 'jobo,timviecnhanh,pg,sale,model',
                    Caption: 'Có ai muốn làm ' + profileJob + ' không nhỉ? Mình vừa mới tìm thấy tin tuyển dụng này, thử vào Jobo xem thông tin chi tiết rồi cho mình biết bạn nghĩ sao nhé ;) #jobo #timviecnhanh #pg #sale #model'
                }
                $rootScope.og = {
                    title: $scope.profileData.storeName + ' tuyển dụng',
                    description: 'Xem tin tuyển dụng với vị trí' + profileJob + 'của' + $scope.profileData.storeName,
                    image: $scope.profileData.avatar
                }

            })
        })


    }

    function loadListStore(userId) {
        var storeListRef = firebase.database().ref('store').orderByChild('createdBy').equalTo(userId);
        storeListRef.on('value', function (snap) {
            $timeout(function () {
                $scope.storeList = snap.val()
                $scope.numberStore = Object.keys($scope.storeList).length
            })
        })
    }


    function init(profileId, userId) {
        if (profileId == $rootScope.storeId) {
            $timeout(function () {
                $scope.myself = true
            })
        }
        var likeAct = firebase.database().ref('activity/like/' + profileId + ':' + userId);
        likeAct.on('value', function (snap) {
            $timeout(function () {
                $scope.profileData = Object.assign($scope.profileData, {act: snap.val()});
                console.log('$scope.profileData.act', $scope.profileData.act)
            })
        })
    }

    $scope.indexCurrent = 0;
    if ($rootScope.usercard) {
        for (var i in $rootScope.usercard) {
            if ($rootScope.usercard[i].userId == $scope.profileId) {
                $scope.indexCurrent = i;
                console.log($scope.indexCurrent)
                break
            }
        }
    }

    $scope.rating = 3;
    $scope.rateFunction = function (rating) {
        $scope.reviews = {
            name: $rootScope.userData.name,
            avatar: $rootScope.userData.avatar || "",
            userId: $rootScope.userId,
            rate: rating,
            type: $rootScope.type,
            createdAt: new Date().getTime()
        }
        console.log('Rating selected: ' + rating);
    };
    $scope.review = function (reviews, profileId) {
        var reviewAct = firebase.database().ref('activity/review/' + profileId + '/' + reviews.userId)
        reviewAct.update(reviews)
    }


    $scope.$back = function () {
        window.history.back();
    };
    $scope.showVideo = function (user) {
        $scope.showVid = true
        $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
    }
    $scope.hideVideo = function () {
        delete $scope.showVid

    }
    $scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.nextProfile = function () {
        var next = +$scope.indexCurrent + +1
        console.log(next)
        var nextUserId = $rootScope.storeCard[next].userId
        $state.go('employer.viewprofile', {id: nextUserId})
    }
    $scope.backProfile = function () {
        var back = +$scope.indexCurrent - +1
        console.log(back)
        var backUserId = $rootScope.storeCard[back].userId
        $state.go('employer.viewprofile', {id: backUserId})
    }


    $scope.applyThis = function (id, key) {
        if ($scope.selectedJob && $scope.selectedJob[id] && $scope.selectedJob[id][key]) {
            delete $scope.selectedJob[id][key]
            console.log($scope.selectedJob)
        } else {

            if (!$scope.selectedJob) {
                $scope.selectedJob = {}
            }
            if (!$scope.selectedJob[id]) {
                $scope.selectedJob[id] = {}
            }
            $scope.selectedJob[id][key] = true;
            console.log($scope.selectedJob)

        }
    };


    $scope.shortAddress = function (fullAddress) {
        if (fullAddress) {
            var mixAddress = fullAddress.split(",");
            var address = mixAddress[0] + ', ' + mixAddress[1] + ', ' + mixAddress[2];
            return address
        }

    }

    $scope.like = function (card, action, selectedJob) {
        $rootScope.service.userLike(card, action, selectedJob).then(function (result) {
            console.log(result)
        })
    };

    $scope.chatto = function (id) {
        $state.go("employer.chats", {to: id, slide: 1})
    };

});
