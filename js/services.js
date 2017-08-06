angular.module('starter.services', [])
    .service('myService', function (CacheFactory) {
        var profileCache;
        // Check to make sure the cache doesn't already exist
        if (!CacheFactory.get('profileCache')) {
            profileCache = CacheFactory('profileCache');
        }
    })

    .service('AuthUser', function ($rootScope, $q, toastr, ModalService, $http, CONFIG, $timeout, $state) {
        var messaging = firebase.messaging();
        var db = firebase.database()

        this.user = function () {
            var output = {},
                deferred = $q.defer();

            secondary.auth().onAuthStateChanged(function (user) {
                console.log('Auth')
                if (user) {
                    $rootScope.userId = user.uid;

                    $rootScope.service.JoboApi('initData', {userId: $rootScope.userId}).then(function (res) {
                        console.log(res);
                        var user = res.data;
                        console.log('user', user);
                        $rootScope.userData = user.userData;
                        output = $rootScope.userData;
                        deferred.resolve(output);
                        if (!$rootScope.userData.webToken) {
                            $rootScope.service.saveWebToken();
                        }
                        $rootScope.type = $rootScope.userData.type;
                        if ($rootScope.userData.currentStore) {
                            $rootScope.storeId = $rootScope.userData.currentStore
                        }
                        $rootScope.storeList = user.storeList;
                        $rootScope.storeData = user.storeData;
                        $rootScope.notification = $rootScope.service.ObjectToArray(user.notification)
                        $rootScope.newNoti = $rootScope.service.calNoti($rootScope.notification)
                        $rootScope.reactList = user.reactList;
                        $rootScope.$broadcast('handleBroadcast', $rootScope.userId);

                    })
                    // User is signed in.
                } else {
                    $rootScope.type = 0;

                    output = {type: 0}
                    console.log(output)
                    deferred.resolve(output);
                    // No user is signed in.
                }

            });

            return deferred.promise;
        };

        this.sendVerifyEmail = function (userId) {
            console.log('sendVerifyEmail')
            $rootScope.service.JoboApi('sendverify', {id: userId})
            toastr.success('Đã gửi lại email, hãy kiểm tra hòm mail của bạn')
        }
        this.storeLike = function (card, action, jobOffer) {
            $rootScope.jobOffer = {}

            var selectedJob = {}
            selectedJob[jobOffer] = new Date().getTime()
            if ($rootScope.type == 1) {

                if (!$rootScope.clicked) {
                    $rootScope.clicked = {}
                }
                var output = {},
                    deferred = $q.defer();

                var likedId = card.userId;
                var likeActivity = firebase.database().ref('activity/like/' + $rootScope.storeId + ':' + likedId);

                if (card.act && card.act.type == 2 && card.act.status == 0) {
                    likeActivity.update({
                        matchedAt: new Date().getTime(),
                        status: 1,
                        jobStore: selectedJob
                    });
                    console.log('match');
                    output = {
                        result: 1,
                        userId: card.userId,
                        storeId: $rootScope.storeId
                    };
                    $rootScope.service.Ana('match', {userId: card.userId, job: jobOffer})

                    itsMatch(output.storeId, output.userId)
                } else {
                    if (card.act && card.act.jobUser) {

                    }
                    likeActivity.update({
                        likeAt: new Date().getTime(),
                        type: 1,
                        status: action,
                        jobStore: selectedJob,
                        employerId: $rootScope.userId,
                        storeId: $rootScope.storeId,
                        storeName: $rootScope.storeData.storeName,
                        storeAvatar: $rootScope.storeData.avatar || '',
                        userAvatar: card.avatar || '',
                        userName: card.name,
                        userId: card.userId

                    })
                    toastr.success('Đã gửi lời mời đến cho ' + card.name)
                    $rootScope.clicked[card.userId] = true

                    output = {
                        result: 0,
                        userId: card.userId,
                        storeId: $rootScope.storeId
                    }
                    $rootScope.service.Ana('like', {userId: card.userId, job: jobOffer})

                }

                deferred.resolve(output);
                return deferred.promise;
            } else {
                if ($rootScope.type == 2) {
                    toastr.info('Chỉ có nhà tuyển dụng mới có quyền tuyển ứng viên!')
                } else {
                    toastr.info('Bạn phải đăng nhập để tuyển ứng viên này!')
                }
            }
        };
        this.deg2rad = function (deg) {
            return deg * (Math.PI / 180)
        };
        this.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = $rootScope.service.deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = $rootScope.service.deg2rad(lon2 - lon1);
            var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos($rootScope.service.deg2rad(lat1)) * Math.cos($rootScope.service.deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var x = R * c; // Distance in km
            var n = parseFloat(x);
            x = Math.round(n * 10) / 10;
            return x;
        };
        this.userLike = function (card, action, jobOffer) {
            $rootScope.jobOffer = {}

            var selectedJob = {}
            selectedJob[jobOffer] = new Date().getTime()

            if ($rootScope.type == 2) {
                if (!$rootScope.clicked) {
                    $rootScope.clicked = {}
                }
                var output = {},
                    deferred = $q.defer();

                var likedId = card.storeId;
                var likeActivity = firebase.database().ref('activity/like/' + likedId + ':' + $rootScope.userId);
                likeActivity.on('value', function (snap) {
                    card.act = snap.val()
                    console.log(card.act)
                })

                if (card.act && card.act.type == 1) {
                    likeActivity.update({
                        matchedAt: new Date().getTime(),
                        status: 1,
                        jobUser: selectedJob
                    });
                    output = {
                        result: 1,
                        storeId: card.storeId,
                        userId: $rootScope.userId

                    }
                    itsMatch(output.storeId, output.userId)
                    $rootScope.service.Ana('match', {storeId: card.storeId, job: jobOffer})
                } else {
                    if (card.act && card.act.jobUser) {
                        selectedJob = Object.assign(selectedJob, card.act.jobUser)
                    }
                    console.log($rootScope.userData);
                    var storeLocation = card.location;
                    var distance = $rootScope.service.getDistanceFromLatLonInKm($rootScope.userData.location.lat, $rootScope.userData.location.lng, storeLocation.lat, storeLocation.lng);
                    console.log(distance + 'km');
                    if ($rootScope.userData.avatar && $rootScope.userData.name) {
                        if (distance <= 50) {
                            likeActivity.update({
                                likeAt: new Date().getTime(),
                                type: 2,
                                status: action,
                                jobUser: selectedJob,
                                employerId: card.createdBy,
                                storeId: likedId,
                                storeName: card.storeName,
                                storeAvatar: card.avatar || "",
                                userAvatar: $rootScope.userData.avatar || "",
                                userName: $rootScope.userData.name,
                                userId: $rootScope.userId
                            });
                            output = {
                                result: 0,
                                storeId: likedId,
                                userId: $rootScope.userId
                            };
                            $rootScope.clicked[card.storeId] = true;
                            toastr.success('Bạn đã ứng tuyển vào ' + card.storeName);
                            $rootScope.service.Ana('like', {storeId: card.storeId, job: jobOffer})
                        } else {
                            $rootScope.service.Ana('like-error', {storeId: card.storeId, job: jobOffer});
                            toastr.error('Bạn ở cách nhà tuyển dụng này ' + distance + ' km', 'Bạn ở quá xa nhà tuyển dụng, không thể apply');
                        }
                    } else {
                        $rootScope.service.Ana('like-error', {storeId: card.storeId, job: jobOffer});
                        toastr.error('Bạn cần cập nhật ảnh đại diện và tên để ứng tuyển');
                        $state.go('profile')
                    }
                }
                deferred.resolve(output);
                return deferred.promise;
            } else {
                if ($rootScope.type == 1) {
                    toastr.info('Chỉ có ứng viên mới có thể ứng tuyển vào vị trí này!')
                } else {
                    $state.go('signup', {id: 2, apply: card.storeId, job: jobOffer})
                }
            }

        }

        this.itsMatch = function (storeId, userId) {
            ModalService.showModal({
                templateUrl: 'templates/modals/match.html',
                controller: 'ModalMatchCtrl',
                inputs: {
                    storeId: storeId,
                    userId: userId
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {

                });
            });
        }
        this.checkPermit = function checkPermit(storeId, userId) {
            var check = '';
            var defer = $q.defer()
            var reactRef = firebase.database().ref('activity/like/' + storeId + ":" + userId)
            reactRef.once('value', function (snap) {
                var card = snap.val()
                if (card) {
                    //có từng react
                    if (card.status == 1) {
                        //đã match
                        check = 'match'
                    } else if (card.status == 0 && card.type == 2) {
                        // user like store
                        check = 'uls'

                    } else if (card.status == 0 && card.type == 1) {
                        // store like user
                        check = 'slu'

                    } else if (card.status == -1 && card.type == 2) {

                        // user dislike store
                        check = 'sdu'

                    } else if (card.status == -1 && card.type == 1) {
                        // store dislike user
                        check = 'uds'

                    }

                } else {
                    //chưa từng react
                    check = 'yet';

                }
                defer.resolve(check)
            })
            return defer.promise
        }


        this.timeAgo = function (timestamp) {
            var time;
            timestamp = new Date(timestamp).getTime()
            var now = new Date().getTime()
            var a = now - timestamp
            if (a > 0) {
                var minute = Math.round(a / 60000);
                if (minute < 60) {
                    time = minute + " phút trước"
                } else {
                    var hour = Math.round(minute / 60);
                    if (hour < 24) {
                        time = hour + " giờ trước"
                    } else {
                        var day = Math.round(hour / 24);
                        if (day < 30) {
                            time = day + " ngày trước"
                        } else {
                            var month = Math.round(day / 30);
                            if (month < 12) {
                                time = month + " tháng trước"
                            } else {
                                var year = Math.round(month / 12);
                                time = year + " năm trước"
                            }
                        }
                    }
                }

                return time;
            }
            if (a < 0) {
                a = Math.abs(a);

                var minute = Math.round(a / 60000);
                if (minute < 60) {
                    time = "còn " + minute + " phút"
                } else {
                    var hour = Math.round(minute / 60);
                    if (hour < 24) {
                        time = "còn " + hour + " giờ"
                    } else {
                        var day = Math.round(hour / 24);
                        if (day < 30) {
                            time = "còn " + day + " ngày"
                        } else {
                            var month = Math.round(day / 30);
                            if (month < 12) {
                                time = "còn " + month + " tháng"
                            } else {
                                var year = Math.round(month / 12);
                                time = "còn " + year + " năm "
                            }
                        }
                    }
                }

                return time;

            }

        }

        this.Ana = function (action, data) {
            if (!data) {
                data = {}
            }
            var anany = $rootScope.userId
            if (!$rootScope.userId) {
                anany = window.localStorage.getItem('anany')
                if (!anany) {
                    anany = Math.round(100000000000000 * Math.random())
                    window.localStorage.setItem('anany', anany)
                }
            }

            data.agent = $rootScope.checkAgent.platform + ':' + $rootScope.checkAgent.device;
            // var logRef = firebase.database().ref('log')
            // var actRef = firebase.database().ref('act')

            var analyticKey = Math.round(100000000000000 * Math.random());

            var obj = {
                userId: anany,
                action: action,
                createdAt: new Date().getTime(),
                data: data,
                id: analyticKey
            };

            // logRef.child(analyticKey).set(obj)
            $rootScope.service.JoboApi('update/log', {
                userId: anany,
                key: analyticKey,
                log: obj
            });
            console.log("Jobo Analytics", obj);

            if (action == 'createProfile'
                || action == 'createStore'
                || action == 'updateProfile'
                || action == 'updateStore'
                || action == 'viewStore'
                || action == 'viewProfile'
                || action == 'like'
                || action == 'match'
                || action == 'sendMessage'
                || action == 'setInterview'
                || action == 'serviceWorker'
                || action == 'requestPermission'

            ) {
                // actRef.child(analyticKey).set(obj)
                /*$rootScope.service.JoboApi('update/act',{
                 useId: anany,
                 key: analyticKey,
                 act: obj
                 });*/
                console.log("Jobo act", obj);
            }
        }

        this.shortAddress = function (fullAddress) {
            if (fullAddress) {
                var mixAddress = fullAddress.split(",")
                if(mixAddress.length == 1){
                    return fullAddress
                } else {
                    var address = mixAddress[0] + ', ' + mixAddress[1]
                    return address
                }

            }
        };

        this.nextLine = function (text) {
            if (text) {
                return text.split(/\r\n|\r|\n/g);
            }

        }
        this.upperName = function (fullname) {
            var arrayName = fullname.toLowerCase().split(" ")
            var Name = "";
            for (var i in arrayName) {
                var N = arrayName[i].charAt(0).toUpperCase()
                var n = arrayName[i].replace(arrayName[i].charAt(0), N);
                if (!Name) {
                    Name = n

                } else {
                    Name = Name + " " + n
                }
            }

            return Name
        }
        this.calReview = function (reviewData) {
            if (reviewData) {
                var totalReview = Object.keys(reviewData).length
                var total = 0
                for (var i in reviewData) {
                    var card = reviewData[i];
                    total += card.rate;
                }
                var average = total / totalReview;
                var avergageRounded = Math.round(average * 10) / 10;
                var obj = {}
                for (i = 0; i < avergageRounded; i++) {
                    obj[i] = true
                }
                var output = {
                    average: avergageRounded,
                    total: totalReview,
                    obj: obj


                }
                return output
            }

        }
        this.JoboApi = function (url, params) {
            var defer = $q.defer();

            axios.get(CONFIG.APIURL + '/' + url, {
                headers:{'Content-Type':'application/json'},
                params: params
            })
                .then(function (response) {
                    console.log(response);
                    defer.resolve(response)
                })
                .catch(function (error) {
                    console.log(error);
                    defer.resolve(error)

                });

            return defer.promise

        }
        this.convertDate = function (array) {

            return new Date(array.year, array.month, array.day).getTime()
        }
        this.convertDateArray = function (date) {
            var dateAr = new Date(date)

            return {
                day: dateAr.getDate(),
                month: dateAr.getMonth(),
                year: dateAr.getFullYear()
            }

        }

        this.getfirst = function (obj) {
            if (obj) {
                return Object.keys(obj)[0]

            } else {
                return ''
            }
        }
        this.getStringJob = function (listJob) {
            var stringJob = '';
            var k = 0;
            for (var i in listJob) {
                if (i != 'other') {
                    stringJob += $rootScope.Lang[i] + ' (' + $rootScope.service.timeAgo(listJob[i]) + '), ';
                    k++
                }
            }
            var lengaf = stringJob.length - 2
            return stringJob.substr(0, lengaf);

        }
        this.saveWebToken = function () {

            getToken();
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                    navigator.serviceWorker.register('/firebase-messaging-sw.js').then(function (registration) {
                        // Registration was successful
                        console.log('ServiceWorker registration successful with scope: ', registration);
                        $rootScope.service.Ana('serviceWorker', {registration: 'ServiceWorker registration successful with scope: ' + registration})

                    }).catch(function (err) {
                        // registration failed :(
                        $rootScope.service.Ana('serviceWorker', {registration: 'ServiceWorker registration failed: ' + err})

                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }
        }
        function getToken() {
            messaging.getToken()
                .then(function (currentToken) {
                    if (currentToken) {
                        if ($rootScope.userId) {
                            $rootScope.service.JoboApi('update/user', {
                                userId: $rootScope.userId,
                                user: JSON.stringify({webToken: currentToken})
                            });
                            // firebase.database().ref('user/' + $rootScope.userId).update({webToken: currentToken})
                            $rootScope.service.Ana('getToken', {token: currentToken});
                            console.log('save token')
                        }

                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');
                        requestPermission();
                        // Show permission UI.
                    }
                })
                .catch(function (err) {
                    console.log('An error occurred while retrieving token. ', err);
                })
        }

        function requestPermission() {
            messaging.requestPermission()
                .then(function () {
                    console.log('Notification permission granted.');
                    // TODO(developer): Retrieve an Instance ID token for use with FCM.
                    // ...
                    getToken();
                    // Get Instance ID token. Initially this makes a network call, once retrieved
                    // subsequent calls to getToken will return from cache.


                })
                .catch(function (err) {
                    $rootScope.service.Ana('requestPermission', {err: err})

                    console.log('Unable to get permission to notify.', err);
                });


        }

        /*this.loadJob = function (storeData) {
         var output = [],
         deferred = $q.defer();

         for (var i in storeData.job) {
         firebase.database().ref('job/' + storeData.storeId + ":" + i).once('value', function (snap) {
         if (snap.val()) {
         var job = snap.val()

         output.push(job)
         deferred.resolve(output);

         }
         })
         }

         return deferred.promise;
         }*/
        this.readNoti = function (id) {
            if ($rootScope.type == 1) {
                db.ref('notification/' + $rootScope.userId).child(id).update({update: new Date().getTime()})
            } else if ($rootScope.type == 2) {
                db.ref('notification/' + $rootScope.userId).child(id).update({update: new Date().getTime()})
            }
        }
        this.calNoti = function (notification) {
            var noti = {}
            angular.forEach(notification, function (card) {
                if (!card.update) {
                    if(!noti[card.storeId]){
                        noti[card.storeId] = 0
                    } else {
                        noti[card.storeId]++
                    }
                }
            })
            return noti
        }
        $rootScope.pressArrow = function ($event, textmessage) {
            console.log($event.keyCode);
            if ($event.keyCode == 13 && textmessage && textmessage.length != 0) {
                $rootScope.sendMessage(textmessage)

            }
        }
        this.chatToUser = function (chatedId) {
            $rootScope.aside = true
            $rootScope.chat = true
            var likeAct, messageRef, newPostRef
            if (chatedId) {
                $rootScope.chatUser = {chatedId: chatedId}
                likeAct = firebase.database().ref('activity/like/' + $rootScope.storeId + ':' + chatedId);
                messageRef = firebase.database().ref('chat/' + $rootScope.storeId + ':' + chatedId);

                //có user cụ thể
                loadMessage($rootScope.storeId, chatedId);
            }

            // Get list


            $rootScope.$watch('interviewDate', function (newValue) {
                console.log('interviewDate', newValue)
            })

            $('#demo').daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "timePicker": true,
                "startDate": "03/16/2017",
                "endDate": "03/22/2017",
            }, function (start, end, label) {
                console.log("New date range selected: '" + start.format() + ' to ' + end.format('YYYY-MM-DD') + 'predefined range: ' + label);
                var date = new Date(start.format()).getTime()
                console.log(date)
                setInterview(date)
            });


            function setInterview(timeInterview) {
                console.log(timeInterview);
                // var timeInterviewRef = firebase.database().ref('activity/' + $rootScope.storeId + ":" + chatedId)
                // timeInterviewRef.update({interview: new Date().getTime()});
                // var newPostRef = firebase.database().ref().child('activity/interview/' + $rootScope.storeId + ":" + chatedId)

                var message = {
                    createdAt: new Date().getTime(),
                    interview: timeInterview,
                    place: $rootScope.storeData.address,
                    userId: chatedId,
                    storeId: $rootScope.storeId,
                    status: 0,
                    type: 1
                };
                // newPostRef.update(message);
                $rootScope.service.JoboApi('update/activity/interview', {
                    userId: chatedId,
                    storeId: $rootScope.storeId,
                    interview: message
                });

            }

            function loadMessage(storeId, chatedId) {
                $rootScope.service.JoboApi('on/profile', {
                    userId: chatedId
                }).then(function (data) {
                    $timeout(function () {
                        $rootScope.chatUser.data = data.data;
                        console.log('$rootScope.chatUser.data', $rootScope.chatUser.data)

                        likeAct.on('value', function (snap) {
                            $timeout(function () {
                                $rootScope.chatUser.act = snap.val();
                                console.log('$rootScope.profileData.act', $rootScope.chatUser.act)
                                if ($rootScope.chatUser.act && $rootScope.chatUser.act.showContact) {
                                    $rootScope.service.JoboApi('on/user', {userId: chatedId}).then(function (data) {
                                        $timeout(function () {
                                            if (!$rootScope.contact) {
                                                $rootScope.contact = {}
                                            }
                                            $rootScope.contact[chatedId] = data.data
                                        })
                                    });

                                }
                            })
                        });
                    })
                });


                messageRef.on('value', function (snap) {
                    $timeout(function () {
                        $rootScope.chatUser.messages = snap.val();
                        console.log($rootScope.chatUser.messages);
                    })
                })


                newPostRef.on('value', function (snap) {
                    $timeout(function () {
                        $rootScope.chatUser.interview = snap.val();

                    })
                })
            }

            $rootScope.sendMessage = function (textmessage) {
                var newPostKey = firebase.database().ref().child('chat/' + $rootScope.storeId + ":" + chatedId).push().key;
                var newPostRef = firebase.database().ref().child('chat/' + $rootScope.storeId + ":" + chatedId + '/' + newPostKey)
                var message = {
                    key: newPostKey,
                    createdAt: new Date().getTime(),
                    text: textmessage,
                    sender: $rootScope.storeId,
                    status: 0,
                    type: 0
                };
                $rootScope.input.message = '';
                if ($rootScope.chatUser.act && $rootScope.chatUser.act.showContact) {
                    newPostRef.update(message);
                    $rootScope.service.Ana('sendMessage', {
                        type: 0,
                        sender: $rootScope.storeId,
                        to: chatedId,
                        text: message.text
                    })
                } else {
                    $rootScope.service.showphone()
                }

            };

            $rootScope.input = {
                message: localStorage['userMessage-' + chatedId] || ''
            };

            var messageCheckTimer;

            var footerBar; // gets set in $ionicView.enter
            var scroller;
            var txtInput; // ^^^

        }
        this.closeChat = function () {
            $rootScope.chat = false
        }

        this.chatToStore = function (chatedId) {
            $rootScope.aside = true
            $rootScope.chat = true

            if (chatedId) {
                $rootScope.chatUser = {chatedId: chatedId}
                //có user cụ thể
                loadMessage(chatedId, $rootScope.userId);
            }

            // Get list

            $('#demo').daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "timePicker": true,
                "startDate": "03/16/2017",
                "endDate": "03/22/2017",
            }, function (start, end, label) {
                console.log("New date range selected: '" + start.format() + ' to ' + end.format('YYYY-MM-DD') + 'predefined range: ' + label);
                var date = new Date(start.format()).getTime()
                console.log(date)
                setInterview(date)
            });

            function setInterview(timeInterview) {
                console.log(timeInterview);
                // var timeInterviewRef = firebase.database().ref('activity/' + $rootScope.storeId + ":" + chatedId)
                // timeInterviewRef.update({interview: new Date().getTime()});
                // var newPostRef = firebase.database().ref().child('activity/interview/' + $rootScope.storeId + ":" + chatedId)

                var message = {
                    createdAt: new Date().getTime(),
                    interview: timeInterview,
                    place: $rootScope.storeData.address,
                    userId: chatedId,
                    storeId: $rootScope.storeId,
                    status: 0,
                    type: 1
                };
                $rootScope.service.JoboApi('update/activity/interview', {
                    userId: chatedId,
                    storeId: $rootScope.storeId,
                    interview: message
                });
                // newPostRef.update(message);

            }

            function loadMessage(storeId, chatedId) {
                $rootScope.service.JoboApi('on/store', {
                    userId: $rootScope.userId,
                    storeId: storeId
                }).then(function (data) {
                    $rootScope.chatUser.data = data.data;
                    console.log('$rootScope.chatUser.data', $rootScope.chatUser.data)

                    var likeAct = firebase.database().ref('activity/like/' + storeId + ':' + chatedId);
                    likeAct.on('value', function (snap) {
                        $timeout(function () {
                            $rootScope.chatUser.act = snap.val();
                            console.log('$rootScope.profileData.act', $rootScope.chatUser.act)
                        })
                    });
                });


                var messageRef = firebase.database().ref('chat/' + storeId + ':' + chatedId);
                messageRef.on('value', function (snap) {
                    $timeout(function () {
                        $rootScope.chatUser.messages = snap.val();
                        console.log($rootScope.chatUser.messages);
                    })
                })


                var newPostRef = firebase.database().ref().child('activity/interview/' + storeId + ":" + chatedId)
                newPostRef.on('value', function (snap) {
                    $timeout(function () {
                        $rootScope.chatUser.interview = snap.val();

                    })
                })
            }

            $rootScope.sendMessage = function (textmessage) {
                var newPostKey = firebase.database().ref().child('chat/' + chatedId + ":" + $rootScope.userId).push().key;
                var newPostRef = firebase.database().ref().child('chat/' + chatedId + ":" + $rootScope.userId + '/' + newPostKey)
                var message = {
                    key: newPostKey,
                    createdAt: new Date().getTime(),
                    text: textmessage,
                    sender: $rootScope.userId,
                    status: 0,
                    type: 0
                };


                // if you do a web service call this will be needed as well as before the viewScroll calls
                // you can't see the effect of this in the browser it needs to be used on a real device
                // for some reason the one time blur event is not firing in the browser but does on devices

                //MockService.sendMessage(message).then(function(data) {
                $rootScope.input.message = '';
                if ($rootScope.chatUser.act && $rootScope.chatUser.act.showContact) {
                    newPostRef.update(message);
                    $rootScope.service.Ana('sendMessage', {
                        type: 1,
                        sender: $rootScope.userId,
                        to: chatedId,
                        text: message.text
                    })

                } else {
                    $rootScope.service.showphone()
                }
            };


            $rootScope.mustPermit = function () {
                ModalService.showModal({
                    templateUrl: 'templates/modals/permit.html',
                    controller: 'ModalPermitCtrl'
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        console.log(result)

                    });
                });
            }


            $rootScope.input = {
                message: localStorage['userMessage-' + chatedId] || ''
            };

            var messageCheckTimer;

            var footerBar; // gets set in $ionicView.enter
            var scroller;
            var txtInput; // ^^^

        }

        this.showphone = function (chatedId) {
            $rootScope.service.Ana('showPhone', {chatedId: chatedId})
            ModalService.showModal({
                templateUrl: 'templates/modals/permit.html',
                controller: 'ModalPermitCtrl'
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    console.log(result)
                    if (result == 1) {
                        $rootScope.service.Ana('confirmShowPhone', {chatedId: chatedId})
                        if ($rootScope.userData.credit >= 30) {
                            var likeAct = firebase.database().ref('activity/like/' + $rootScope.storeId + ':' + chatedId);
                            likeAct.update({
                                showContact: new Date().getTime()
                            })
                            $rootScope.service.JoboApi('update/user', {
                                userId: $rootScope.userId,
                                user: {credit: $rootScope.userData.credit - 30}
                            });
                            if ($rootScope.chatUser.act && $rootScope.chatUser.act.showContact) {
                                $rootScope.service.JoboApi('on/user', {userId: chatedId}).then(function (data) {
                                    $timeout(function () {
                                        if (!$rootScope.contact) {
                                            $rootScope.contact = {}
                                        }
                                        $rootScope.contact[chatedId] = data.data
                                    })
                                });

                            }

                        } else {
                            $rootScope.service.Ana('confirmShowPhone', {
                                chatedId: chatedId,
                                result: 'not enough'
                            })
                            toastr.info('Bạn không đủ credit để mở khóa liên hệ ứng viên, hãy nạp thêm')
                        }


                    }
                });
            });
        }


        this.getFreeCredit = function () {

            $rootScope.service.JoboApi('update/user', {
                userId: $rootScope.userId,
                user: {
                    firstFreeCredit: true,
                    credit: 500
                }
            });
            /*var userRef = firebase.database().ref('user/' + $rootScope.userId)
             userRef.update({
             firstFreeCredit: true,
             credit: 500
             })*/
            toastr.success('Bạn đã nhận 500,000đ credit!')
        }
        this.changeEmail = function (email) {
            var user = secondary.auth().currentUser;

            user.updateEmail(email).then(function () {
                // Update successful.
                $rootScope.service.JoboApi('update/user', {
                    userId: user.uid,
                    user: {
                        email: email
                    }
                });
                /*var userRef = firebase.database().ref('user/' + user.uid)
                 userRef.update({email: email})*/
                toastr.success('Cập nhật email thành công, kiểm tra hòm mail để xác thực', 'Thay đổi email thành công')

                sendVerifyEmail()
            }, function (error) {
                // An error happened.
                toastr.error(error, 'Lỗi')
                console.log(error)
                if (error.code === "auth/requires-recent-login") {
                    $state.go('intro')
                }
            });
        };

        this.changePassword = function (password) {
            var user = secondary.auth().currentUser;
            if (password.password == password.password2) {
                user.updatePassword(password.password).then(function () {
                    toastr.success('Bạn đã đổi mật khẩu thành công')

                    // Update successful.
                }, function (error) {
                    toastr.error(error, 'Lỗi')
                    console.log(error)
                    if (error.code === "auth/requires-recent-login") {
                        $state.go('intro')
                    }
                    // An error happened.
                });
            } else {
                toastr.error('Mật khẩu không trùng')
            }
        }
        this.logout = function () {
            secondary.auth().signOut().then(function () {
                // Sign-out successful.
                toastr.info("Bạn đã đăng xuất thành công!");
                $rootScope.type = 0
                delete  $rootScope.userId;
                delete  $rootScope.userData;
                delete  $rootScope.storeData;
                delete  $rootScope.jobData;

                $state.go("app.dash");

            }, function (error) {
                // An error happened.
                console.log(error);
            });
        }
        this.latinese = function (str) {
            if (str) {
                var defaultDiacriticsRemovalMap = [
                    {
                        'base': 'A',
                        'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
                    },
                    {'base': 'AA', 'letters': /[\uA732]/g},
                    {'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g},
                    {'base': 'AO', 'letters': /[\uA734]/g},
                    {'base': 'AU', 'letters': /[\uA736]/g},
                    {'base': 'AV', 'letters': /[\uA738\uA73A]/g},
                    {'base': 'AY', 'letters': /[\uA73C]/g},
                    {'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
                    {
                        'base': 'C',
                        'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
                    },
                    {
                        'base': 'D',
                        'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
                    },
                    {'base': 'DZ', 'letters': /[\u01F1\u01C4]/g},
                    {'base': 'Dz', 'letters': /[\u01F2\u01C5]/g},
                    {
                        'base': 'E',
                        'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
                    },
                    {'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
                    {
                        'base': 'G',
                        'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
                    },
                    {
                        'base': 'H',
                        'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
                    },
                    {
                        'base': 'I',
                        'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
                    },
                    {'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g},
                    {
                        'base': 'K',
                        'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
                    },
                    {
                        'base': 'L',
                        'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
                    },
                    {'base': 'LJ', 'letters': /[\u01C7]/g},
                    {'base': 'Lj', 'letters': /[\u01C8]/g},
                    {'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
                    {
                        'base': 'N',
                        'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
                    },
                    {'base': 'NJ', 'letters': /[\u01CA]/g},
                    {'base': 'Nj', 'letters': /[\u01CB]/g},
                    {
                        'base': 'O',
                        'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
                    },
                    {'base': 'OI', 'letters': /[\u01A2]/g},
                    {'base': 'OO', 'letters': /[\uA74E]/g},
                    {'base': 'OU', 'letters': /[\u0222]/g},
                    {'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
                    {'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
                    {
                        'base': 'R',
                        'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
                    },
                    {
                        'base': 'S',
                        'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
                    },
                    {
                        'base': 'T',
                        'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
                    },
                    {'base': 'TZ', 'letters': /[\uA728]/g},
                    {
                        'base': 'U',
                        'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
                    },
                    {'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
                    {'base': 'VY', 'letters': /[\uA760]/g},
                    {'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
                    {'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
                    {
                        'base': 'Y',
                        'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
                    },
                    {
                        'base': 'Z',
                        'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
                    },
                    {
                        'base': 'a',
                        'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
                    },
                    {'base': 'aa', 'letters': /[\uA733]/g},
                    {'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g},
                    {'base': 'ao', 'letters': /[\uA735]/g},
                    {'base': 'au', 'letters': /[\uA737]/g},
                    {'base': 'av', 'letters': /[\uA739\uA73B]/g},
                    {'base': 'ay', 'letters': /[\uA73D]/g},
                    {'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
                    {
                        'base': 'c',
                        'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
                    },
                    {
                        'base': 'd',
                        'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
                    },
                    {'base': 'dz', 'letters': /[\u01F3\u01C6]/g},
                    {
                        'base': 'e',
                        'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
                    },
                    {'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
                    {
                        'base': 'g',
                        'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
                    },
                    {
                        'base': 'h',
                        'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
                    },
                    {'base': 'hv', 'letters': /[\u0195]/g},
                    {
                        'base': 'i',
                        'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
                    },
                    {'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
                    {
                        'base': 'k',
                        'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
                    },
                    {
                        'base': 'l',
                        'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
                    },
                    {'base': 'lj', 'letters': /[\u01C9]/g},
                    {'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
                    {
                        'base': 'n',
                        'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
                    },
                    {'base': 'nj', 'letters': /[\u01CC]/g},
                    {
                        'base': 'o',
                        'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
                    },
                    {'base': 'oi', 'letters': /[\u01A3]/g},
                    {'base': 'ou', 'letters': /[\u0223]/g},
                    {'base': 'oo', 'letters': /[\uA74F]/g},
                    {'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
                    {'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
                    {
                        'base': 'r',
                        'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
                    },
                    {
                        'base': 's',
                        'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
                    },
                    {
                        'base': 't',
                        'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
                    },
                    {'base': 'tz', 'letters': /[\uA729]/g},
                    {
                        'base': 'u',
                        'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
                    },
                    {'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
                    {'base': 'vy', 'letters': /[\uA761]/g},
                    {'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
                    {'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
                    {
                        'base': 'y',
                        'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
                    },
                    {
                        'base': 'z',
                        'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
                    }
                ];

                for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                    str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
                }
                var split = str.split(' ')
                var n = split.length
                var text = ''
                for (var i in split) {
                    text = text + split[i]
                }
                return text;
            } else {
                return ''
            }

        }
        this.createKey = function (fullname) {
            var keyname = $rootScope.service.latinese(fullname)
            db.ref('keyList').child(keyname).once('value', function (a) {
                if(a.val()){

                    var newname = keyname + Math.round(1000 * Math.random())
                    var obj = {}
                    obj[newname] = true
                    db.ref('keyList').update(obj,function (suc) {
                        console.log('done',suc)
                        return newname
                    })
                } else {
                    var obj = {}
                    obj[keyname] = true
                    db.ref('keyList').update(obj,function (suc) {
                        console.log('done',suc)
                        return keyname
                    })
                }
            },function (err) {
                var keyname = Math.round(10000 * Math.random())
                return keyname
            })
        }
        this.ObjectToArray = function (Object) {
            var array = []
            for (var i in Object) {
                Object[i].id = i
                array.push(Object[i])
            }
            return array
        }
        this.loadLang = function (lang) {
            firebase.database().ref('tran/' + lang).once('value', function (snap) {
                $rootScope.Lang = snap.val()
                console.log($rootScope.Lang)

            }, function (err) {
                console.log(err)
            });
        }
        this.getRefer = function (str) {
            var res
            if (str) {
                var n = str.search("&");
                var m = str.search("ref");
                var k = m + 4
                if (n == -1) {
                    res = str.substr(k, str.length - k);
                } else {
                    res = str.substr(k, n - k);
                }
                return res;
            }
        };
        this.increasedBy = function (type) {
            $rootScope.numberDisplay[type] = $rootScope.reactList[type].length
        };

        this.increasedBy2 = function (type) {
            $rootScope.numberDisplay2[type] = $rootScope.JobCard[type].length
        };

        this.searchProfile = function (textfull) {
            $rootScope.searchResults = []
            var text = S(textfull).latinise().s
            var URL = $rootScope.CONFIG.APIURL + '/query?q=' + text;

            $http({
                method: 'GET',
                url: URL
            }).then(function successCallback(response) {
                var i = 0;
                for (var j = 0; j < response.data.store.length; j++) {
                    $rootScope.searchResults[i] = response.data.store[j];
                    i++;
                }
                for (var j = 0; j < response.data.profile.length; j++) {
                    $rootScope.searchResults[i] = response.data.profile[j];
                    i++;
                }
                console.log($rootScope.searchResults);
            })

        };

    })
    .service('ngCopy', ['$window', function ($window) {
        var body = angular.element($window.document.body);
        var textarea = angular.element('<textarea/>');
        textarea.css({
            position: 'fixed',
            opacity: '0'
        });

        return function (toCopy) {
            textarea.val(toCopy);
            body.append(textarea);
            textarea[0].select();

            try {
                var successful = document.execCommand('copy');
                if (!successful) throw successful;
            } catch (err) {
                window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
            }

            textarea.remove();
        }
    }])


app.filter('myLimitTo', [function () {
    return function (obj, limit) {
        var keys = Object.keys(obj);
        if (keys.length < 1) {
            return [];
        }

        var ret = new Object,
            count = 0;
        angular.forEach(keys, function (key, arrayIndex) {
            if (count >= limit) {
                return false;
            }
            ret[key] = obj[key];
            count++;
        });
        return ret;
    };
}]);

app.factory('debounce', function ($timeout) {
    return function (callback, interval) {
        var timeout = null;
        return function () {
            $timeout.cancel(timeout);
            var args = arguments;
            timeout = $timeout(function () {
                callback.apply(this, args);
            }, interval);
        };
    };
});


