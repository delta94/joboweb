angular
    .module('app')
    .controller('joblistCtrl', joblistCtrl)

function joblistCtrl($sce) {
    var controller = this;
    controller.API = null;

    controller.onPlayerReady = function (API) {
        controller.API = API;
    };

    var data = false;

    if (!data) {
        console.log('data', data)
    } else {
        console.log('flase', data)
    }
    controller.videos = [
        {
            sources: [
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                    type: "video/mp4"
                },
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                    type: "video/webm"
                },
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                    type: "video/ogg"
                }
            ]
        },
        {
            sources: [
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"),
                    type: "video/mp4"
                },
                {
                    src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"),
                    type: "video/ogg"
                }
            ]
        }
    ];

    controller.config = {
        autoHide: false,
        autoHideTime: 3000,
        autoPlay: false,
        sources: controller.videos[0].sources,
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        plugins: {
            poster: "http://www.videogular.com/assets/images/videogular.png"
        }
    };

    controller.setVideo = function (index) {
        controller.API.stop();
        controller.config.sources = controller.videos[index].sources;
    };

    var db = firebase.database()

    var font = "'HelveticaNeue-Light','Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;"
    var static = {
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
    // var sendingStaticRef = db.ref('store')
    // sendingStaticRef.on('child_added', function (snap) {
    //     var key = snap.key
    //
    //     var data = snap.val()
    //     if(!data.static){
    //         sendingStaticRef.child(key).update({static:static})
    //         console.log('done')
    //     }
    //
    // })

//
//     var db = firebase.database()
// // Database Ref
//     var sendingStaticRef = db.ref('sendingStatic')
//     sendingStaticRef.once('value',function (snap) {
//         var date = new Date().getTime()
//
//         var data = snap.val();
//         for (var i in data){
//             sendingStaticRef.child(i).update({
//                 initStatic: date,
//                 notiNewProfile: date,
//                 notiWelcome: date,
//                 welcomeMail: date,
//             })
//             console.log('done')
//
//         }
//     })


    // var configRef = db.ref('config');
    //
    //
    // var userRef = db.ref('user');
    //
    // var profileRef = db.ref('profile');
    // var storeRef = db.ref('store');
    //
    // var activityRef = db.ref('activity');
    //
    // var ratingRef = db.ref('rating');
    //
    // var chatRef = db.ref('chat');
    //
    // var purchaseRef = db.ref('purchase');
    //
    // var jobRef = db.ref('job');
    //
    // var tokenRef = db.ref('token');
    //
    // var logRef = db.ref('log');
    //
    // var presenceProfile = db.ref('presence/profile')
    // var presenceStore = db.ref('presence/store')
    //
    // var notificationRef = db.ref('notification')
    //
    // var staticRef = db.ref('static')
    //
    //
    // //when new  profile
    // profileRef.on('child_added', function (snap) {
    //     var key = snap.key
    //     var card = snap.val()
    //
    //     //update cloud Data
    //     dataProfile[key] = card
    //     console.log('update cloud Data', dataProfile[key]);
    //     //create component
    //
    //     // static
    //     var static = {
    //         viewed: 0,
    //         liked: 0,
    //         shared: 0,
    //         rated: 0,
    //         rateAverage: 0,
    //         matched: 0,
    //         chated: 0,
    //         like: 0,
    //         share: 0,
    //         rate: 0,
    //         match: 0,
    //         chat: 0,
    //         timeOnline: 0,
    //         login: 1,
    //         profile: countProfilePoint(card)
    //     }
    //
    //     staticRef.child(key).set(static)
    //
    //
    //     // notification inapp
    //     var notiWelcome = {
    //         name: 'Jobo',
    //         avatar: '',
    //         title: 'Chào mừng bạn đến với Jobo',
    //         body: '',
    //         preview: '',
    //         cta: ''
    //     };
    //     notificationRef.child(key).set(notiWelcome);
    //
    //     // send welcome email to new user
    //     sendWelcomeEmail(card.name, card.email)
    //     function sendWelcomeEmail(name, email) {
    //         var title = 'Chào mừng bạn đến với Jobo';
    //         var WelcomeEmail = '<div style="width:100%!important;background-color:#fff;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;font-family:' + font + ';font-weight:300"> <table border="0" cellpadding="0" cellspacing="0" id="m_-5282972956275044657background-table" style="background-color:#fff" width="100%"> <tbody> <tr style="border-collapse:collapse"> <td align="center" style="font-family:' + font + ';font-weight:300;border-collapse:collapse"> <table border="0" cellpadding="0" cellspacing="0" class="m_-5282972956275044657w640" style="margin-top:0;margin-bottom:0;margin-right:10px;margin-left:10px" width="640"> <tbody> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w640" height="20" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640">&nbsp;</td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w640" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640"> <table bgcolor="#4E8EF7" border="0" cellpadding="0" cellspacing="0" class="m_-5282972956275044657w640" id="m_-5282972956275044657top-bar" style="background-color:#ffffff;color:#ffffff" width="640"> <tbody> <tr style="border-collapse:collapse"> <td align="left" cellpadding="5" class="m_-5282972956275044657w580" colspan="3" height="8" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-family:' + font + ';font-weight:300;border-collapse:collapse" valign="middle" width="580"> <div class="m_-5282972956275044657header-lead" style="color:#fff;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;font-size:0px"> {{mail.subtitle}} </div> </td> </tr> </tbody> </table> </td> </tr> <tr style="border-collapse:collapse"> <td align="center" bgcolor="#fff" class="m_-5282972956275044657w640" id="m_-5282972956275044657header" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640"> <div align="center" style="text-align:center"> <h1 class="m_-5282972956275044657title" style="line-height:100%!important;font-size:40px;font-family:' + font + ';font-weight:300;margin-top:10px;margin-bottom:18px"> Chào mừng bạn đến với Jobo</h1> </div> </td> </tr> <tr id="m_-5282972956275044657simple-content-row" style="border-collapse:collapse"> <td bgcolor="#ffffff" class="m_-5282972956275044657w640" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640"> <table align="left" border="0" cellpadding="0" cellspacing="0" class="m_-5282972956275044657w640" width="640"> <tbody> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30"> <p>&nbsp;</p> </td> <td class="m_-5282972956275044657w580" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="580"> <table border="0" cellpadding="0" cellspacing="0" class="m_-5282972956275044657w580" width="580"> <tbody> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w580" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="580"> <div align="left" class="m_-5282972956275044657article-content" style="font-size:16px;line-height:30px;color:#5f6a7d;margin-top:0px;margin-bottom:18px;font-family:' + font + ';font-weight:300"> <p style="margin-bottom:15px">Chào bạn</p> <p style="margin-bottom:15px">Bạn đã tạo hồ sơ thành công trên Jobo, mời bạn click vào link bên dưới để bắt đầu tìm việc</p> <p style="margin-bottom:15px">Ngoài ra, bạn có thể tải app Jobo để sử dụng trên điện thoải tiện lợi hơn và không bỏ lỡ thông báo từ nhà tuyển dụng</p> </div> </td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w580" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="580"> <div style="text-align:center"><a href="https://joboapp.com/go" style="background: #1FBDF1;background: -webkit-linear-gradient(to left, #1FBDF1, #39DFA5); background: linear-gradient(to left, #1FBDF1, #39DFA5);color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;font-weight:bold;line-height:60px;text-align:center;text-decoration:none;width:300px" target="_blank"> Tải ứng dựng</a></div> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" class="m_-5282972956275044657w580" width="580"> <tbody> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w580" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="580"> <p align="left" class="m_-5282972956275044657article-title" style="font-size:18px;line-height:24px;color:#2b3038;font-weight:bold;margin-top:0px;margin-bottom:18px;font-family:' + font + '"> &nbsp;</p> <div align="left" class="m_-5282972956275044657article-content" style="font-size:16px;line-height:30px;color:#5f6a7d;margin-top:0px;margin-bottom:18px;font-family:' + font + ';font-weight:300"> <p style="margin-bottom:15px">Rất vui được giúp bạn!</p> <p style="margin-bottom:15px">Jobo Team</p> </div> </td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w580" height="10" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="580">&nbsp;</td> </tr> </tbody> </table> </td> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> </tr> </tbody> </table> </td> </tr> <tr style="border-collapse:collapse"> <td bgcolor="#ffffff" class="m_-5282972956275044657w640" height="15" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640">&nbsp;</td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w640" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640"> <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="m_-5282972956275044657w640" id="m_-5282972956275044657footer" style="border-top-width:1px;border-top-style:solid;border-top-color:#f1f1f1;background-color:#ffffff;color:#d4d4d4" width="640"> <tbody> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> <td class="m_-5282972956275044657w580 m_-5282972956275044657h0" height="30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="360">&nbsp;</td> <td class="m_-5282972956275044657w0" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="60">&nbsp;</td> <td class="m_-5282972956275044657w0" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="160">&nbsp;</td> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> <td class="m_-5282972956275044657w580" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" valign="top" width="360"> <p align="left" class="m_-5282972956275044657footer-content-left" id="m_-5282972956275044657permission-reminder" style="font-size:12px;line-height:15px;color:#d4d4d4;margin-top:0px;margin-bottom:15px;white-space:normal"> <span>Sent with ♥ from Jobo</span> </p> <p align="left" class="m_-5282972956275044657footer-content-left" style="font-size:12px;line-height:15px;color:#d4d4d4;margin-top:0px;margin-bottom:15px"> <a href="https://joboapp.com" style="color:#c4c4c4;text-decoration:none;font-weight:bold" target="_blank">Xem thêm</a></p> </td> <td class="m_-5282972956275044657hide m_-5282972956275044657w0" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="60">&nbsp;</td> <td class="m_-5282972956275044657hide m_-5282972956275044657w0" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" valign="top" width="160"> <p align="right" class="m_-5282972956275044657footer-content-right" id="m_-5282972956275044657street-address" style="font-size:11px;line-height:16px;margin-top:0px;margin-bottom:15px;color:#d4d4d4;white-space:normal"> <span>Jobo</span><br style="line-height:100%"> <span>+84 968 269 860</span><br style="line-height:100%"> <span>299 Trung Kính,HN</span></p> </td> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> <td class="m_-5282972956275044657w580 m_-5282972956275044657h0" height="15" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="360">&nbsp;</td> <td class="m_-5282972956275044657w0" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="60">&nbsp;</td> <td class="m_-5282972956275044657w0" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="160">&nbsp;</td> <td class="m_-5282972956275044657w30" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="30">&nbsp;</td> </tr> </tbody> </table> </td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w640" height="60" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640">&nbsp;</td> </tr> </tbody> </table> </td> </tr> <tr style="border-collapse:collapse"> <td class="m_-5282972956275044657w640" height="60" style="font-family:' + font + ';font-weight:300;border-collapse:collapse" width="640">&nbsp;</td> </tr> </tbody> </table></div>'
    //         sendNotificationEmail(email, 'news emasil hsii', WelcomeEmail)
    //     }
    //
    //     sendNotiSubcrible(card)
    //
    //     // noti match noti to employer
    //     function sendNotiSubcrible(userData) {
    //         userData.url = 'https//web.joboapp.com/view/profile/' + userData.userId
    //
    //         var location = userData.location || '';
    //         var distance = userData.distance || 20;
    //         var job = [];
    //         var stringJob = '';
    //         var k = 0
    //         for (var i in userData.job) {
    //             job.push(i);
    //             stringJob += CONFIG.data.job[job]
    //             k++
    //         }
    //         console.log(job, k);
    //
    //         var usercard = [];
    //         for (var i in dataStore) {
    //             var card = dataStore[i];
    //             if (card.location && card.job) {
    //                 var mylat = card.location.lat;
    //                 var mylng = card.location.lng;
    //
    //                 var yourlat = location.lat;
    //                 var yourlng = location.lng;
    //
    //                 var dis = getDistanceFromLatLonInKm(mylat, mylng, yourlat, yourlng);
    //
    //                 if (
    //                     (dis <= distance) && ((card.job[job[0]]) || (card.job[job[1]]) || (card.job[job[2]]))
    //                 ) {
    //                     console.log('push');
    //                     card.distance = distance;
    //                     var NotiEmail = '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <title></title> <!--[if !mso]><!-- --> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!--<![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <style type="text/css"> #outlook a { padding: 0; } .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; } .ExternalClass * { line-height: 100%; } body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; } table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; } p { display: block; margin: 13px 0; } </style> <!--[if !mso]><!--> <style type="text/css"> @media only screen and (max-width:480px) { @-ms-viewport { width: 320px; } @viewport { width: 320px; } } </style> <!--<![endif]--> <!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if lte mso 11]> <style type="text/css"> .outlook-group-fix { width:100% !important; } </style> <![endif]--> <style type="text/css"> @media only screen and (min-width:480px) { .mj-column-per-100 { width: 100%!important; } .mj-column-per-50 { width: 50%!important; } .mj-column-per-80 { width: 80%!important; } .mj-column-per-20 { width: 20%!important; } } </style></head><body><div> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;"> <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--> <div style="margin:0px auto;max-width:600px;"> <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;"> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;"> <![endif]--> <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"> <div class="" style="cursor:auto;color:#000000;font-family:' + font + ';font-size:13px;line-height:22px;text-align:left;"> <p>Chào cửa hàng' + card.storeName + '</p> <p> Được biết cửa hàng của bạn đang cần tuyển nhân viên, chúng tôi đã tìm thấy ứng viên này khá phù hợp với yêu cầu của bạn về chỉ cách cửa hàng của bạn ' + card.distance + ' km </p> </div> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;"> <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--> <div style="margin:0px auto;max-width:600px;"> <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;"> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;"> <![endif]--> <div class="mj-column-per-50 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center"> <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"> <tbody> <tr> <td style="width:400px;"><img alt="" title="" height="auto" src="' + userData.avatar + '" style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;" width="400"></td> </tr> </tbody> </table> </td> </tr> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="justify"> <div class="" style="cursor:auto;color:#000;font-family:' + font + ';font-size:28px;font-weight:bold;line-height:22px;text-align:justify;">' + userData.name + '</div> </td> </tr> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="justify"> <div class="" style="cursor:auto;color:#000;font-family:' + font + ';font-size:15px;line-height:22px;text-align:justify;">' + stringJob + '</div> </td> </tr> <tr style="border-collapse:collapse;"><td class="m_-5282972956275044657w580" style="padding:10px 25px;font-family:' + font + 'font-weight:300;border-collapse:collapse" width="580"><div><a href="' + userData.url + '" style="padding:5px; background: #1FBDF1;background: -webkit-linear-gradient(to left, #1FBDF1, #39DFA5); background: linear-gradient(to left, #1FBDF1, #39DFA5);color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;text-align:center;line-height:40px;text-decoration:none;width:120px; border-radius: 60px;" target="_blank"> Xem chi tiết</a></div></td></tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;"> <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--> <div style="margin:0px auto;max-width:600px;"> <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;"> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;"> <![endif]--> <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"> <div class="" style="cursor:auto;color:#000000;font-family:' + font + ';font-size:13px;line-height:22px;text-align:left;"> <p>Ngoài ra còn rất nhiều ứng viên mới đang tìm việc ở trên Jobo, bạn hãy truy cập web hoặc tải app để tìm ứng viên nhé </p> <p>Rất vui được giúp đỡ bạn!</p> <p>Jobo team,</p> </div> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;"> <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"> <![endif]--> <div style="margin:0px auto;max-width:600px;"> <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;" align="center" border="0"> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;"> <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;"> <![endif]--> <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;"> <p style="font-size:1px;margin:0px auto;border-top:1px solid #E0E0E0;width:100%;"></p> <!--[if mso | IE]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="font-size:1px;margin:0px auto;border-top:1px solid #E0E0E0;width:100%;" width="600"><tr><td style="height:0;line-height:0;"> </td></tr></table><![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td><td style="vertical-align:top;width:600px;"> <![endif]--> <div class="mj-column-per-80 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"> <div class="" style="cursor:auto;color:#000000;font-family:' + font + ';font-size:13px;line-height:22px;text-align:left;"> <p>Sent with ♥ from Jobo</p> +84 968 269 860<br> joboapp.com</div> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td><td style="vertical-align:top;width:600px;"> <![endif]--> <div class="mj-column-per-20 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="left"> <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="left" border="0"> <tbody> <tr> <td style="width:70px;"><img alt="" title="" height="auto" src="http://web.joboapp.com/img/logo.png" style="border:none;border-radius:;display:block;outline:none;text-decoration:none;width:100%;height:auto;" width="70"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--> </td> </tr> </tbody> </table> </div> <!--[if mso | IE]> </td></tr></table> <![endif]--></div></body></html>'
    //
    //                     sendNotificationEmail(card.email, 'Jobo | Có ứng viên mới phù hợp với bạn', NotiEmail);
    //                 }
    //
    //             }
    //
    //         }
    //     }
    //
    //
    // })
    //
    //
    // function filterEmployer(obj) {
    //
    //     var location = obj.location || '';
    //     var distance = obj.distance || '';
    //     var job = obj.job || '';
    //     var industry = obj.industry || '';
    //
    //
    //     var usercard = [];
    //     for (var i in dataStore) {
    //         var card = dataStore[i];
    //         if (card.location) {
    //             var mylat = card.location.lat;
    //             var mylng = card.location.lng;
    //
    //             var yourlat = location.lat;
    //             var yourlng = location.lng;
    //
    //             var dis = getDistanceFromLatLonInKm(mylat, mylng, yourlat, yourlng);
    //
    //             if (
    //                 (dis <= distance || !distance)
    //                 && ((card.job && card.job[job]) || !job)
    //                 && ((card.industry && card.industry[industry]) || !industry)
    //
    //             ) {
    //                 console.log('push');
    //                 card.distance = distance
    //                 usercard.push(card)
    //             }
    //
    //         }
    //
    //     }
    //     return new Promise(function (resolve, reject) {
    //         resolve(usercard)
    //     })
    // }


}

