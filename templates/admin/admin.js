"use strict";


app.controller('jobseekerAdminCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http, toastr) {
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
        firebase.database().ref('user/' + userid).once('value', function (res) {
            $scope.profileData[userid] = res.val()

        })
    }

    $scope.mail = {};
    $scope.data = {};

    $scope.sendEmail = function () {

        console.log($scope.mail)
        var mailstring = JSON.stringify($scope.mail)
        var params = {
            mail: mailstring,
            name: $scope.data.name,
            number: $scope.data.number

        }
        console.log(params)
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/admin/sendEmail',
            params: params
        }).then(function successCallback(response) {
            console.log("respond", response);
        }, function (error) {
            console.log(error)
        })

    }
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
        firebase.database().ref('profile/' + userId).set(null).then(function (data) {
            toastr.success('done', data)
        }, function (error) {
            toastr.error('error', error)

        })
    }
    $scope.updateProfile = function (index) {
        var card = $scope.jobSeeker[index]
        console.log(card)
        firebase.database().ref('profile/' + card.userId).update(card).then(function () {
            toastr.success('done', card.feature + card.hide)
        }, function (error) {
            toastr.error('error', error)

        })
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
            firebase.database().ref('user/' + userid).once('value', function (res) {
                $scope.profileData[userid] = res.val()
            })
        }
        $scope.deleteProfile = function (storeId) {
            firebase.database().ref('store/' + storeId).set(null).then(function (data) {
                toastr.success('done', data)
            }, function (error) {
                toastr.error('error', error)

            })
        }
        $scope.updateProfile = function (index) {
            var card = $scope.employer[index]
            console.log(card)
            firebase.database().ref('store/' + card.storeId).update(card).then(function (data) {
                toastr.success('done', card.feature + card.hide)
            }, function (error) {
                toastr.error('error', error)

            })
        }
    })
    .controller('dashAdminCtrl', function () {
    })
    .controller('adminLogCtrl', function ($state, $scope, $rootScope, $timeout, CONFIG, $http) {
        $scope.page = 1
        $scope.getLog = function (page) {
            $scope.page = page || 1

            $rootScope.service.JoboApi('log/act', {page: $scope.page}).then(function (response) {
                $scope.response = response.data
                $scope.log = response.data.data
            })
        }
        $scope.pagin = function (page) {
            $scope.getLog(page)
        }
        $scope.getLog()

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
            var db = firebase.database()
            $scope.convert = function () {

                for (var i in $scope.profile) {
                    var card = $scope.profile[i]
                    // if (card.stars) {
                    //      for (var k in card.stars) {
                    //           if($scope.profile[k] && $scope.profile[k].name && $scope.profile[k].userid){
                    //              if($scope.profile[k].photourl == "http://www.ppp-alumni.de/fileadmin/user_upload/user_upload/alumni-berichten/platzhalter-leuchtturm.jpg"){
                    //                  $scope.profile[k].photourl =''
                    //              }
                    //              var reviews = {
                    //                  name: $scope.profile[k].name,
                    //                  avatar: $scope.profile[k].photourl || "",
                    //                  userId: $scope.profile[k].userid,
                    //                  rate: rating,
                    //                  createdAt: new Date().getTime() - 60000 * 24 * 30 *10* Math.random(),
                    //                  type: 2
                    //              };
                    //              rating = 9 - rating
                    //          }
                    //
                    //          firebase.database().ref('activity/review/' + card.userid + '/' + reviews.userId).update(reviews)
                    //
                    //      }
                    //  }
                    var viewed = ((card.starCount || 0) + (card.disstarCount || 0)) * 10
                    var disliked = card.disstarCount || 0
                    firebase.database().ref('static/' + card.userid).update({viewed: viewed, disliked: disliked})
                    console.log('Rating', viewed, disliked);
                }
            }


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

            $rootScope.accessToken = ''
            $scope.groupId = '316500605097124'
//316500605097124
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

            $rootScope.resObject = []
            $scope.collectComment = function (postId, refer) {
                if (!$scope.refer) {
                    $scope.refer = refer
                }
                $scope.postId = postId;
                var newfilter = {
                    access_token: $rootScope.accessToken,
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
                    firebase.database().ref('emailChannel').update(dataObject).then(function (res) {
                        console.log('done', res)
                    }, function (err) {
                        console.log('err', err)

                    }, function (pro) {
                        console.log('progess', pro)

                    })


                })

            }

            // var i = 0
            // firebase.database().ref('emailChannel').on('child_added', function (snap) {
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
        }
    )
    .controller('workingAdminCtrl', function ($scope, $timeout, $rootScope, toastr) {
        var workingRef = firebase.database().ref('working/job')
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

        var hrRef = firebase.database().ref('working/hr')

        hrRef.on('value', function (snap) {
            $timeout(function () {
                $scope.hr = snap.val()
            })
        });
        $scope.addUser = function (card) {
            console.log(card)
            hrRef.child(card.uid).set(card)
            var usersRef = firebase.database().ref('user').child(card.uid)
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
    .controller('adminprofileCtrl', sprofileCtrl)
function sprofileCtrl($rootScope, $scope, $stateParams, $window, $timeout, $state, toastr, $http, firebase, CONFIG, Upload, usSpinnerService, $sce, $anchorScroll, $location) {
    $scope.startSpin = function (spin) {
        usSpinnerService.spin(spin);
    }
    $scope.stopSpin = function (spin) {
        usSpinnerService.stop(spin);
    }
    $scope.init = function (id) {
        $scope.multiple = {
            industry: [],
            languages: [],
            time: [],
            job: []
        };

        $scope.progress = 0
        firebase.database().ref('profile/' + id).once('value', function (snap) {
            $rootScope.userData = snap.val()


            $scope.multiple = {
                industry: [],
                languages: [],
                time: [],
                job: []
            };

            $scope.picFile = null;


            if ($rootScope.userData.school) {
                $scope.autocompleteSchool = {text: $rootScope.userData.school}
            }
            if ($rootScope.userData.address) {
                $scope.autocompleteAddress = {text: $rootScope.userData.address}
            }

            if ($rootScope.userData.industry) {
                for (var i in $rootScope.userData.industry) {
                    $scope.multiple.industry.push(i)
                }
            }
            if ($rootScope.userData.languages) {
                for (var i in $rootScope.userData.languages) {
                    $scope.multiple.languages.push(i)
                }
            }

            if ($rootScope.userData.job) {
                for (var i in $rootScope.userData.job) {
                    $scope.multiple.job.push(i)
                }
            }
            if ($rootScope.userData.birth) {
                $rootScope.userData.birth = $rootScope.service.convertDateRes($rootScope.userData.birth)
            }

            if (!$rootScope.userData.photo) {
                $rootScope.userData.photo = []
            }

            $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.userData.videourl)
        })
    }

    $rootScope.userId = $stateParams.id
    if ($rootScope.userId) {
        $scope.init($rootScope.userId)
    }


    $scope.rangeFinishCallback = function (sliderObj) {
        var newValue = sliderObj.from;
        console.log(newValue)

        if ($scope.userData) {
            $scope.userData.expect_distance = newValue
        }
    }

    $scope.uploadAvatar = function (imageData, errFiles) {
        $scope.avatarUpload = true
        $scope.startSpin('avatar');

        var uploadRef = firebase.storage().ref().child('images/' + $rootScope.userId)
        uploadRef.putString(imageData, 'data_url').then(function (snapshot) {
            if ($scope.avatarUpload == true) {
                console.log('Uploaded a base64 string!', snapshot);
                var downloadAvatar = snapshot.downloadURL;
                console.log(downloadAvatar);
                $rootScope.userData.avatar = downloadAvatar;
                $scope.$apply(function () {
                    $scope.stopSpin('avatar');
                    delete $scope.picFile;
                    downloadAvatar = null;
                    $scope.avatarUpload = false
                })
            }

        });


    };


    $scope.uploadVideo = function (imageData) {
        $scope.startSpin('video');
        $scope.videoUpload = true

        console.log('imageData', imageData)
        var metadata = {
            'contentType': imageData.type
        };
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('video/' + $rootScope.userId).put(imageData, metadata);
        uploadTask.then(function (snapVideo) {
            if ($scope.videoUpload == true) {
                var downloadVideo = snapVideo.downloadURL;
                console.log(downloadVideo);
                $timeout(function () {
                    $rootScope.userData.videourl = downloadVideo;
                    $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.userData.videourl)
                    $scope.$apply(function () {
                        $scope.stopSpin('video');
                        downloadVideo = null
                    })

                })

                $scope.videoUpload = false
            }
        })
        uploadTask.on('state_changed', function (snapVideo) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

            var progress = (snapVideo.bytesTransferred / snapVideo.totalBytes) * 100;
            $timeout(function () {
                $scope.progress = Math.round(progress * 10) / 10

            });
            $scope.progress = progress

            console.log('Upload is ' + progress + '% done');

            switch (snapVideo.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete

        });
    };

//school
    $scope.autocompleteSchool = {text: ''};
    $scope.searchSchool = function () {
        var params = {
            query: S($scope.autocompleteSchool.text).latinise().s,
            type: 'university'
        }
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/places',
            params: params
        }).then(function successCallback(response) {
            $scope.ketquasSchool = response.data.results;
            console.log($scope.ketquasSchool);
            $('#list-school').show();
        })
    };

    $scope.setSelectedSchool = function (selected) {
        $scope.school = selected;
        console.log($scope.school)
        $scope.autocompleteSchool.text = $scope.school.name
        $rootScope.userData.school = $scope.school.name
        $('#list-school').hide();

    };


    $scope.eraseSchool = function () {
        $scope.autocompleteSchool.text = null;
        $('#list-school').hide();
    }


