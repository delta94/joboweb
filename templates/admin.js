"use strict";


app.controller('dashAdminCtrl', function (AuthUser, $state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
    AuthUser.user().then(function (data) {
        console.log(data);
        if (data.admin == true) {

        } else {
            toastr.error('You are not supposed to be here!')
            $state.go('app.dash')
        }
    })
})
    .controller('jobseekerAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
        //address
        $scope.newfilter = {}
        $scope.font = "'HelveticaNeue-Light','Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;"
        $scope.autocompleteAddress = {text: ''};
        $scope.ketquasAddress = [];
        $scope.searchAddress = function () {
            $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
            $http({
                method: 'GET',
                url: $scope.URL
            }).then(function successCallback(response) {
                $scope.ketquasAddress = response.data.results;
                console.log($scope.ketquasAddress);
                $('#list-add').show();

            })
        };

        $scope.setSelectedAddress = function (selected) {
            $scope.autocompleteAddress.text = selected.formatted_address;
            $scope.address = selected;
            $scope.newfilter.location = selected.geometry.location;
            console.log(selected);
            $('#list-add').hide();
        };

        $scope.eraseAddress = function () {
            $scope.autocompleteAddress.text = null;
            $('#list-add').hide();
        }


        $scope.createHospital = function (newfilter, p) {
            console.log(newfilter)
            var q = JSON.stringify(newfilter)
            var params = {q: q, p: p}
            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/filterUser',
                params: params
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    $scope.response = response.data
                    console.log($scope.response)
                    $scope.jobSeeker = response.data.data;
                })
            }, function (error) {
                console.log(error)
            })
        }

        $scope.page = 1
        $scope.pagin = function (page) {
            console.log(page)
            $scope.createHospital($scope.newfilter, page)
        }
        $scope.profileData = {}
        $scope.viewfull = function (userid) {
            $rootScope.service.JoboApi('on/user', {userId: userid}).then(function (data) {
                $scope.profileData[userid] = data.data
            });

        }

        $scope.mail = {};
        $scope.data = {};

        $scope.upload = function (imageData) {
            console.log('imageData', imageData)
            var metadata = {
                'contentType': imageData.type
            };
            var storageRef = firebase.storage().ref();
            var uploadTask = storageRef.child('image/' + $rootScope.userId).put(imageData, metadata);
            uploadTask.then(function (snapVideo) {
                var download = snapVideo.downloadURL;
                console.log(download);
                $timeout(function () {
                    $scope.mail.image = download;
                })

            })
        };


        $scope.deleteProfile = function (userId) {
            db.ref('profile/' + userId).set(null).then(function (data) {
                toastr.success('done', data)
            }, function (error) {
                toastr.error('error', error)

            })
        }
        $scope.updateProfile = function (index) {
            var card = $scope.jobSeeker[index]
            console.log(card)
            $rootScope.service.JoboApi('update/user', {
                userId: card.userId,
                profile: card
            }).then(function (data) {
                toastr.success('done', card.feature + card.hide)
            }, function (error) {
                toastr.error('error', error)
            });

        }

    })
    .controller('employerAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
        //address
        $scope.newfilter = {}


        $scope.autocompleteAddress = {text: ''};
        $scope.ketquasAddress = [];
        $scope.searchAddress = function () {
            $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
            $http({
                method: 'GET',
                url: $scope.URL
            }).then(function successCallback(response) {
                $scope.ketquasAddress = response.data.results;
                console.log($scope.ketquasAddress);
                $('#list-add').show();

            })
        };

        $scope.setSelectedAddress = function (selected) {

            $scope.autocompleteAddress.text = selected.formatted_address;
            $scope.address = selected;


            $scope.newfilter.location = selected.geometry.location;

            console.time('Task 1')
            console.log(selected);
            $('#list-add').hide();
            console.timeEnd('Task 1')
            //$rootScope.userData.address = selected.formatted_address;
            //$rootScope.userData.location = selected.geometry.location;

        };

        $scope.eraseAddress = function () {
            $scope.autocompleteAddress.text = null;
            $('#list-add').hide();
        }


        $scope.createHospital = function (newfilter, p) {
            console.log(newfilter)
            var q = JSON.stringify(newfilter)
            var params = {q: q, p: p}
            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/filterEmployer',
                params: params
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    $scope.response = response.data
                    console.log($scope.response)
                    $scope.employer = response.data.data;
                })
            }, function (error) {
                console.log(error)
            })
        }
        $scope.page = 1
        $scope.pagin = function (page) {
            console.log(page)
            $scope.createHospital($scope.newfilter, page)
        }
        $scope.profileData = {}
        $scope.viewfull = function (userid) {
            $rootScope.service.JoboApi('on/user', {userId: userid}).then(function (data) {
                $scope.profileData[userid] = data.data;
            });

        }
        $scope.deleteProfile = function (storeId) {
            db.ref('store/' + storeId).set(null).then(function (data) {
                toastr.success('done', data)
            }, function (error) {
                toastr.error('error', error)

            })
        }
        $scope.updateProfile = function (index) {
            var card = $scope.employer[index]
            console.log(card)
            $rootScope.service.JoboApi('update/user', {
                userId: $rootScope.userId,
                storeId: card.storeId,
                store: card
            }).then(function (data) {
                toastr.success('done', card.feature + card.hide)
            }, function (error) {
                toastr.error('error', error)
            });
            /*db.ref('store/' + card.storeId).update(card).then(function (data) {
                toastr.success('done', card.feature + card.hide)
            }, function (error) {
                toastr.error('error', error)

            })*/
        }
    })
    .controller('analyticsUserCtrl', function ($scope, $timeout, $rootScope) {
        $scope.labels = []
        $scope.series = ['Total', 'Employer']
        $scope.TotalArray = []
        $scope.JobseekerArray = []
        $scope.EmployerArray = []

        function toDate(date) {
            var day = new Date(date);
            var dd = day.getDate();
            var mm = day.getMonth() + 1;
            var yyyy = day.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var day = dd + '/' + mm + '/' + yyyy;
            return day;
        }

        $scope.data = []
        $rootScope.service.JoboApi('admin/analyticsUser', {}).then(function (dataAnalytics) {
            $scope.dataAnalyticsUser = dataAnalytics.data
            //Today
            var Array = []
            for (var i in $scope.dataAnalyticsUser) {
                Array.push($scope.dataAnalyticsUser[i])
            }
            for (var i = 0; i < Array.length; i++) {
                Array[i].dateEnd = toDate(Array[i].dateStart);
            }

            //sum7days
            var sum7total = 0;
            var sum7noEmail = 0;
            var sum7noPhone = 0;
            var sum7noProfile = 0;
            var sum7employeremployer = 0;
            var sum7employerstore = 0;
            var sum7employerpremium = 0;
            var sum7jobseekerhn = 0;
            var sum7jobseekersg = 0;
            var sum7jobseekerother = 0;
            var sum7jobseekerhnve = 0;
            var sum7jobseekersgve = 0;
            var sum7jobseekerotherve = 0;
            var sum7providerfb = 0;
            var sum7providernm = 0;
            for (var j = 1; j < 8; j++) {
                sum7total += Array[j].total;
                sum7noEmail += Array[j].noEmail;
                sum7noPhone += Array[j].noPhone;
                sum7noProfile += Array[j].noProfile;
                sum7employeremployer += Array[j].employer.employer;
                sum7employerstore += Array[j].employer.store;
                sum7employerpremium += Array[j].employer.premium;
                sum7jobseekerhn += Array[j].jobseeker.hn;
                sum7jobseekersg += Array[j].jobseeker.sg;
                sum7jobseekerother += Array[j].jobseeker.other;
                sum7jobseekerhnve += Array[j].jobseeker.hn_ve;
                sum7jobseekersgve += Array[j].jobseeker.sg_ve;
                sum7jobseekerotherve += Array[j].jobseeker.other_ve;
                sum7providerfb += Array[j].provider.facebook;
                sum7providernm += Array[j].provider.normal;
            }

            //push 30 days to chart
            var today = new Date().getTime()
            var last30days = today - 86400 * 1000 * 30
            for (var i in $scope.dataAnalyticsUser) {
                if (last30days < $scope.dataAnalyticsUser[i].dateStart) {
                    $scope.labels.push(toDate($scope.dataAnalyticsUser[i].dateStart))
                    $scope.TotalArray.push($scope.dataAnalyticsUser[i].total)
                    $scope.JobseekerArray.push($scope.dataAnalyticsUser[i].jobseeker)
                    $scope.EmployerArray.push($scope.dataAnalyticsUser[i].employer)
                }
            }
            return new Promise(function (res, rej) {
                res($scope.labels)
            }).then(function () {
                $timeout(function () {
                    $scope.today1 = Array[1];//hôm nay
                    $scope.today2 = Array[7];//7 ngày trước
                    //7 days
                    $scope.day7total = sum7total;
                    $scope.day7noEmail = sum7noEmail;
                    $scope.day7noPhone = sum7noPhone;
                    $scope.day7noProfile = sum7noProfile;
                    $scope.day7employeremployer = sum7employeremployer;
                    $scope.day7employerstore = sum7employerstore;
                    $scope.day7employerpremium = sum7employerpremium;
                    $scope.day7jobseekerhn = sum7jobseekerhn;
                    $scope.day7jobseekersg = sum7jobseekersg;
                    $scope.day7jobseekerother = sum7jobseekerother;
                    $scope.day7jobseekerhnve = sum7jobseekerhnve;
                    $scope.day7jobseekersgve = sum7jobseekersgve;
                    $scope.day7jobseekerotherve = sum7jobseekerotherve;
                    $scope.day7providerfb = sum7providerfb;
                    $scope.day7providernm = sum7providernm;
                    // end 7days
                    $scope.data = [$scope.TotalArray, $scope.EmployerArray]
                });
            })
        })

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{yAxisID: 'y-axis-1'}];
        $scope.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }]
            }
        };
    })
    .controller("analyticsCtrl", function ($scope, $rootScope, $timeout) {
        $rootScope.service.JoboApi('admin/analytics', {}).then(function (dataAnalytics) {
            $scope.dataAnalytics = dataAnalytics.data
        })
    })
    .controller('adminLogCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http) {
        // $scope.page = 1
        // $scope.getLog = function (page) {
        //     $scope.page = page || 1
        //
        //     $rootScope.service.JoboApi('log/activity', {page: $scope.page}).then(function (response) {
        //         $scope.response = response.data
        //         if($scope.response){
        //             $scope.log = $scope.response.data
        //         }
        //     })
        // }
        // $scope.pagin = function (page) {
        //     $scope.getLog(page)
        // }
        // $scope.getLog()

    })
    .controller('userActivityAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http) {
        $scope.page = 1
        $scope.getLog = function (page) {
            $scope.page = page || 1

            $rootScope.service.JoboApi('log/activity', {page: $scope.page}).then(function (response) {
                $scope.response = response.data
                $scope.log = response.data.data
            })
        }
        $scope.pagin = function (page) {
            $scope.getLog(page)
        }
        $scope.getLog()

    })
    .controller('jobAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http) {
        $scope.page = 1
        $scope.getLog = function (page) {
            $scope.page = page || 1

            $rootScope.service.JoboApi('log/job', {page: $scope.page}).then(function (response) {
                $scope.response = response.data
                $scope.log = response.data.data
            })
        }
        $scope.pagin = function (page) {
            $scope.getLog(page)
        }
        $scope.getLog()

    })
    .controller('UserRegisterAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http) {
        $scope.page = 1
        $scope.getLog = function (page) {
            $scope.page = page || 1

            $rootScope.service.JoboApi('log/user', {page: $scope.page}).then(function (response) {
                $scope.response = response.data
                $scope.log = response.data.data
            })
        };
        $scope.pagin = function (page) {
            $scope.getLog(page)
        }
        $scope.getLog()

    })
    .controller('profileAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http) {
        $scope.page = 1
        $scope.getLog = function (page) {
            $scope.page = page || 1

            $rootScope.service.JoboApi('log/profile', {page: $scope.page}).then(function (response) {
                $scope.response = response.data
                $scope.log = response.data.data
            })
        };
        $scope.pagin = function (page) {
            $scope.getLog(page)
        }
        $scope.getLog()

    })
    .controller('functionAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, $q, toastr) {

        $scope.PostToGroup = function (text, where, poster) {
            console.log('text', text, where, poster)
            $rootScope.service.JoboApi('PostToGroup', {text: text, where: where, poster: poster}).then(function (res) {
                console.log(res)
            })
        };
        $scope.data = {employer: {}, store: {}, job: {}}

        $scope.getJob = function () {
            for (var i in $scope.profile) {
                var card = $scope.profile[i]
                if (card.photourl == 'https://cdn0.iconfinder.com/data/icons/e-commerce-and-shopping-2/512/shop_store_market_shopping_cafe_retail_sale_trading_trade_products_commerce_marketplace_bar_bistro_grocery_building_service_business_flat_design_icon-512.png') {
                    card.photourl = ''
                }
                if (card.interest && card.interest.job) {
                    card.job = converJob(card.interest.job)
                } else {
                    card.job = {}
                }

                if (card.location) {
                    var store = {
                        "address": card.location.address || '',
                        "createdBy": card.userid || '',
                        "createdAt": card.dateCreated || new Date().getTime(),
                        "googleIns": '',
                        "industry": convertIns(card.industry) || '',
                        "job": card.job,
                        "location": card.location.location,
                        "avatar": card.photourl,
                        "storeId": card.userid,
                        "storeName": card.name,
                        "description": card.description || ''
                    }
                }
                console.log(card, store)
                db.ref('store/' + i).set(store)

            }
        }

        $scope.loadStore = function () {
            console.log('click')

            db.ref('store').once('value', function (snap) {
                $scope.storeList = snap.val()
                console.log('done')
            })
        }

        $scope.getNewJob = function () {
            console.log('click')

            for (var i in $scope.storeList) {
                var card = $scope.storeList[i]
                if (card.job) {
                    for (var k in card.job) {
                        var store = {
                            "createdBy": card.storeId || '',
                            "createdAt": card.createdAt,
                            "job": k,
                            "jobId": card.storeId + ':' + k,
                            "storeId": card.storeId
                        }
                        db.ref('job/' + card.storeId + ':' + k).set(store)
                    }

                }

            }
        }


        function convertIns(data) {
            if (data == 'banle') {
                return 'store'
            }
            if (data == 'Nhà hàng' || data == 'nhahang') {
                return 'restaurant_bar'
            }
            if (data == 'caphe') {
                return 'store'
            }
            if (data == 'coworking') {
                return 'others'
            }
            if (data == 'giaoduc') {
                return 'education_centre'
            }
            if (data == 'khac' || data == 'Khác') {
                return 'others'
            }
            if (data == 'khachsan') {
                return 'lodging'
            }
            if (data == 'rapchieuphim') {
                return 'supermarket_cinema'
            }
        }


        function converJob(oldJob) {
            var jobnew = {}
            var a = 0
            for (var i in oldJob) {
                if (dataJ[i] != 'undefined' && a < 3) {
                    a++
                    jobnew[dataJ[i]] = true
                }
            }
            return jobnew
        }

        function converTime(oldTime) {
            var timenew = {}
            var a = 0
            for (var i in oldTime) {
                if (timeJ[i] != 'undefined' && a < 3) {
                    a++
                    timenew = timeJ[i]
                }
            }
            return timenew
        }

        function converFreeTime(oldTime) {
            var timenew = {}
            var a = 0
            for (var i in oldTime) {
                if (freetimeJ[i] != 'undefined' && a < 3) {
                    a++
                    timenew[freetimeJ[i]] = true
                }
            }
            return timenew
        }


        var newjob = {
            "pg": "PG/Sự kiện",
            "actor": "Diễn viên/Casting",
            "administration": "Hành chính/ Nhân sự",
            "cabin_crew": "Tiếp viên hàng không",
            "cook": "Đầu bếp",
            "fashion": "Người mẫu/Thời trang",
            "financing_accounting": "Tài chính / Kế toán",
            "manager": "Quản lý điều hành",
            "marketing_pr": "Marketing/ PR",
            "mc_event": "MC/Sân khấu",
            "receptionist_cashier": "Lễ tân/ Thu ngân",
            "sale": "Bán hàng/sale",
            "secretary": "Trợ lý/Thư ký",
            "server": "Phục vụ",
            "designer": "Designer",
            "other": "Khác"
        }

        var freetimeJ = {
            "breakchieu": "afternoon",
            "breaktrua": "noon",
            "fullchieu": "afternoon",
            "fullsang": "morning",
            "partsang": "morning",
            "parttoi": "evening",
            "weekday": "morning",
            "weeknight": "evening",
            "endday": "evening",
            "endnight": "evening",
            "flexible": "morning"
        }

        var timeJ = {
            "breakchieu": "parttime",
            "breaktrua": "parttime",
            "fullchieu": "fulltime",
            "fullsang": "fulltime",
            "partsang": "parttime",
            "parttoi": "parttime",
            "weekday": "fulltime",
            "weeknight": "parttime",
            "endday": "parttime",
            "endnight": "parttime",
            "flexible": "seasonal",
        }


        var dataJ = {
            "banhang": "sale",
            "baotri": "other",
            "baove": "other",
            "chamsockhachhang": "sale",
            "chamsockhachtiensanh": "server",
            "chaokhach": "receptionist_cashier",
            "chayban": "server",
            "chaysukienbuffet": "server",
            "chuanbinguyenlieu": "cook",
            "daubep": "cook",
            "designer": "designer",
            "dieuphoi": "manager",
            "donphong": "other",
            "giaohang": "other",
            "giuhanhly": "receptionist_cashier",
            "hauphong": "other",
            "ketoan": "financing_accounting",
            "ketoandem": "financing_accounting",
            "khohang": "other",
            "lambanh": "cook",
            "lampizza": "cook",
            "letan": "receptionist_cashier",
            "marketing": "marketing_pr",
            "nhomtruongmon": "cook",
            "phache": "server",
            "phongchieu": "other",
            "phucvu": "server",
            "phucvuphache": "server",
            "quangia": "manager",
            "quanly": "manager",
            "quanlyca": "server",
            "quanlykhohang": "other",
            "ruabat": "cook",
            "thungan": "receptionist_cashier",
            "tongdai": "receptionist_cashier",
            "trongcoi": "other",
            "start": "other"
        }


        // This is called with the results from from FB.getLoginStatus().
        function statusChangeCallback(response) {
            console.log('statusChangeCallback');
            console.log(response);
            if (response && response.authResponse && response.authResponse.accessToken) {

            }
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                testAPI();
            } else {
                // The person is not logged into your app or we are unable to tell.
                console.log('The person is not logged into your app or we are unable to tell.');

            }
        }

        // This function is called when someone finishes with the Login
        // Button.  See the onlogin handler attached to it in the sample
        // code below.
        function checkLoginState() {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        }


        // Here we run a very simple test of the Graph API after login is
        // successful.  See statusChangeCallback() for when this call is made.
        function testAPI() {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                console.log("Successful Access" + response.name);

            });
        }

        $scope.getToken = function (accessToken) {
            console.log(accessToken)
            $rootScope.accessToken = accessToken

        }
        $scope.getaccess = function () {
            checkLoginState
            console.log('click')
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        };

        $rootScope.accessToken = 'EAAEMfZASjMhgBAD60T6ytMYX2ZBdbZCkgxoZA2XpXLKattHNquxWgPjGqlCMWDX3CE28rx6NRuDbxhVITTUM6AqQW9UcZA3LrMvnsIAWjwl4a1BZAOQjbBagcbyTSyIB8fjgzZBA05ZAl7Ih8ElCGe0jZCf8ZA0i7IxQOCfAYZBe0pmGsjr1wtqc4Hm'
        $scope.groupId = '316500605097124'
        $scope.getFeedGroup = function (groupId) {
            console.log('click')
            FB.api(
                "/" + groupId + "/feed?access_token=" + $rootScope.accessToken,
                function (response) {
                    console.log(response)

                    if (response && !response.error) {

                        /* handle the result */
                        $timeout(function () {
                            $scope.postData = []

                            for (var i in response.data) {
                                var post = response.data[i]
                                $scope.getPost(post.id).then(function (res) {
                                    console.log('res', res)
                                    $scope.newpost = {
                                        id: res.id,
                                        message: res.message,
                                        nextline: nextLine(res.message),
                                        job: {
                                            viewed: res.likes.data.length + 2 * res.comments.data.length,
                                            applied: res.likes.data
                                        },
                                        storeAvatar: res.full_picture,
                                        employer: res.from,
                                        keyjob: filterJob(res.message)
                                    }
                                    $scope.postData.push($scope.newpost)


                                })
                            }

                        })
                    } else {
                        console.log(response.error.message)


                    }
                }
            );
        }

        function createEmployerData(userId, userData) {
            db.ref('user/' + userId).update({
                type: 1,
                phone: userData.phone,
                userId: userId,
                email: userData.email,
                createdAt: new Date().getTime()
            });
            toastr.success('Create Employer Data', userId)
        }

        var staticData = {
            viewed: 0,
            liked: 0,
            shared: 0,
            rated: 0,
            rateAverage: 0,
            matched: 0,
            chated: 0,
            like: 0,
            share: 0,
            rate: 0,
            match: 0,
            chat: 0,
            timeOnline: 0,
            login: 1,
            profile: 0
        }

        function createStoreData(storeId, storeData, jobKey) {
            var job = {}
            job[jobKey] = true
            storeData = Object.assign(storeData, {
                storeId: storeId,
                createdBy: storeId,
                createdAt: new Date().getTime(),
                job: job
            }, $scope.dataAdd)
            $scope.dataAdd = {}
            db.ref('store/' + storeId).update(storeData);
            db.ref('static/' + storeId).update(staticData);

            toastr.success('Create Store Data', storeId)
        }

        function createJobData(storeId, jobData) {
            var jobId = storeId + ':' + jobData.job
            jobData = Object.assign(jobData, {
                storeId: storeId,
                createdBy: storeId,
                createdAt: new Date().getTime(),
                jobId: jobId
            })
            db.ref('job/' + jobId).update(jobData);
            toastr.success('Create Job Data', storeId)
        }

        $scope.saveJob = function (data, index) {
            console.log(data, index)
            // 1 Tạo account:
            $rootScope.service.JoboApi('createuser', {
                email: data.employer.email,
                password: 'tuyendungnhanh',
                uid: data.id
            }).then(function (res) {
                console.log(res.data)
                var user = res.data
                if (user.uid) {
                    createEmployerData(user.uid, data.employer);

                    createStoreData(user.uid, data.store, data.job.job);

                    createJobData(user.uid, data.job);

                    $scope.postComment(data.id, data.comment, 'https://joboapp.com/view/store/' + user.uid)

                } else {
                    toastr.error('lỗi')
                }

            })

        }


        //342864005869206_716417521847184
        $scope.getPost = function (postId) {
            console.log('click');
            var output = {},
                deferred = $q.defer();

            FB.api('/' + postId + '?fields=message,full_picture,comments,likes{pic_small},from&access_token=' + $rootScope.accessToken,
                function (response) {
                    if (response && !response.error) {
                        /* handle the result */
                        console.log(response)
                        output = response
                        deferred.resolve(output);

                    }
                }
            );
            return deferred.promise;

        }

