const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const dot_env = require('dotenv');
dot_env.config({ path: './config/config.env' });
const { admin, user, token, review, employee } = require('../constants/apiConstants');

beforeAll(() => {
    mongoose.connect('mongodb://127.0.0.1:27017/TestEmpReview');
});
afterAll(() => {
    mongoose.connection.dropDatabase();
    mongoose.disconnect();
})

describe("POST /signUp", () => {
    it("admin should signup", async () => {
        const response = await request(app).post("/signup").send(admin.signup);
        expect(response.status).toBe(200);
    });
    it("admin should not signup", async () => {
        const adminEmailError = await request(app).post("/signup").send(admin.signup_error.email);
        expect(adminEmailError.status).toBe(400);
        const adminPasswordError = await request(app).post("/signup").send(admin.signup_error.password);
        expect(adminPasswordError.status).toBe(400);
        const adminRoleError = await request(app).post("/signup").send(admin.signup_error.role);
        expect(adminRoleError.status).toBe(400);
    });

    it("user should signup", async () => {
        const response = await request(app).post("/signup").send(user.signup);
        expect(response.status).toBe(200);
    });
    it("user should not signup", async () => {
        const test = await request(app).post("/signup").send(user.signup_error.email);

        const userEmailError = await request(app).post("/signup").send(user.signup_error.email);
        expect(userEmailError.status).toBe(400);
        const userPasswordError = await request(app).post("/signup").send(user.signup_error.password);
        expect(userPasswordError.status).toBe(400);
        const userRoleError = await request(app).post("/signup").send(user.signup_error.role);
        expect(userRoleError.status).toBe(400);
    });
});

describe("POST/ /login", () => {
    it("admin should login", async () => {
        const login = await request(app).post("/login")
            .send(admin.login);
        token.admin = login.body.token;
        admin.login_data = login.body;
        expect(login.status).toBe(200);
    });
    it("admin should not login", async () => {
        const loginEmailError = await request(app).post('/login')
            .send(admin.login_error.email);
        expect(loginEmailError.status).toBe(400);
        const loginPasswordError = await request(app).post('/login')
            .send(admin.login_error.password);
        expect(loginPasswordError.status).toBe(400);
    });
    it("user should login", async () => {
        const login = await request(app).post("/login")
            .send(user.login);
        token.user = login.body.token;
        user.login_data = login.body;
        expect(login.status).toBe(200);
    });
    it("user should not login", async () => {
        const loginEmailError = await request(app).post('/login')
            .send(user.login_error.email);
        expect(loginEmailError.status).toBe(400);
        const loginPasswordError = await request(app).post('/login')
            .send(user.login_error.password);
        expect(loginPasswordError.status).toBe(400);
    });
});

test("admin jwt error", async () => {
    const adminJwtError = await request(app).get('/admin/allEmployee')
        .auth("ldl", { type: "bearer" });
    expect(adminJwtError.status).toBe(401);
});

describe("POST /admin/addEmployee", () => {
    it("should add new employee", async () => {
        const addEmployee = await request(app).post('/admin/addEmployee')
            .auth(token.admin, { type: "bearer" })
            .send(employee.create_employee);
        expect(addEmployee.status).toBe(200);
        expect(addEmployee.body).not.toBeNull();
        employee.employee = addEmployee.body;
        employee.employee_id = addEmployee.body._id;
        review.add_review.employee_id = addEmployee.body._id;
    });
    it("should not add new employee", async () => {
        const addEmpNameError = await request(app).post('/admin/addEmployee')
            .send(employee.create_employee_error.name)
            .auth(token.admin, { type: "bearer" });
        expect(addEmpNameError.status).toBe(400);
        const addEmpGroupError = await request(app).post('/admin/addEmployee')
            .send(employee.create_employee_error.work_group)
            .auth(token.admin, { type: "bearer" });
        expect(addEmpGroupError.status).toBe(400);
        const addPositionError = await request(app).post('/admin/addEmployee')
            .send(employee.create_employee_error.position)
            .auth(token.admin, { type: "bearer" });
        expect(addPositionError.status).toBe(400);
    });
});

describe("GET /admin/allEmployee", () => {
    it("should get employee", async () => {
        const allEmployee = await request(app).get('/admin/allEmployee')
            .auth(token.admin, { type: "bearer" });
        expect(allEmployee.status).toBe(200);
        expect(allEmployee.body).not.toBeNull();
    });
});

