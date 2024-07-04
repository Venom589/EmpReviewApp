
module.exports.admin = {
    signup: {
        email: "usertest@1111.com",
        name: "usertest1",
        password: "Usertest@111",
        role: "admin"
    },
    signup_error: {
        password: {
            email: "usertest@1111.com",
            name: "usertest1",
            password: "e@111",
            role: "admin"
        },
        email: {
            email: "usertest.com",
            name: "usertest1",
            password: "Usertest@111",
            role: "admin"
        },
        role: {
            email: "usertest@1111.com",
            name: "usertest1",
            password: "Usertest@111",
            role: "xyz"
        }
    },
    login: {
        email: "usertest@1111.com",
        password: "Usertest@111",
        role: "admin"
    },
    login_error: {
        password: {
            email: "usertest@1111.com",
            password: "Urtest@111",
            role: "admin"
        },
        email: {
            email: "userdjkj@1111.com",
            password: "Usertest@111",
            role: "admin"
        }
    },
    login_data: {}
}

module.exports.user = {
    signup: {
        email: "usertest@222.com",
        name: "usertest1",
        password: "Usertest@111",
        role: "user"
    },
    signup_error: {
        password: {
            email: "usertest@222.com",
            name: "usertest1",
            password: "e@111",
            role: "user"
        },
        email: {
            email: "usertest.com",
            name: "usertest1",
            password: "Usertest@111",
            role: "user"
        },
        role: {
            email: "usertest@222.com",
            name: "usertest1",
            password: "Usertest@111",
            role: "xyz"
        }
    },
    login: {
        email: "usertest@222.com",
        password: "Usertest@111",
        role: "admin"
    },
    login_error: {
        password: {
            email: "usertest@222.com",
            password: "Urtest@111",
            role: "admin"
        },
        email: {
            email: "userdjkj@1111.com",
            password: "Usertest@111",
            role: "admin"
        }
    },
    login_data: {}
}

module.exports.review = {
    add_review: {
        employee_id: "",
        email: "usertest@1111.com",
        review: "testReview1"
    },
    add_review_error: {
        employee_id: {
            employee_id: "",
            email: "usertest@1111.com",
            review: "testReview1"
        },
        email: {
            employee_id: "66837cc8ca7661d812cc38e3",
            email: "usertest",
            review: "testReview1"
        },
        review: {
            employee_id: "66837cc8ca7661d812cc38e3",
            email: "usertest@1111.com",
            review: ""
        }
    },
    edit_review: {
        review_id:"",
        email: "usertest@1111.com",
        review: "testReview1"
    },
    edit_review_error: {
        email: {
            review_id: "66837aa1ca7661d812cc38d4",
            email: "",
            review: "testReview1"
        },
        review_id: {
            review_id: "",
            email: "usertest@1111.com",
            review: "testReview1"
        }
    },
    reply_review_id: "",
    edit_review_id: "",
    delete_review_id: "",
    edit_reply_review_id: "",
    user_review_id:""
}

module.exports.employee = {
    create_employee: {
        "name": "test4",
        "work_group": "Group_D",
        "position": "Intern"
    },
    create_employee_error: {
        name: {
            "name": "",
            "work_group": "Group_D",
            "position": "Intern"
        },
        work_group: {
            "name": "test4",
            "work_group": "Group_g",
            "position": "Junior"
        },
        position:{
            "name":"test4",
        "work_group":"Group_D",
        "position":"nothing"
        },
    },
    edit_employee:{
        "employee_id":"6683789cca7661d812cc38b5",
        "name":"testupdate1",
        "work_group":"Group_C",
        "position":"Junior"
    },
    edit_employee_error:{
        employee_id:{
            "employee_id":"",
            "name":"testupdate1",
            "work_group":"Group_C",
            "position":"Junior"
        },
        work_group:{
            "employee_id":"6683789cca7661d812cc38b5",
            "name":"testupdate1",
            "work_group":"Group_h",
            "position":"Junior"
        },
        position:{
            "employee_id":"6683789cca7661d812cc38b5",
            "name":"testupdate1",
            "work_group":"Group_C",
            "position":"nothing"
        }
    },
    employee_id:"",
    employee:{}
}

module.exports.token = {
    admin:"",
    user:""
}