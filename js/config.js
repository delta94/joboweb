angular.module('starter.configs', [])
    .constant("CONFIG", {
        'UpdateAt': "2017-04-10T04:44:21.253Z",
        'Location': false,
        "WEBURL": 'https://jobo.asia',
        "APIURL": 'http://localhost:8080',
        "AnaURL": 'http://localhost:8081',
        'FCM_KEY': "AAAArk3qIB4:APA91bEWFyuKiFqLt4UIrjUxLbduQCWJB4ACptTtgAovz4CKrMdonsS3jt06cfD9gGOQr3qtymBmKrsHSzGhqyJ_UWrrEbA4YheznlqYjsCBp_12bNPFSBepqg_qrxwdYxX_IcT9ne5z6s02I2mu2boy3VTN3lGPYg",
        "APIKey": 'AIzaSyATOX9rL_ULV-Q_e2kImu9wYgK2AToOteQ',
        "StatusChat": {
            0: "Đã gửi",
            1: "Đã xem"
        },
        "action": {
            "autoLogin": "tự động đăng nhập",
            "buy": "mua gói",
            "chat": "chat",
            "close": "đã offline",
            "confirmBuy": "xác nhận mua",
            "createAccount": "tạo tài khoản",
            "createNewStore": "tạo thêm cửa hàng",
            "createProfile": "tạo profile",
            "updateProfile": "cập nhật profile",
            "createStore": "tạo cửa hàng",
            "dislike": "ghét",
            "filter": "lọc",
            "filterMore": "lọc nâng cao",
            "like": "thích",
            "login": "đăng nhập",
            "match": "tương hợp",
            "open": "đã online",
            "register": "đăng ký",
            "updateStore": "cập nhật store",
            "viewChat": "vào page chat",
            "viewPricing": "vào bảng giá",
            "viewProfile": "xem hồ sơ",
            "viewSetting": "vào cài đặt",
            "viewStore": "xem cửa hàng",
            "getToken": "lấy token"
        },
        "data": {
            "industry": {
                "airlines": "Hàng không/ Sân bay",
                "beauty_salon": "Thẩm mỹ viện",
                "education_centre": "Trung tâm đào tạo",
                "golf_course": "Sân Golf",
                "gym": "Thể hình/ phòng tập",
                "karaoke": "Karaoke",
                "lodging": "Khách sạn/ Khu căn hộ",
                "real_estate": "Dự án BĐS/ Quản lý tòa nhà",
                "resort": "Resort/ Khu Du lịch",
                "restaurant_bar": "Nhà hàng/Cafe ",
                "supermarket_cinema": "Siêu thị/ Rạp phim",
                "travel_agency": "Công ty Du lịch/phòng vé",
                "store": "Cửa hàng/Bán lẻ",
                "other": "Khác"

            },
            "job": {
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
                "other": "Khác",
                "bartender": "Pha chế"
            },
            "languages": {
                "english": "Tiếng Anh",
                "chinese": "Tiếng Trung",
                "french": "Tiếng Pháp",
                "germain": "Đức ",
                "italian": "Ý",
                "japanese": "Tiếng Nhật",
                "korean": "Tiếng Hàn",
                "others ": "Khác",
                "portuguese ": "Bồ Đào Nha",
                "spanish": "Tây Ban Nha",
                "thai": "Thái Lan"
            },
            "time": {
                "morning": "Sáng",
                "noon": "Trưa",
                "afternoon": "Chiều",
                "evening": "Tối"
            },
            "working_type": {
                "fulltime": "Toàn thời gian",
                "parttime": "Bán thời gian",
                "seasonal": "Thời vụ"
            },

            "sex": {
                "male": "Nam",
                "female": "Nữ",
            },
            "sort": {
                "match": "Phù hợp nhất",
                "createdAt": "Thời gian",
                "distance": "Khoảng cách",
                "viewed": "Lượt xem",
                "rate": "Đánh giá",
                "feature": "Nổi bật"


            },
            "dataContentType": {
                "job": "Công việc",
                "store": "Thương hiệu"
            },
            "convertIns": {
                "store": {
                    "bicycle_store": true,
                    "book_store": true,
                    "clothing_store": true,
                    "convenience_store": true,
                    "electronics_store": true,
                    "florist": true,
                    "furniture_store": true,
                    "hardware_store": true,
                    "home_goods_store": true,
                    "jewelry_store": true,
                    "laundry": true,
                    "liquor_store": true,
                    "meal_takeaway": true,
                    "shoe_store": true,
                    "pharmacy": true,
                    "pet_store": true,
                    "hair_care": true,
                    "car_rental": true,
                    "car_repair": true,
                    "car_wash": true,
                    "movie_rental": true,
                    "store": true
                },
                "lodging": {
                    "lodging": true
                },
                "restaurant_bar": {
                    "bar": true,

                    "cafe": true,
                    "night_club": true,
                    "restaurant": true
                },
                "resort": {
                    "campground": true,
                    "amusement_park": true,
                    "aquarium": true,
                    "park": true,
                    "rv_park": true,
                    "zoo": true
                },
                "beauty_salon": {
                    "beauty_salon": true,
                    "spa": true,
                    "physiotherapist": true
                },
                "supermarket_cinema": {
                    "movie_theater": true,
                    "shopping_mall": true
                },
                "real_estate": {
                    "art_gallery": true,
                    "library": true,
                    "museum": true,
                    "real_estate_agency": true,
                    "stadium": true
                },
                "education_centre": {
                    "school": true,
                    "university": true
                },
                "unique": {
                    "gym": true,
                    "travel_agency": true,
                    "airport": true,
                    "lodging": true
                }
            }
        },
        "review": {
            1: 'Rất tệ',
            2: 'Tệ',
            3: 'Ổn',
            4: 'Tốt',
            5: 'Xuất xắc'
        },
        "pack": {
            1: {
                "name": "Basic",
                "price": "100.000 đ/tháng"
            },
            2: {
                "name": "Premium",
                "price": "300.000 đ/tháng"
            },
            3: {
                "name": "Power",
                "price": "1.000.000 đ/tháng"
            }
        },
        "hour": {
            0: "0:00",
            1: "1:00",
            2: "2:00",
            3: "3:00",
            4: "4:00",
            5: "5:00",
            6: "6:00",
            7: "7:00",
            8: "8:00",
            9: "9:00",
            10: "10:00",
            11: "11:00",
            12: "12:00",
            13: "13:00",
            14: "14:00",
            15: "15:00",
            16: "16:00",
            17: "17:00",
            18: "18:00",
            19: "19:00",
            20: "20:00",
            21: "21:00",
            22: "22:00",
            23: "23:00",
            24: "24:00",

        },
        "day": {
            0: "Chủ nhật",
            1: "Thứ 2",
            2: "Thứ 3",
            3: "Thứ 4",
            4: "Thứ 5",
            5: "Thứ 6",
            6: "Thứ 7",
        }
    });