describe("POST /admin/oneEmployee", () => {
    it("should get oneEmployee", async () => {
        const oneEmployee = await request(app).post('/admin/oneEmployee')
            .auth(token.admin, { type: "bearer" })
            .send({
                employee_id: employee.employee_id
            });
        expect(oneEmployee.status).toBe(200);
        expect(oneEmployee.body).not.toBeNull();
    });
    it("should not get oneEmployee", async () => {
        const oneEmployeeError = await request(app).post('/admin/oneEmployee')
            .auth(token.admin, { type: "bearer" });
        expect(oneEmployeeError.status).toBe(400);
    });
});

describe("PATCH /admin/editEmployee", () => {
    it("should edit employee", async () => {
        employee.edit_employee.employee_id = employee.employee_id;
        const editEmployee = await request(app).patch('/admin/editEmployee')
            .send(employee.edit_employee)
            .auth(token.admin, { type: "bearer" });
        expect(editEmployee.status).toBe(200);
    });
    it("should not edit employee", async () => {
        const editEmployeeIdError = await request(app).patch('/admin/editEmployee')
            .send(employee.edit_employee_error.employee_id)
            .auth(token.admin, { type: "bearer" });
        expect(editEmployeeIdError.status).toBe(400);
        const editEmployeeGroupError = await request(app).patch('/admin/editEmployee')
            .send(employee.edit_employee_error.work_group)
            .auth(token.admin, { type: "bearer" });
        expect(editEmployeeGroupError.status).toBe(400);
        const editEmployeePositionError = await request(app).patch('/admin/editEmployee')
            .send(employee.edit_employee_error.position)
            .auth(token.admin, { type: "bearer" });
        expect(editEmployeePositionError.status).toBe(400);
    });
});

describe("POST /admin/addReview", () => {
    it("should add review", async () => {
        review.add_review.employee_id = employee.employee_id;
        const addReview = await request(app).post('/admin/addReview')
            .send(review.add_review)
            .auth(token.admin, { type: "bearer" });
        expect(addReview.status).toBe(200);
        expect(addReview).not.toBeNull();
        review.edit_review_id = addReview.body._id;
        review.reply_review_id = addReview.body._id;
        review.edit_review.review_id = addReview.body._id;
        review.delete_review_id = await addReview.body._id;
    });
    it("should not add review", async () => {
        const addReviewEmailError = await request(app).post('/admin/addReview')
            .send(review.add_review_error.email)
            .auth(token.admin, { type: "bearer" });
        expect(addReviewEmailError.status).toBe(400);
        const addReviewEmpIdError = await request(app).post('/admin/addReview')
            .send(review.add_review_error.employee_id)
            .auth(token.admin, { type: "bearer" });
        expect(addReviewEmpIdError.status).toBe(400);
        const addReviewError = await request(app).post('/admin/addReview')
            .send(review.add_review_error.review)
            .auth(token.admin, { type: "bearer" });
        expect(addReviewError.status).toBe(400);
    });
});

describe("PATCH /admin/editReview", () => {

    it("should edit review", async () => {
        const editReview = await request(app).patch('/admin/editReview')
            .send({
                "review_id": review.edit_review_id,
                "email": "usertest@1111.com",
                "review": "testupdate1djsdcjsdkj"
            })
            .auth(token.admin, { type: "bearer" });
        console.log(editReview.error);
        expect(editReview.status).toBe(200);
    });
    it("should not edit review", async () => {
        const editReviewEmailError = await request(app).patch('/admin/editReview')
            .send(review.edit_review_error.email)
            .auth(token.admin, { type: "bearer" });
        expect(editReviewEmailError.status).toBe(400);
        const editReviewIdError = await request(app).patch('/admin/editReview')
            .send(review.edit_review_error.review_id)
            .auth(token.admin, { type: "bearer" });
        expect(editReviewIdError.status).toBe(400);
    });

});