//address
    $scope.autocompleteAddress = {text: ''};
    $scope.ketquasAddress = [];
    $scope.searchAddress = function () {
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + S($scope.autocompleteAddress.text).latinise().s + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
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
        $rootScope.userData.address = selected.formatted_address;
        $rootScope.userData.location = selected.geometry.location;

        console.log(selected);
        $('#list-add').hide();
        //$rootScope.userData.address = selected.formatted_address;
        //$rootScope.userData.location = selected.geometry.location;

    };

    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    }
    $scope.deleteExp = function (id) {
        delete  $scope.userData.experience[id]
    }
    $scope.addMoreExp = function () {
        $scope.tempoExperience = {}
    }

    $scope.saveJob = function () {
        var experienceRef = firebase.database().ref('profile/' + $rootScope.userId + '/experience');
        var newkey = experienceRef.push().key;
        $scope.tempoExperience.id = newkey
        if (!$scope.userData.experience) {
            $scope.userData.experience = {}
        }
        $scope.userData.experience[newkey] = $scope.tempoExperience
        delete $scope.tempoExperience
    }

//upload more image
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = {};
    $scope.deleteImage = function (images) {
        console.log('clicked', images)
        $scope.userData.photo.splice(images, 1);
    }

    $scope.upload = function (files) {
        $scope.uploadPhoto = true
        $scope.startSpin('photo');

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                console.log(i)
                var file = files[i];
                console.log(file)

                if (!file.$error) {

                    var metadata = {
                        'contentType': file.type
                    };
                    var storageRef = firebase.storage().ref();
                    var newkey = firebase.database().ref('profile/' + $rootScope.userId + '/photo').push().key;
                    var uploadTask = storageRef.child('images/' + newkey).put(file, metadata);

                    uploadTask.then(function (snapshot) {
                        if ($scope.uploadPhoto == true) {
                            var downloadPhoto = snapshot.downloadURL;
                            console.log(downloadPhoto);

                            $rootScope.userData.photo.push(downloadPhoto);
                            console.log($rootScope.userData.photo)
                        }
                    });

                    uploadTask.on('state_changed', function (snapshot) {
                        $timeout(function () {
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                $scope.log[i] = progress + '%';
                                console.log('Upload is ' + progress + '% done');
                            }
                        );
                        // Observe state change events such as progress, pause, and resume
                    }, function (error) {
                        // Handle unsuccessful uploads
                    }, function () {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...


                        $scope.stopSpin('photo')
                    })

                }
            }
        }
    };


    $scope.submit = function () {
        console.log('$rootScope.userData', $rootScope.userData)
        if ($rootScope.userData.address && $rootScope.userData.name && $rootScope.userData.birth) {
            $rootScope.userData.name = $rootScope.service.upperName($rootScope.userData.name)
            $rootScope.userData.birth = $rootScope.service.convertDate($rootScope.userData.birth);
            console.log($rootScope.userData);

            $timeout(function () {
                console.log($scope.multiple)
                if ($scope.multiple.industry.length >= 0) {
                    $rootScope.userData.industry = {};
                    angular.forEach($scope.multiple.industry, function (card) {
                        $rootScope.userData.industry[card] = true
                    })
                }
                if ($scope.multiple.job.length >= 0) {
                    $rootScope.userData.job = {};
                    angular.forEach($scope.multiple.job, function (card) {
                        $rootScope.userData.job[card] = true
                    })
                }

                if ($scope.multiple.languages.length >= 0) {
                    $rootScope.userData.languages = {};
                    angular.forEach($scope.multiple.languages, function (card) {
                        $rootScope.userData.languages[card] = true
                    })
                }

                console.log($rootScope.userData);

                var profileRef = firebase.database().ref('profile/' + $rootScope.userId);
                profileRef.update($rootScope.userData);


                //init profile
                if ($scope.firsttime) {
                    $rootScope.service.Ana('createProfile');
                } else {
                    $rootScope.service.Ana('updateProfile');
                }
                toastr.success('Cập nhật hồ sơ thành công');
                if ($rootScope.preApply) {
                    $rootScope.service.userLike($rootScope.preApply.card, 0, $rootScope.preApply.jobOffer)
                }

            }, 1000)
        } else {
            console.log($rootScope.userData);
            $scope.error = {}
            for (var i in $rootScope.userData) {
                if ($rootScope.userData[i]) {

                } else {
                    $scope.error[i] = true;

                    $timeout(function () {
                        console.log($scope.error)

                    })
                }
            }
            toastr.error('Bạn chưa cập nhật đủ thông tin', 'Lỗi');
            $scope.gotoAnchor('name')
        }
    }

    $scope.gotoAnchor = function (x) {
        var newHash = 'anchor' + x;
        if ($location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash('anchor' + x);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };


}

function propsFilter() {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
}