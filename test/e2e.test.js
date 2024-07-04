const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const dot_env = require('dotenv');
dot_env.config({ path: './config/config.env' });
const { admin, user, token, review, employee } = require('./apiConstants');

beforeAll(() => {
    mongoose.connect(process.env.TESTDB);
});
afterAll(() => {
    mongoose.connection.dropDatabase();
    mongoose.disconnect();
})

describe("POST /signUp", () => {
    it("admin should signup", async () => {
        const response = await request(app).post("/signup").send(admin.signup);
        expect(response.status).toBe(201);
    });
    describe("admin should not create", () => {
        describe("Not run with other request", () => {
            it("should not run on get", async () => {
                const response = await request(app).get("/signup").send(admin.signup);
                expect(response.status).toBe(404);
            });
            it("should not run on put", async () => {
                const response = await request(app).put("/signup").send(admin.signup);
                expect(response.status).toBe(404);
            });
            it("should not run on patch", async () => {
                const response = await request(app).patch("/signup").send(admin.signup);
                expect(response.status).toBe(404);
            });
            it("should not run on delete", async () => {
                const response = await request(app).delete("/signup").send(admin.signup);
                expect(response.status).toBe(404);
            });
        });
        describe("Not create admin", () => {
            it("with existing admin", async () => {
                const response = await request(app).post("/signup").send({
                    email: "test@123.com",
                    password: "Test@123",
                    name: "testName",
                    role: "admin"
                });
                expect(response.status).toBe(400);
            });
            it("with empty name", async () => {
                const response = await request(app).post("/signup").send({
                    email: "test@123.com",
                    password: "Test@123",
                    role: "admin"
                });
                expect(response.status).toBe(401);
            });
            it("with existing email", async () => {
                const response = await request(app).post("/signup").send(admin.signup);
                expect(response.status).toBe(400);
            });
            it("with existing wrong email", async () => {
                const adminEmailError = await request(app).post("/signup").send(admin.signup_error.email);
                expect(adminEmailError.status).toBe(401);
            });
            it("with existing wrong password", async () => {
                const adminPasswordError = await request(app).post("/signup").send(admin.signup_error.password);
                expect(adminPasswordError.status).toBe(401);
            });
            it("with existing wrong role", async () => {
                const adminRoleError = await request(app).post("/signup").send(admin.signup_error.role);
                expect(adminRoleError.status).toBe(401);
            });
            it("with additional data", async () => {
                const adminRoleError = await request(app).post("/signup").send({
                    email: "test@123.com",
                    password: "Test@123",
                    name: "testName",
                    role: "admin",
                    extraField: "extra field"
                });
                expect(adminRoleError.status).toBe(401);
            });
        });
    });

    it("user should signup", async () => {
        const response = await request(app).post("/signup").send(user.signup);
        expect(response.status).toBe(201);
    });
    describe("User should not create", () => {
        describe("Not run with other request", () => {
            it("should not run on get", async () => {
                const response = await request(app).get("/signup").send(user.signup);
                expect(response.status).toBe(404);
            });
            it("should not run on put", async () => {
                const response = await request(app).put("/signup").send(user.signup);
                expect(response.status).toBe(404);
            });
            it("should not run on patch", async () => {
                const response = await request(app).patch("/signup").send(user.signup);
                expect(response.status).toBe(404);
            });
            it("should not run on delete", async () => {
                const response = await request(app).delete("/signup").send(user.signup);
                expect(response.status).toBe(404);
            });
        });
        describe("Not create user", () => {
            it("with existing email", async () => {
                const response = await request(app).post("/signup").send(admin.signup);
                expect(response.status).toBe(400);
            });
            it("with empty name", async () => {
                const response = await request(app).post("/signup").send({
                    email: "test@123.com",
                    password: "Test@123",
                    role: "user"
                });
                expect(response.status).toBe(401);
            });
            it("with existing wrong email", async () => {
                const userEmailError = await request(app).post("/signup").send(user.signup_error.email);
                expect(userEmailError.status).toBe(401);
            });
            it("with existing wrong password", async () => {
                const userPasswordError = await request(app).post("/signup").send(user.signup_error.password);
                expect(userPasswordError.status).toBe(401);
            });
            it("with existing wrong role", async () => {
                const userRoleError = await request(app).post("/signup").send(user.signup_error.role);
                expect(userRoleError.status).toBe(401);
            });
            it("with additional data", async () => {
                const adminRoleError = await request(app).post("/signup").send({
                    email: "test@123.com",
                    password: "Test@123",
                    name: "testName",
                    role: "user",
                    extraField: "extra field"
                });
                expect(adminRoleError.status).toBe(401);
            });
        });
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
    it("user should login", async () => {
        const login = await request(app).post("/login")
            .send(user.login);
        token.user = login.body.token;
        user.login_data = login.body;
        expect(login.status).toBe(200);
    });
    describe("Should not login", () => {
        describe("using other request", () => {
            it("should not run on get", async () => {
                const response = await request(app).get("/login")
                    .send(admin.login);
                expect(response.status).toBe(404);
            });
            it("should not run on put", async () => {
                const response = await request(app).put("/login")
                    .send(admin.login);
                expect(response.status).toBe(404);
            });
            it("should not run on patch", async () => {
                const response = await request(app).patch("/login")
                    .send(admin.login);
                expect(response.status).toBe(404);
            });
            it("should not run on delete", async () => {
                const response = await request(app).delete("/login")
                    .send(admin.login);
                expect(response.status).toBe(404);
            });
        });
        describe("using wrong credentials", () => {
            it("with wrong email pattern", async () => {
                const loginEmailError = await request(app).post('/login')
                    .send({
                        email: "wrongEmail",
                        password: admin.login.password
                    });
                expect(loginEmailError.status).toBe(401);
            });
            it("with wrong password pattern", async () => {
                const loginPasswordError = await request(app).post('/login')
                    .send({
                        email: admin.login.email,
                        password: "kvk dj"
                    });
                expect(loginPasswordError.status).toBe(401);
            });
            it("with correct email wrong password", async () => {
                const login = await request(app).post("/login")
                    .send({
                        email: admin.login.email,
                        password: "Incorrect@123"
                    });
                expect(login.status).toBe(400);
            });
            it("with extra fields", async () => {
                const loginExtraField = await request(app).post("/login")
                    .send({
                        email: admin.login.email,
                        password: "Tesst@123",
                        extraField: "extra field"
                    });
                expect(loginExtraField.status).toBe(401);
            });
        });
    });
});

describe("POST /admin/addEmployee", () => {
    it("should add new employee", async () => {
        const addEmployee = await request(app).post('/admin/addEmployee')
            .auth(token.admin, { type: "bearer" })
            .send(employee.create_employee);
        expect(addEmployee.status).toBe(201);
        expect(addEmployee.body).not.toBeNull();
        employee.employee = addEmployee.body;
        employee.employee_id = addEmployee.body._id;
        review.add_review.employee_id = addEmployee.body._id;
    });
    describe("should not add new employee", () => {
        describe("Not run with other request", () => {
            it("should not run on get", async () => {
                const response = await request(app).get('/admin/addEmployee')
                    .auth(token.admin, { type: "bearer" })
                    .send(employee.create_employee);
                expect(response.status).toBe(404);
            });
            it("should not run on put", async () => {
                const response = await request(app).put('/admin/addEmployee')
                    .auth(token.admin, { type: "bearer" })
                    .send(employee.create_employee);
                expect(response.status).toBe(404);
            });
            it("should not run on patch", async () => {
                const response = await request(app).patch('/admin/addEmployee')
                    .auth(token.admin, { type: "bearer" })
                    .send(employee.create_employee);
                expect(response.status).toBe(404);
            });
            it("should not run on delete", async () => {
                const response = await request(app).delete('/admin/addEmployee')
                    .auth(token.admin, { type: "bearer" })
                    .send(employee.create_employee);
                expect(response.status).toBe(404);
            });
        });
        describe("with wrong credential", () => {
            it("jwt Error", async () => {
                const jwtError = await request(app).post('/admin/addEmployee')
                    .send(employee.create_employee_error.position);
                expect(jwtError.status).toBe(403);
            });
            it("Name pattern Error", async () => {
                const nameError = await request(app).post('/admin/addEmployee')
                    .send(employee.create_employee_error.name)
                    .auth(token.admin, { type: "bearer" });
                expect(nameError.status).toBe(401);
            });
            it("Work_group pattern error", async () => {
                const workGroupError = await request(app).post('/admin/addEmployee')
                    .send(employee.create_employee_error.work_group)
                    .auth(token.admin, { type: "bearer" });
                expect(workGroupError.status).toBe(401);
            });
            it("Position pattern Error", async () => {
                const positionError = await request(app).post('/admin/addEmployee')
                    .send(employee.create_employee_error.position)
                    .auth(token.admin, { type: "bearer" });
                expect(positionError.status).toBe(401);
            });
            it("extra field Error", async () => {
                const extraFieldError = await request(app).post('/admin/addEmployee')
                    .send({
                        name: "test",
                        position: "Junior",
                        work_group: "Group_A",
                        extra: "extra field"
                    })
                    .auth(token.admin, { type: "bearer" });
                expect(extraFieldError.status).toBe(401);
            });
        });
    });
    it('Cannot add same employee for same position and workgroup', async () => {
        const addEmployeeError = await request(app).post('/admin/addEmployee')
            .auth(token.admin, { type: "bearer" })
            .send(employee.create_employee);
        expect(addEmployeeError.status).toBe(400);
    });
});

describe("GET /admin/allEmployee", () => {
    it("should get employee", async () => {
        const allEmployee = await request(app).get('/admin/allEmployee')
            .auth(token.admin, { type: "bearer" });
        expect(allEmployee.status).toBe(200);
        expect(allEmployee.body).not.toBeNull();
    });
    describe("Not run with other request", () => {
        it("should not run on post", async () => {
            const response = await request(app).post('/admin/allEmployee')
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/allEmployee')
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/admin/allEmployee')
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/allEmployee')
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it('jwt error', async () => {
            const jwtError = await request(app).get('/admin/allEmployee');
            expect(jwtError.status).toBe(403);
        });
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
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).post('/admin/oneEmployee');
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).post('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong employee id', async () => {
            const employeeIdError = await request(app).post('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" })
                .send({
                    employee_id: "dvkjk"
                });
            expect(employeeIdError.status).toBe(401);
        });
        it("extra field Error", async () => {
            const extraFieldError = await request(app).post('/admin/oneEmployee')
                .auth(token.admin, { type: "bearer" })
                .send({
                    employee_id: employee.employee_id,
                    "extra": "extra"
                });
            expect(extraFieldError.status).toBe(401);
        });
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
    it("should successfully edit employee without editable required fields", async () => {
        employee.edit_employee.employee_id = employee.employee_id;
        const editEmployee = await request(app).patch('/admin/editEmployee')
            .send({
                employee_id: employee.employee_id
            })
            .auth(token.admin, { type: "bearer" });
        expect(editEmployee.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/admin/editEmployee')
                .send(employee.edit_employee)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/editEmployee')
                .send(employee.edit_employee)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post('/admin/editEmployee')
                .send(employee.edit_employee)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/editEmployee')
                .send(employee.edit_employee)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).patch('/admin/editEmployee')
                .send(employee.edit_employee);
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).patch('/admin/editEmployee')
                .auth(token.admin, { type: "bearer" });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong employee id', async () => {
            const employeeIdError = await request(app).patch('/admin/editEmployee')
                .send(employee.edit_employee_error.employee_id)
                .auth(token.admin, { type: "bearer" });
            expect(employeeIdError.status).toBe(401);
        });
        it('with wrong work_group pattern', async () => {
            const workGroupError = await request(app).patch('/admin/editEmployee')
                .send(employee.edit_employee_error.work_group)
                .auth(token.admin, { type: "bearer" });
            expect(workGroupError.status).toBe(401);
        });
        it('with wrong position pattern', async () => {
            const positionError = await request(app).patch('/admin/editEmployee')
                .send(employee.edit_employee_error.position)
                .auth(token.admin, { type: "bearer" });
            expect(positionError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraFieldError = await request(app).patch('/admin/editEmployee')
                .send({
                    employee: employee.employee_id,
                    extraField: "extraField"
                })
                .auth(token.admin, { type: "bearer" });
            expect(extraFieldError.status).toBe(401);
        });
    });
});

describe("POST /admin/addReview", () => {
    it("should add review", async () => {
        review.add_review.employee_id = employee.employee_id;
        const addReview = await request(app).post('/admin/addReview')
            .send(review.add_review)
            .auth(token.admin, { type: "bearer" });
        expect(addReview.status).toBe(201);
        expect(addReview).not.toBeNull();
        review.edit_review_id = addReview.body._id;
        review.reply_review_id = addReview.body._id;
        review.edit_review.review_id = addReview.body._id;
        review.delete_review_id = addReview.body._id;
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/admin/addReview')
                .send(review.add_review)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/addReview')
                .send(review.add_review)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/admin/addReview')
                .send(review.add_review)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/addReview')
                .send(review.add_review)
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).post('/admin/addReview')
                .send(review.add_review);
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).post('/admin/addReview')
                .auth(token.admin, { type: "bearer" });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong employee pattern', async () => {
            const employeeIdError = await request(app).post('/admin/addReview')
                .send(review.add_review_error.employee_id)
                .auth(token.admin, { type: "bearer" });
            expect(employeeIdError.status).toBe(401);
        });
        it('with wrong review pattern', async () => {
            const reviewError = await request(app).post('/admin/addReview')
                .send(review.add_review_error.review)
                .auth(token.admin, { type: "bearer" });
            expect(reviewError.status).toBe(401);
        });
        it('with wrong email pattern', async () => {
            const emailError = await request(app).post('/admin/addReview')
                .send(review.add_review_error.email)
                .auth(token.admin, { type: "bearer" });
            expect(emailError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraFieldError = await request(app).post('/admin/addReview')
                .send({
                    email: review.add_review.email,
                    employee_id: review.add_review.employee_id,
                    review: review.add_review.review,
                    extraField: "extraField"
                })
                .auth(token.admin, { type: "bearer" });
            expect(extraFieldError.status).toBe(401);
        });
    });
    it('no add more than 3 review for employee of same user', async () => {
        const addReview2 = await request(app).post('/admin/addReview')
            .send(review.add_review)
            .auth(token.admin, { type: "bearer" });
        const addReview3 = await request(app).post('/admin/addReview')
            .send(review.add_review)
            .auth(token.admin, { type: "bearer" });
        const addReview4 = await request(app).post('/admin/addReview')
            .send(review.add_review)
            .auth(token.admin, { type: "bearer" });
        expect(addReview4.status).toBe(400);
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
        expect(editReview.status).toBe(200);
    });
    it("should run successfully without review field", async () => {
        const editReview = await request(app).patch('/admin/editReview')
            .send({
                "review_id": review.edit_review_id,
                "email": "usertest@1111.com",
            })
            .auth(token.admin, { type: "bearer" });
        console.log(editReview.error);
        expect(editReview.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/admin/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@1111.com",
                    "review": "testupdate1djsdcjsdkj"
                })
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@1111.com",
                    "review": "testupdate1djsdcjsdkj"
                })
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post('/admin/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@1111.com",
                    "review": "testupdate1djsdcjsdkj"
                })
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@1111.com",
                    "review": "testupdate1djsdcjsdkj"
                })
                .auth(token.admin, { type: "bearer" });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).patch('/admin/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@1111.com",
                    "review": "testupdate1djsdcjsdkj"
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).patch('/admin/editReview')
                .auth(token.admin, { type: "bearer" });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong review id', async () => {
            const reviewIdError = await request(app).patch('/admin/editReview')
                .send(review.edit_review_error.review_id)
                .auth(token.admin, { type: "bearer" });
            expect(reviewIdError.status).toBe(401);
        });
        it('with wrong email pattern', async () => {
            const emailError = await request(app).patch('/admin/editReview')
                .send(review.edit_review_error.email)
                .auth(token.admin, { type: "bearer" });
            expect(emailError.status).toBe(401);

        });
        it('with extra field', async () => {
            const extraError = await request(app).patch('/admin/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@1111.com",
                    "review": "testupdate1djsdcjsdkj",
                    "extra": "extra"
                })
                .auth(token.admin, { type: "bearer" });
            expect(extraError.status).toBe(401);
        });
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
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).post('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar"
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).post('/admin/replyAReview')
                .auth(token.admin, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong review id', async () => {
            const reviewIdError = await request(app).post('/admin/replyAReview')
                .send({
                    "review_id": "",
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(reviewIdError.status).toBe(401);
        });
        it('with wrong email pattern', async () => {
            const emailError = await request(app).post('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest",
                    "reply": "testreplyofTenChar"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(emailError.status).toBe(401);
        });
        it('wrong reply pattern', async () => {
            const replyError = await request(app).post('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": ""
                })
                .auth(token.admin, { type: 'bearer' });
            expect(replyError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraError = await request(app).post('/admin/replyAReview')
                .send({
                    "review_id": review.reply_review_id,
                    "email": "usertest@1111.com",
                    "reply": "testreplyofTenChar",
                    "extra": "extra"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(extraError.status).toBe(401);
        });
    });
    it('not take more than 1 reply for a review', async () => {
        const reply = await request(app).post('/admin/replyAReview')
            .send({
                "review_id": review.reply_review_id,
                "email": "usertest@1111.com",
                "reply": "testreplyofTenChar"
            })
            .auth(token.admin, { type: 'bearer' });
        expect(reply.status).toBe(400);
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
    });
    it("Should run if successfully if reply is not present", async () => {
        const editReply = await request(app).patch('/admin/editReply')
            .auth(token.admin, { type: 'bearer' })
            .send({
                "review_id": review.reply_review_id,
            });
        expect(editReply.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/admin/editReply')
                .auth(token.admin, { type: 'bearer' })
                .send({
                    "review_id": review.reply_review_id,
                    "reply": "updated edit review"
                });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/admin/editReply')
                .auth(token.admin, { type: 'bearer' })
                .send({
                    "review_id": review.reply_review_id,
                    "reply": "updated edit review"
                });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post('/admin/editReply')
                .auth(token.admin, { type: 'bearer' })
                .send({
                    "review_id": review.reply_review_id,
                    "reply": "updated edit review"
                });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/admin/editReply')
                .auth(token.admin, { type: 'bearer' })
                .send({
                    "review_id": review.reply_review_id,
                    "reply": "updated edit review"
                });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).post('/admin/editReply')
                .send({
                    "review_id": review.reply_review_id,
                    "reply": "updated edit review"
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).patch('/admin/editReply')
                .auth(token.admin, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong review id', async () => {
            const reviewIdError = await request(app).patch('/admin/editReply')
                .auth(token.admin, { type: 'bearer' })
                .send({
                    "review_id": "vdkkjs",
                    "reply": "updated edit review"
                });
            expect(reviewIdError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraError = await request(app).patch('/admin/editReply')
                .auth(token.admin, { type: 'bearer' })
                .send({
                    "review_id": review.reply_review_id,
                    "reply": "updated edit review",
                    "extra": "extra"
                });
            expect(extraError.status).toBe(401);
        });
    });
});

describe("GET /user/allEmployee", () => {
    it("should get all employee", async () => {
        const allEmployee = await request(app).get("/user/allEmployee")
            .auth(token.user, { type: 'bearer' });
        expect(allEmployee.status).toBe(200);
        expect(allEmployee.body).not.toBeNull();
    });
    describe("Not run with other request", () => {
        it("should not run on post", async () => {
            const response = await request(app).post("/user/allEmployee")
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/user/allEmployee")
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/user/allEmployee")
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete("/user/allEmployee")
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it('jwt error', async () => {
            const jwtError = await request(app).get("/user/allEmployee");
            expect(jwtError.status).toBe(403);
        });
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
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/user/oneEmployee')
                .send({
                    employee_id: employee.employee_id
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/user/oneEmployee')
                .send({
                    employee_id: employee.employee_id
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/user/oneEmployee')
                .send({
                    employee_id: employee.employee_id
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/user/oneEmployee')
                .send({
                    employee_id: employee.employee_id
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).post('/user/oneEmployee')
                .send({
                    employee_id: employee.employee_id
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).post('/user/oneEmployee')
                .auth(token.user, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong employee id', async () => {
            const employeeIdError = await request(app).post('/user/oneEmployee')
                .send({
                    employee_id: ""
                })
                .auth(token.user, { type: 'bearer' });
            expect(employeeIdError.status).toBe(401);
        });
        it('with extra data', async () => {
            const extraFieldError = await request(app).post('/user/oneEmployee')
                .send({
                    employee_id: employee.employee_id,
                    extra: "extra"
                })
                .auth(token.user, { type: 'bearer' });
            expect(extraFieldError.status).toBe(401);
        });
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
        expect(addReview.status).toBe(201);
        expect(addReview.body).not.toBeNull();
        review.edit_review_id = await addReview.body._id;
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).post('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": "test review from user "
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).post('/user/addReview')
                .auth(token.user, { type: "bearer" });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong employee id pattern', async () => {
            const employeeIdError = await request(app).post('/user/addReview')
                .send({
                    "employee_id": "",
                    "email": "usertest@222.com",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(employeeIdError.status).toBe(401);
        });
        it('with wrong review pattern', async () => {
            const reviewError = await request(app).post('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": ""
                })
                .auth(token.user, { type: "bearer" });
            expect(reviewError.status).toBe(401);
        });
        it('with wrong email pattern', async () => {
            const emailError = await request(app).post('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertescom",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(emailError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraFieldError = await request(app).post('/user/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "email": "usertest@222.com",
                    "review": "test review from user ",
                    extra: "extra"
                })
                .auth(token.user, { type: "bearer" });
            expect(extraFieldError.status).toBe(401);
        });
    });
    it('no add more than 3 review for employee of same user', async () => {
        const addReview2 = await request(app).post('/user/addReview')
            .send({
                "employee_id": employee.employee_id,
                "email": "usertest@222.com",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        const addReview3 = await request(app).post('/user/addReview')
            .send({
                "employee_id": employee.employee_id,
                "email": "usertest@222.com",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        const addReview4 = await request(app).post('/user/addReview')
            .send({
                "employee_id": employee.employee_id,
                "email": "usertest@222.com",
                "review": "test review from user "
            })
            .auth(token.user, { type: "bearer" });
        expect(addReview4.status).toBe(400);
    });
});

describe("PATCH /user/editReview", () => {

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
    it("should successfully edit without required edit fields", async () => {
        employee.edit_employee.employee_id = employee.employee_id;
        const editEmployee = await request(app).patch('/user/editReview')
            .send({
                "review_id": review.edit_review_id,
                "email": "usertest@222.com",
            })
            .auth(token.user, { type: "bearer" });
        expect(editEmployee.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/user/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@222.com",
                    "review": "this  is an updated review"
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/user/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@222.com",
                    "review": "this  is an updated review"
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post('/user/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@222.com",
                    "review": "this  is an updated review"
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/user/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@222.com",
                    "review": "this  is an updated review"
                })
                .auth(token.user, { type: "bearer" });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).patch('/user/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@222.com",
                    "review": "this  is an updated review"
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).patch('/user/editReview')
                .auth(token.user, { type: "bearer" });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong review id', async () => {
            const reviewIdError = await request(app).patch('/user/editReview')
                .send({
                    "review_id": "",
                    "email": "usertest@222.com",
                    "review": "this  is an updated review"
                })
                .auth(token.user, { type: "bearer" });
            expect(reviewIdError.status).toBe(401);
        });
        it('with wrong email pattern', async () => {
            const emailError = await request(app).patch('/user/editReview')
                .send({
                    "review_id": review.user_review_id,
                    "email": "sjdnsj",
                    "review": "this  is an updated review"
                })
                .auth(token.user, { type: "bearer" });
            expect(emailError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraError = await request(app).patch('/user/editReview')
                .send({
                    "review_id": review.edit_review_id,
                    "email": "usertest@222.com",
                    "review": "this  is an updated review",
                    "extra": "extra"
                })
                .auth(token.user, { type: "bearer" });
            expect(extraError.status).toBe(401);
        });
    });
});

describe("PATCH /user/editName", () => {
    it("should edit name", async () => {
        const editName = await request(app).patch('/user/editName')
            .send({
                "email": "usertest@222.com",
                "name": "updated name"
            })
            .auth(token.user, { type: 'bearer' });
        expect(editName.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/user/editName')
                .send({
                    "email": "usertest@222.com",
                    "name": "updated name"
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/user/editName')
                .send({
                    "email": "usertest@222.com",
                    "name": "updated name"
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post('/user/editName')
                .send({
                    "email": "usertest@222.com",
                    "name": "updated name"
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/user/editName')
                .send({
                    "email": "usertest@222.com",
                    "name": "updated name"
                })
                .auth(token.user, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).patch('/user/editName')
                .send({
                    "email": "usertest@222.com",
                    "name": "updated name"
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).patch('/user/editName')
                .auth(token.user, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong name pattern', async () => {
            const nameError = await request(app).patch('/user/editName')
                .send({
                    "email": "usertest.com",
                    "name": "c"
                })
                .auth(token.user, { type: 'bearer' });
            expect(nameError.status).toBe(401);
        });
        it('with wrong email pattern', async () => {
            const emailError = await request(app).patch('/user/editName')
                .send({
                    "email": "usertest.com",
                    "name": "updated name"
                })
                .auth(token.user, { type: 'bearer' });
            expect(emailError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraError = await request(app).patch('/user/editName')
                .send({
                    "email": "usertest@222.com",
                    "name": "updated name",
                    "extra": "extra"
                })
                .auth(token.user, { type: 'bearer' });
            expect(extraError.status).toBe(401);
        });
    });
});

describe("GET /allEmployee", () => {
    it("should get all employee", async () => {
        const allEmployee = await request(app).get("/allEmployee");
        expect(allEmployee.status).toBe(200);
        expect(allEmployee.body).not.toBeNull();
    });
    describe("Not run with other request", () => {
        it("should not run on post", async () => {
            const response = await request(app).post("/allEmployee");
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/allEmployee");
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/allEmployee");
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete("/allEmployee");
            expect(response.status).toBe(404);
        });
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
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get("/oneEmployee")
                .send({
                    "employee_id": employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/oneEmployee")
                .send({
                    "employee_id": employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/oneEmployee")
                .send({
                    "employee_id": employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete("/oneEmployee")
                .send({
                    "employee_id": employee.employee_id
                });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("with no data sending error", async () => {
            const jwtError = await request(app).post("/oneEmployee");
            expect(jwtError.status).toBe(401);
        });
        it('with wrong employee id', async () => {
            const employeeIdError = await request(app).post("/oneEmployee")
                .send({
                    employee_id: "djnsjks"
                });
            expect(employeeIdError.status).toBe(401);
        });
        it('with extra data', async () => {
            const extraFieldError = await request(app).post("/oneEmployee")
                .send({
                    employee_id: employee.employee_id,
                    extra: "extra"
                });
            expect(extraFieldError.status).toBe(401);
        });
    });
});

describe("POST /addReview", () => {
    it("should add review", async () => {
        const addReview = await request(app).post('/addReview')
            .send({
                "employee_id": employee.employee_id,
                "review": "test review from anonymous."
            });
        expect(addReview.status).toBe(201);
        expect(addReview.body).not.toBeNull();
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get('/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "review": "test review from anonymous."
                });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put('/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "review": "test review from anonymous."
                });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch('/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "review": "test review from anonymous."
                });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete('/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "review": "test review from anonymous."
                });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).post('/addReview');
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong employee id pattern', async () => {
            const employeeIdError = await request(app).post('/addReview')
                .send({
                    "employee_id": "",
                    "review": "test review from user "
                })
                .auth(token.user, { type: "bearer" });
            expect(employeeIdError.status).toBe(401);
        });
        it('with wrong review pattern', async () => {
            const reviewError = await request(app).post('/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "review": ""
                })
                .auth(token.user, { type: "bearer" });
            expect(reviewError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraFieldError = await request(app).post('/addReview')
                .send({
                    "employee_id": employee.employee_id,
                    "review": "test review from anonymous.",
                    "extra": "extra"
                });
            expect(extraFieldError.status).toBe(401);
        });
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
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get("/admin/delReview")
                .send({
                    "review_id": review.delete_review_id
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/admin/delReview")
                .send({
                    "review_id": review.delete_review_id
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/admin/delReview")
                .send({
                    "review_id": review.delete_review_id
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post("/admin/delReview")
                .send({
                    "review_id": review.delete_review_id
                })
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).delete("/admin/delReview")
                .send({
                    "review_id": review.delete_review_id
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).delete("/admin/delReview")
                .auth(token.admin, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong review id pattern', async () => {
            const reviewIdError = await request(app).delete("/admin/delReview")
                .send({
                    "review_id": "csldjvdv"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(reviewIdError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraFieldError = await request(app).delete("/admin/delReview")
                .send({
                    "review_id": review.delete_review_id,
                    "extra": "extra"
                })
                .auth(token.admin, { type: 'bearer' });
            expect(extraFieldError.status).toBe(401);
        });
    });
});

describe("GET /admin/allUsers", () => {
    it("should get all users", async () => {
        const allUsers = await request(app).get("/admin/allUsers")
            .auth(token.admin, { type: 'bearer' });
        expect(allUsers.status).toBe(200);
        expect(allUsers.body).not.toBeNull();
        user.login_data = await allUsers.body[1];
    });
    describe("Not run with other request", () => {
        it("should not run on post", async () => {
            const response = await request(app).post("/admin/allUsers")
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/admin/allUsers")
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/admin/allUsers")
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
        it("should not run on delete", async () => {
            const response = await request(app).delete("/admin/allUsers")
                .auth(token.admin, { type: 'bearer' });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it('jwt error', async () => {
            const jwtError = await request(app).get("/admin/allUsers");
            expect(jwtError.status).toBe(403);
        });
    });
});

describe("DELETE /admin/delUsers", () => {
    it("should delete a user", async () => {
        const deleteUser = await request(app).delete("/admin/delUsers")
            .auth(token.admin, { type: 'bearer' })
            .send({
                user_id: user.login_data._id
            });
        expect(deleteUser.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    user_id: user.login_data._id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    user_id: user.login_data._id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    user_id: user.login_data._id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    user_id: user.login_data._id
                });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).delete("/admin/delUsers")
                .send({
                    user_id: user.login_data._id
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).delete("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong user id pattern', async () => {
            const userIdError = await request(app).delete("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    user_id: "vknsdj"
                });
            expect(userIdError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraFieldError = await request(app).delete("/admin/delUsers")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    user_id: user.login_data._id,
                    extra: "extra"
                });
            expect(extraFieldError.status).toBe(401);
        });
    });
});

describe("DELETE /admin/delEmployee", () => {
    it("should delete employee", async () => {
        const deleteEmployee = await request(app).delete("/admin/delEmployee")
            .auth(token.admin, { type: 'bearer' })
            .send({
                employee_id: employee.employee_id
            });
        expect(deleteEmployee.status).toBe(200);
    });
    describe("Not run with other request", () => {
        it("should not run on get", async () => {
            const response = await request(app).get("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on put", async () => {
            const response = await request(app).put("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on patch", async () => {
            const response = await request(app).patch("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
        it("should not run on post", async () => {
            const response = await request(app).post("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    employee_id: employee.employee_id
                });
            expect(response.status).toBe(404);
        });
    });
    describe("wrong credentials", () => {
        it("Jwt error", async () => {
            const jwtError = await request(app).delete("/admin/delEmployee")
                .send({
                    employee_id: employee.employee_id
                });
            expect(jwtError.status).toBe(403);
        });
        it("with no data sending error", async () => {
            const noDataSendError = await request(app).delete("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' });
            expect(noDataSendError.status).toBe(401);
        });
        it('with wrong user id pattern', async () => {
            const userIdError = await request(app).delete("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    employee_id: "vknsdj"
                });
            expect(userIdError.status).toBe(401);
        });
        it('with extra field', async () => {
            const extraError = await request(app).delete("/admin/delEmployee")
                .auth(token.admin, { type: 'bearer' })
                .send({
                    employee_id: employee.employee_id,
                    extra: "extra"
                });
            expect(extraError.status).toBe(401);
        });
    });
});