describe("POST /admin/replyReview", () => {
    it("should add reply", async () => {
        const reply = await request(app).post('/admin/replyAReview')
            .send({
                "review_id": review.reply_review_id,
                "email": "usertest@1111.com",
                "reply": "testreplyofTenChar"
            })
            .auth(token.admin, { type: 'bearer' });
        expect(reply.status).toBe(200);
    });
    it("should not add reply", async () => {
        const replyReviewIdError = await request(app).post('/admin/replyAReview')
            .send({
                "review_id": "",
                "email": "usertest@1111.com",
                "reply": "testreplyofTenChar"
            })
            .auth(token.admin, { type: 'bearer' });
        expect(replyReviewIdError.status).toBe(400);
        const replyEmailError = await request(app).post('/admin/replyAReview')
            .send({
                "review_id": review.reply_review_id,
                "email": "usertest",
                "reply": "testreplyofTenChar"
            })
            .auth(token.admin, { type: 'bearer' });
        expect(replyEmailError.status).toBe(400);
        const replyError = await request(app).post('/admin/replyAReview')
            .send({
                "review_id": review.reply_review_id,
                "email": "usertest@1111.com",
                "reply": ""
            })
            .auth(token.admin, { type: 'bearer' });
        expect(replyReviewIdError.status).toBe(400);
    });
});

describe("PATCH /admin/editReply", () => {
    it("Should edit reply", async () => {
        const editReply = await request(app).patch('/admin/editReply')
            .auth(token.admin, { type: 'bearer' })
            .send({
                "review_id": review.reply_review_id,
                "reply": "updated edit review"
            });
        expect(editReply.status).toBe(200);
    })
    it('Should not edit reply', async () => {
        const editReviewIdReply = await request(app).patch('/admin/editReply')
            .auth(token.admin, { type: 'bearer' })
            .send({
                "review_id": "",
                "reply": "updated edit review"
            });
        expect(editReviewIdReply.status).toBe(400);
    });
});

test("user jwt error", async () => {
    const allEmployee = await request(app).get("/user/allEmployee");
    expect(allEmployee.status).toBe(401);
});

describe("GET /user/allEmployee", () => {
    it("should get all employee", async () => {
        const allEmployee = await request(app).get("/user/allEmployee")
            .auth(token.user, { type: 'bearer' });
        expect(allEmployee.status).toBe(200);
        expect(allEmployee.body).not.toBeNull();
    });
});

describe("POST /user/oneEmployee", () => {
    it("should get one employee ", async () => {
        const oneEmployee = await request(app).post('/user/oneEmployee')
            .send({
                employee_id: employee.employee_id
            })
            .auth(token.user, { type: 'bearer' });
        expect(oneEmployee.status).toBe(200);
        expect(oneEmployee.body).not.toBeNull();
    });
    it("should not get one employee", async () => {
        const oneEmployeeIdError = await request(app).post('/user/oneEmployee')
            .send({
                employee_id: ""
            })
            .auth(token.user, { type: 'bearer' });
        expect(oneEmployeeIdError.status).toBe(400);
    });
});