//103163799824216_883938065080115
        $scope.postComment = function (postId, text, link) {
            FB.api(
                "/" + postId + "/comments?access_token=" + $rootScope.accessToken,
                "POST",
                {
                    "message": text + " " + link
                },
                function (response) {
                    if (response && !response.error) {
                        console.log(response)
                        /* handle the result */
                    } else {
                        console.log(response)

                    }
                }
            );
        };


        var jobWord = {
            'pg': "pg",
            'pb': "pg",
            'hanh chinh': "administration"
        }

        function nextLine(text) {
            console.log(text.split(/\r\n|\r|\n/g))
            return text.split(/\r\n|\r|\n/g);
        }

        function filterJob(mes) {
            var toLowerCase = mes.toLowerCase()
            var latinise = S(toLowerCase).latinise().s

            for (var i in jobWord) {
                var pos = latinise.search(i);
                if (pos != -1) {
                    return jobWord[i]
                    break
                }


            }


        }

//address
        $scope.autocompleteAddress = {text: ''};
        $scope.ketquasAddress = [];
        $scope.searchAddress = function () {
            $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
            $http({
                method: 'GET',
                url: $scope.URL
            }).then(function successCallback(response) {
                $scope.ketquasAddress = response.data.results;
                console.log($scope.ketquasAddress);
                $('#list-add').show();

            })
        };
        $scope.setSelectedAddress = function (selected) {
            $scope.autocompleteAddress.text = selected.formatted_address;
            $scope.address = selected;
            $scope.dataAdd = {address: selected.formatted_address, location: selected.geometry.location}

            console.log(selected);
            $('#list-add').hide();
            //$rootScope.userData.address = selected.formatted_address;
            //$rootScope.userData.location = selected.geometry.location;

        };
        $rootScope.accessToken = 'EAAEMfZASjMhgBAMVlWc3Rr2F4bY9GN67OZBRh86rtrpCYZASC013pOZBnvwShYVMh2aUfJJNPEHoGf3IdzWoPwnEMGSnPNqCviKKCMEZBsjKg184UjluMmtyXMzirAZB9qfZBIavFCMZBRCLt8ZAqeioLQh1im9bxq7wZD'
        $scope.eraseAddress = function () {
            $scope.autocompleteAddress.text = null;
            $('#list-add').hide();
        }
        var postId = '137192719958155_189234488087311'


        $scope.collectComment = function (postId, refer) {
            if (!$scope.refer) {
                $scope.refer = refer
            }
            $scope.postId = postId;
            var newfilter = {
                access_token: 'EAAEMfZASjMhgBAD60T6ytMYX2ZBdbZCkgxoZA2XpXLKattHNquxWgPjGqlCMWDX3CE28rx6NRuDbxhVITTUM6AqQW9UcZA3LrMvnsIAWjwl4a1BZAOQjbBagcbyTSyIB8fjgzZBA05ZAl7Ih8ElCGe0jZCf8ZA0i7IxQOCfAYZBe0pmGsjr1wtqc4Hm',
                pretty: 0,
                limit: 1000
            };
            if ($scope.after) {
                newfilter.after = $scope.after
            }
            $http({
                method: 'GET',
                url: 'https://graph.facebook.com/v2.8/' + $scope.postId + '/comments',
                params: newfilter
            }).then(function (res) {
                if (!$rootScope.resObject) {
                    $rootScope.resObject = []
                }
                $rootScope.resObject = $rootScope.resObject.concat(res.data.data);
                console.log($rootScope.resObject.length)
                if (res.data.paging && res.data.paging.cursors && res.data.paging.cursors.after) {
                    $scope.after = res.data.paging.cursors.after
                    $scope.collectComment($scope.postId)
                } else {
                    $scope.after = null;
                    console.log('upload email from ' + $scope.refer)
                    getThemAll($scope.refer)
                }
            })

        }

        function getThemAll(refer) {
            var dataObject = {}
            for (var i in $rootScope.resObject) {
                var userData = $rootScope.resObject[i]
                var email = checkEmail(userData.message)
                if (email) {
                    var data = {
                        id: userData.id,
                        name: userData.from.name,
                        email: email,
                        from: refer,
                        createdAt: new Date().getTime()
                    }
                    dataObject[userData.id] = data
                }
            }
            return new Promise(function (resolve, reject) {
                resolve(dataObject)
            }).then(function (dataObject) {
                console.log('startup')
                db.ref('emailChannel').update(dataObject).then(function (res) {
                    console.log('done', res)
                }, function (err) {
                    console.log('err', err)

                }, function (pro) {
                    console.log('progess', pro)

                })


            })

        }

        // var i = 0
        // db.ref('emailChannel').on('child_added', function (snap) {
        //     i = i + 1
        //     console.log(i)
        // })
        function checkEmail(text) {


            var emailsArray = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            if (emailsArray != null && emailsArray.length) {
                //has email

                return emailsArray[0]
            }
        }


    })
    .controller('workingAdminCtrl', function ($scope, $timeout, $rootScope, toastr) {
        var workingRef = db.ref('working/job')
        workingRef.on('value', function (snap) {
            $timeout(function () {
                $scope.working = snap.val()
            })
        });
        $scope.new = {status: 'new'};
        $scope.addJob = function (card) {
            card.deadline = new Date(card.deadline).getTime()
            card.createdAt = new Date().getTime();
            var date = new Date(card.deadline).getTime()
            if (card.repeat && card.setRepeat) {
                var array = card.setRepeat.split(',')
                date = {
                    hour: array[0],
                    minute: array[1],
                    dayOfWeek: array[2]
                }
            }
            $timeout(function () {
                console.log(date)
                card.newkey = workingRef.push().key;
                workingRef.child(card.newkey).set(card)
                var obj = {
                    date: date,
                    userId: card.incharge,
                    subject: 'Task mới nè',
                    body: card.job + ' ' + card.description + ' ' + 'deadline:' + card.deadline
                }

                $rootScope.service.JoboApi('admin/scheduleemail', obj).then(function (res) {
                    console.log(res.data)
                })
            })
            console.log(card)


        }

        var hrRef = db.ref('working/hr')

        hrRef.on('value', function (snap) {
            $timeout(function () {
                $scope.hr = snap.val()
            })
        });
        $scope.addUser = function (card) {
            console.log(card)
            hrRef.child(card.uid).set(card)
            var usersRef = db.ref('user').child(card.uid)
            usersRef.update({
                type: 0,
                phone: card.phone,
                userId: card.uid,
                email: card.email,
                createdAt: new Date().getTime()
            });
            $rootScope.service.JoboApi('admin/createuser', card).then(function (res) {
                toastr.info('res.data')
            })
        }
    })
    .controller('leadCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
        //address
        $scope.newfilter = {}

        $scope.autocompleteAddress = {text: ''};
        $scope.ketquasAddress = [];
        $scope.searchAddress = function () {
            $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
            $http({
                method: 'GET',
                url: $scope.URL
            }).then(function successCallback(response) {
                $scope.ketquasAddress = response.data.results;
                console.log($scope.ketquasAddress);
                $('#list-add').show();

            })
        };

        $scope.setSelectedAddress = function (selected) {

            $scope.autocompleteAddress.text = selected.formatted_address;
            $scope.address = selected;


            $scope.newfilter.location = selected.geometry.location;
            $scope.newfilter.address = selected.formatted_address;

            console.log(selected);
            $('#list-add').hide();

        };

        $scope.eraseAddress = function () {
            $scope.autocompleteAddress.text = null;
            $('#list-add').hide();
        }


        $scope.createHospital = function (newfilter, p) {
            newfilter.p = p
            console.log(newfilter);


            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/lead',
                params: newfilter
            }).then(function successCallback(response) {
                $timeout(function () {
                    $scope.response = response.data
                    console.log($scope.response)
                    $scope.employer = $scope.response.data;

                })
            }, function (error) {
                console.log(error)
            })
        };
        $scope.createHospital($scope.newfilter, 1)

        $scope.page = 1;
        $scope.pagin = function (page) {
            console.log(page)
            $scope.createHospital($scope.newfilter, page)
        };
        $scope.addLead = function (card) {
            card.createdAt = new Date().getTime();
            card.userId = $rootScope.userId

            if ($scope.newfilter && $scope.newfilter.location) {
                card.location = $scope.newfilter.location
                card.address = $scope.newfilter.address
            }

            console.log(card)
            $rootScope.service.JoboApi('update/lead', {
                lead: JSON.stringify(card)
            }).then(function (res) {

                if (res.data && res.data.code == 'success' && res.data.id) {
                    toastr.success('Cập nhật thành công')
                    $scope.storeData = card
                    $scope.storeData.storeId = res.data.id

                }


            }).catch(function (err) {
                toastr.error('Lỗi cập nhật tin tuyển dụng')
            });
        }
        $scope.setEmail = function (storeData) {
            $scope.mail = {
                title: 'Chào mừng ' + storeData.storeName + ' tuyển gấp nhân viên trên Jobo',
                fromName: $rootScope.userData.name + ' | Jobo - Tìm việc nhanh',
                from: $rootScope.userData.email,
                to: storeData.email,
                description1: 'Chào ' + storeData.storeName + '<br>Jobo.asia là dự án cung cấp nhân viên gấp cho ngành dịch vụ trong vòng 24h, với mong muốn giúp nhà tuyển dụng tiết kiệm thời gian để tìm được ứng viên phù hợp. <br> Chúng tôi hiện đang có hơn 12000+ ứng viên và sẵn sàng cung cấp đủ số lượng ứng viên phù hợp với vị trí ' + $rootScope.Lang[storeData.job] + ' mà đối tác cần tuyển.<br> <br> <b>Các quyền lợi của ' + storeData.storeName + ' khi trở thành đối tác của JOBO: </b><br> <br> - Cung cấp nhân sự ngay <b>trong vòng 24h</b> và không phải trả phí đối với các ứng viên bị loại.<br> - Tự động đăng tin lên hơn 20+ group tuyển dụng Facebook, website vệ tinh<br> - Quảng cáo thương hiệu <b>hoàn toàn miễn phí</b> trên các kênh truyền thông với hơn 200,000 lượt tiếp cận..<br> <br> Chúng tôi rất mong nhận được phản hồi và xin phép liên hệ lại để giải đáp tất cả các thắc mắc.<br> Để biết thêm các thông tin chi tiết về JOBO – Ứng dụng tuyển dụng nhanh, đối tác có thể tham khảo file đính kèm.<br>Dưới đây là danh sách ứng viên phù hợp với vị trí ' + $rootScope.Lang[storeData.job] + ' mà Jobo đã tìm cho đối tác. Hãy chọn ứng viên nào đối tác thấy phù hợp và gọi cho chúng tôi để tuyển ứng viên đó',
                description2: 'Nếu vẫn chưa chọn được ứng viên phù hợp, đối tác hãy truy cập vào web của jobo để xem thêm hơn +5500 ứng viên nữa. <br>',
                description3: $rootScope.userData.name + ' - Recruitment Manager <b>' + $rootScope.userData.phone + '<br> ' + $rootScope.userData.email,
                storeId: storeData.storeId,
                job: storeData.job,
                location: storeData.location
            }

        }

        //Excel Ctrl
        $scope.importLead = function () {
            axios.get(CONFIG.AnaURL + '/lead/collection')
                .then(result => toastr.success(`Updated: ${result.data.length} rows`))
                .catch(err => toastr.error(err));
        }

        $scope.exportLead = function () {
            axios.get(CONFIG.AnaURL + '/lead/export')
                .then(result => {
                    toastr.success(`Updated Range: ${result.data.response.updates.updatedRange}`);
                })
                .catch(err => toastr.error(err));
        }

    })
    .controller('emailCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
        //address
        $scope.newfilter = {}

        $scope.createHospital = function (newfilter, p) {
            newfilter.p = p
            console.log(newfilter)

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/email',
                params: newfilter
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    $scope.response = response.data
                    $scope.emailList = response.data.data;
                })
            }, function (error) {
                console.log(error)
            })
        };
        $scope.createHospital($scope.newfilter)

        $scope.page = 1
        $scope.pagin = function (page) {
            console.log(page)
            $scope.createHospital($scope.newfilter, page)
        }


    })
    .controller('scheduleCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {

        $scope.newfilter = {};


        $scope.getReport = function () {
            $http({
                method: 'GET',
                url: CONFIG.AnaURL + '/getallpost'
            }).then(function successCallback(response) {
                const posts = response.data;
                const length = posts.length;
                const posted = posts.filter(post => post.id != null).length;
                const alive = posts.filter(post => {
                    if (post.checks && post.checks[0] && post.checks[post.checks.length - 1].error) return true;
                    else return false;
                }).length;
                const godTimes = [];
                for (let hour = 0; hour < 24; hour++) {
                    godTimes[hour] = {
                        post: posts.filter(post => new Date(post.sent).getHours() === hour).length,
                        comments: posts.map(post => {
                            if (new Date(post.sent).getHours() === hour && post.checks && post.checks[0] && post.checks[post.checks.length - 1].comments) return post.checks[post.checks.length - 1].comments;
                            else return 0;
                        }).reduce((sum, value) => sum + value, 0),
                        reactions: {
                            like: posts.map(post => {
                                if (new Date(post.sent).getHours() === hour && post.checks && post.checks[0] && post.checks[post.checks.length - 1].reactions) return post.checks[post.checks.length - 1].reactions.like;
                                else return 0;
                            }).reduce((sum, value) => sum + value, 0),
                            love: posts.map(post => {
                                if (new Date(post.sent).getHours() === hour && post.checks && post.checks[0] && post.checks[post.checks.length - 1].reactions) return post.checks[post.checks.length - 1].reactions.love;
                                else return 0;
                            }).reduce((sum, value) => sum + value, 0),
                            haha: posts.map(post => {
                                if (new Date(post.sent).getHours() === hour && post.checks && post.checks[0] && post.checks[post.checks.length - 1].reactions) return post.checks[post.checks.length - 1].reactions.haha;
                                else return 0;
                            }).reduce((sum, value) => sum + value, 0),
                            sad: posts.map(post => {
                                if (new Date(post.sent).getHours() === hour && post.checks && post.checks[0] && post.checks[post.checks.length - 1].reactions) return post.checks[post.checks.length - 1].reactions.sad;
                                else return 0;
                            }).reduce((sum, value) => sum + value, 0),
                            angry: posts.map(post => {
                                if (new Date(post.sent).getHours() === hour && post.checks && post.checks[0] && post.checks[post.checks.length - 1].reactions) return post.checks[post.checks.length - 1].reactions.angry;
                                else return 0;
                            }).reduce((sum, value) => sum + value, 0)
                        }
                    }
                }

                $timeout(function () {
                    $scope.length = length;
                    $scope.alive = alive;
                    $scope.posted = posted;
                    $scope.godTimes = godTimes;
                })
            }, function (error) {
                console.log(error)
            })
        }
        $scope.pagingSchedules = function (newfilter, p) {
            newfilter.p = p
            console.log(newfilter)

            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/getFbPost',
                params: newfilter
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    $scope.response = response.data
                    $scope.schedules = $scope.response.data
                })
            }, function (error) {
                console.log(error)
            })
        };
        $scope.deletePost = function (newfilter) {
            console.log(newfilter);
            $http({
                method: 'DELETE',
                url: CONFIG.APIURL + '/removePost',
                params: newfilter
            }).then(function successCallback(response) {
                console.log("respond", response);
                $timeout(function () {
                    $scope.response = response.data
                    toastr.info($scope.response)
                })
            }, function (error) {
                console.log(error)
            })
        };
        $scope.pagingSchedules($scope.newfilter, 1)

        $scope.page = 1;
        $scope.pagin = function (page) {
            console.log(page)
            $scope.pagingSchedules($scope.newfilter, page)
        };
        $scope.currentDate = new Date(Date.now());
    })
    .controller('notificationCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
        //address
        $scope.newfilter = {};

        $scope.createHospital = function (newfilter, p) {
            newfilter.p = p
            console.log(newfilter);
            $http({
                method: 'GET',
                url: CONFIG.APIURL + '/api/notification',
                params: newfilter
            }).then(function successCallback(response) {
                console.log("respond", response.data);
                $timeout(function () {
                    $scope.response = response.data
                    $scope.response.data = $scope.response.data.map(data => $rootScope.service.timify(data))

                })
            }, function (error) {
                console.log(error)
            })
        };
        $scope.createHospital({});

        $scope.page = 1
        $scope.pagin = function (page) {
            console.log(page)
            $scope.createHospital($scope.newfilter, page)
        }


    })
    .controller('ladibotCtrl', function (AuthUser, $stateParams, $state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
        var state = $stateParams.id
        $scope.url = $stateParams.url
        console.log(state, $scope.url)
        $scope.chatBot = {}
        if (state && state == 'create') {
            if ($scope.url) {
                $rootScope.service.JoboApi('getchat?url=' + $scope.url)
                    .then(function successCallback(response) {
                        console.log('response', response)
                        toastr.info('success sent', response.data)
                        $timeout(function () {
                            $scope.chatBot = response.data
                        })
                    }, function (error) {
                        console.log('error', error)
                        toastr.error(error)
                    })
            }

        }
        loop();

        function loop() {
            if (typeof FB === "undefined") $timeout(function () {
                loop()
            }, 1000)
            else FB.getLoginStatus(function (response) {
                statusChangeCallback(response);

                FB.Event.subscribe('auth.statusChange', auth_status_change_callback);

// In your JavaScript

            });

        }


        $scope.pageList = []
        $scope.viewLink = ''

        $scope.setPage = function (card, url) {

            $scope.loading = true
            $rootScope.service.JoboApi('getchat', {
                pageID: card.id,
                access_token: card.access_token,
                name: card.name,
                url: url
            }).then(function successCallback(response) {
                $scope.loading = false

                console.log('response', response)
                $timeout(function () {
                    $scope.chatBot = response.data
                    $scope.viewLink = `https://m.me/${card.id}?ref=${$scope.chatBot.flow}_w`
                })
            }, function (error) {
                console.log('error', error)
                toastr.error(error)
            })

        }


        var auth_status_change_callback = function (response) {
            console.log("auth_status_change_callback: " + response.status);
            if (response.status == 'connected') {
                toastr.info('Welcome!  Fetching your information.... ');
                FB.api('/me', function (user) {

                    console.log('Good to see you, ', user);

                    FB.api('/me/accounts', function (response) {
                        console.log(response)
                        $timeout(function () {
                            $scope.pageList = response.data

                            if ($scope.pageList.length > 0) {


                            } else {
                                toastr.info('No page created.');

                            }
                        })


                    });

                })
            }

        }

        function statusChangeCallback(response) {
            console.log('statusChangeCallback');
            console.log(response);
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                auth_status_change_callback(response);
            } else {
                // The person is not logged into your app or we are unable to tell.
                console.log('Please log into this app.')
            }
        }

        // This function is called when someone finishes with the Login
        // Button.  See the onlogin handler attached to it in the sample
        // code below.


        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Here we run a very simple test of the Graph API after login is
        // successful.  See statusChangeCallback() for when this call is made.



    })