describe("POST /user/addReview", () => {
    it("should add review", async () => {
        const addReview = await request(app).post('/user/addReview')
            .send({
                "employee_id": employee.employee_id,
                "email": "usertest@222.com",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        expect(addReview.status).toBe(200);
        expect(addReview.body).not.toBeNull();
        review.edit_review_id = await addReview.body._id;
    });
    it("should not add review", async () => {
        const addReviewEmailError = await request(app).post('/user/addReview')
            .send({
                "employee_id": employee.employee_id,
                "email": "usertescom",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        expect(addReviewEmailError.status).toBe(400);
        const addReviewEmpIdError = await request(app).post('/user/addReview')
            .send({
                "employee_id": "",
                "email": "usertest@222.com",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        expect(addReviewEmpIdError.status).toBe(400);
        const addReviewError = await request(app).post('/user/addReview')
            .send({
                "employee_id": employee.employee_id,
                "email": "usertest@222.com",
                "review": ""
            })
            .auth(token.user, { type: "bearer" });
        expect(addReviewError.status).toBe(400);
    });
});

describe("POST /user/editReview", () => {

    it("should edit review", async () => {
        const editReview = await request(app).patch('/user/editReview')
            .send({
                "review_id": review.edit_review_id,
                "email": "usertest@222.com",
                "review": "this  is an updated review"
            })
            .auth(token.user, { type: "bearer" });
        expect(editReview.status).toBe(200);
    });
    it("should not edit review", async () => {
        const editReviewEmailError = await request(app).patch('/user/editReview')
            .send({
                "review_id": review.user_review_id,
                "email": "sjdnsj",
                "review": "this  is an updated review"
            })
            .auth(token.user, { type: "bearer" });
        expect(editReviewEmailError.status).toBe(400);
        const editReviewIdError = await request(app).patch('/user/editReview')
            .send({
                "review_id": "",
                "email": "usertest@222.com",
                "review": "this  is an updated review"
            })
            .auth(token.user, { type: "bearer" });
        expect(editReviewIdError.status).toBe(400);
    });
});

describe("PATCH /user/editName", () => {
    it("should edit name", async () => {
        const editName = await request(app).post('/user/editName')
            .send({
                "email": "usertest@222.com",
                "name": "updated name"
            })
            .auth(token.user, { type: 'bearer' });
        expect(editName.status).toBe(200);
    });
    it("should not edit name", async () => {
        const editNameError = await request(app).post('/user/editName')
            .send({
                "email": "usertest.com",
                "name": "updated name"
            })
            .auth(token.user, { type: 'bearer' });
        expect(editNameError.status).toBe(400);
    });
});

describe("GET /allEmployee", () => {
    it("should get all employee", async () => {
        const allEmployee = await request(app).get("/allEmployee")
        expect(allEmployee.status).toBe(200);
        expect(allEmployee.body).not.toBeNull();
    });
});

describe("POST /oneEmployee", () => {
    it("should get one employee", async () => {
        const oneEmployee = await request(app).post("/oneEmployee")
            .send({
                "employee_id": employee.employee_id
            });
        expect(oneEmployee.status).toBe(200);
        expect(oneEmployee.body).not.toBeNull();
    });
    it("should not get one employee", async () => {
        const oneEmployeeError = await request(app).post("/oneEmployee")
            .send({
                employee_id: "djnsjks"
            });
        expect(oneEmployeeError.status).toBe(400);
    });
});

describe("POST /addReview", () => {
    it("should add review", async () => {
        const addReview = await request(app).post('/addReview')
            .send({
                "employee_id": employee.employee_id,
                "review": "test review from anonymous."
            });
        expect(addReview.status).toBe(200);
        expect(addReview.body).not.toBeNull();
    });
    it("should not add review", async () => {
        const addReviewEmpIdError = await request(app).post('/addReview')
            .send({
                "employee_id": "",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        expect(addReviewEmpIdError.status).toBe(400);
        const addReviewError = await request(app).post('/addReview')
            .send({
                "employee_id": employee.employee_id,
                "review": ""
            })
            .auth(token.user, { type: "bearer" });
        expect(addReviewError.status).toBe(400);
    });
});

describe("DELETE /admin/delReview", () => {
    it("should delete review", async () => {
        const deleteReview = await request(app).delete("/admin/delReview")
            .send({
                "review_id": review.delete_review_id
            })
            .auth(token.admin, { type: 'bearer' });
        expect(deleteReview.status).toBe(200);
    });
    it("should not delete review", async () => {
        const deleteReview = await request(app).delete("/admin/delReview")
            .send({
                "review_id": "csldjvdv"
            })
            .auth(token.admin, { type: 'bearer' });
        expect(deleteReview.status).toBe(400);
    });
});

describe("GET /admin/allUsers", ()=>{
    it("should get all users", async()=>{
        const allUsers = await request(app).get("/admin/allUsers")
            .auth(token.admin, {type:'bearer'});
        expect(allUsers.status).toBe(200);
        expect(allUsers.body).not.toBeNull();
        user.login_data = await allUsers.body[1];
    });
});

describe("DELETE /admin/delUsers", ()=>{
    it("should delete a user", async()=>{
        const deleteUser = await request(app).delete("/admin/delUsers")
            .auth(token.admin, {type:'bearer'})
            .send({
                user_id:user.login_data._id
            });
        expect(deleteUser.status).toBe(200);
    });
    it("should not delete a user", async()=>{
        const deleteUserError = await request(app).delete("/admin/delUsers")
            .auth(token.admin, {type:'bearer'})
            .send({
                user_id:"vknsdj"
            });
        expect(deleteUserError.status).toBe(400);
    });
});

describe("DELETE /admin/delEmployee", ()=>{
    it("should delete employee", async()=>{
        const deleteEmployee = await request(app).delete("/admin/delEmployee")
            .auth(token.admin, {type:'bearer'})
            .send({
                employee_id:employee.employee_id
            });
        expect(deleteEmployee.status).toBe(200);
    });
    it("should not delete Employee", async()=>{
        const deleteEmployeeError = await request(app).delete("/admin/delEmployee")
            .auth(token.admin, {type:'bearer'})
            .send({
                employee_id:"vknsdj"
            });
        expect(deleteEmployeeError.status).toBe(400);
    });
});
