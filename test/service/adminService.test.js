const admin_service = require('../../services/adminService');
const bcrypt = require('bcrypt');
const employe = require('../../model/employe');
const user = require('../../model/user');
const review = require('../../model/review');

jest.mock('../../model/employe');
jest.mock('../../model/user');
jest.mock('../../model/review');

describe('Admin service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("employee creation test", async () => {
        let employeMock = {
            _id: "1",
            name: "x",
            work_group: "x",
            position: "x",
            __v: "0"
        }
        let data = { name: "x", work_group: "x", position: "x" };
        //create test//

        employe.create.mockResolvedValue(employeMock);
        employe.findOne.mockResolvedValue();
        const result = await admin_service.CreateEmploye(data);
        expect(employe.findOne).toHaveBeenCalled();
        expect(employe.create).toHaveBeenCalled();
        expect(employe.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(employeMock);

        //create error test//
        employe.create.mockRejectedValue(new Error("Create Query Error:"));
        await expect(
            admin_service.CreateEmploye(data)
        ).rejects.toThrow("Create employe service error ::Create Query Error:");

        //findone error test//
        employe.findOne.mockResolvedValue(employeMock);
        await expect(
            admin_service.CreateEmploye(data)
        ).rejects.toThrow("Create employe service error ::Employee Alredy Exist");

        employe.findOne.mockRejectedValue(new Error("Find One Error:"));
        await expect(
            admin_service.CreateEmploye(data)
        ).rejects.toThrow("Create employe service error ::Find One Error:");
    });

    it("employee Update test", async () => {
        let findEmployeMock = {
            _id: "1",
            name: "x",
            work_group: "x",
            position: "x",
            __v: "0"
        }
        let data = {
            employe_id: "1",
            name: "testNew",
            work_group: "testNew",
            position: ""
        }
        //update test//
        employe.findById.mockResolvedValue(findEmployeMock);
        employe.findByIdAndUpdate.mockResolvedValue(findEmployeMock);
        const result = await admin_service.UpdateEmploye(data);
        expect(employe.findById).toHaveBeenCalled();
        expect(employe.findByIdAndUpdate).toHaveBeenCalled();
        expect(employe.findById).toHaveBeenCalledWith(data.employe_id);
        expect(employe.findByIdAndUpdate).toHaveBeenCalledWith(data.employe_id, findEmployeMock);
        expect(result).toMatchObject(findEmployeMock);

        //error update test//
        employe.findById.mockRejectedValue(new Error("employe find error"));
        expect(admin_service.UpdateEmploye(data)).rejects.toThrow("Update employe service error ::employe find error");
        employe.findById.mockResolvedValue(findEmployeMock);
        employe.findByIdAndUpdate.mockRejectedValue(new Error("updation Error"));
        expect(admin_service.UpdateEmploye(data)).rejects.toThrow("Update employe service error ::updation Error");
        employe.findById.mockResolvedValue(null);
        expect(admin_service.UpdateEmploye(data)).rejects.toThrow("Update employe service error ::Employe not exist ::");
    });

    it("employee deletion test", async () => {
        let employee = {
            _id: "1",
            name: "x",
            work_group: "x",
            position: "x",
            __v: "0"
        }
        let reviews = [
            {
                _id: "1",
                __v: "0",
                user: "anonymous",
                employe_id: "1",
                review: "review1",
                reply: "reply1"
            },
            {
                _id: "2",
                __v: "0",
                user: "1",
                employe_id: "1",
                review: "review2",
                reply: "reply3"
            },
            {
                _id: "3",
                __v: "0",
                user: "2",
                employe_id: "1",
                review: "review3",
                reply: "reply3"
            },
        ];
        let users = [
            {
                _id: '1',
                __v: "0",
                name: "D",
                email: "D@123.com",
                password: "Dtest@123",
                reviewed: [
                    { Employe: "1" }
                ],
                role: "admin"
            },
            {
                _id: '2',
                __v: "0",
                name: "f",
                email: "f@123.com",
                password: "ftest@123",
                reviewed: [
                    { Employe: "1" }
                ],
                role: "user"
            },
        ]
        employe.findById.mockResolvedValue(employee);
        review.find.mockResolvedValue(reviews);
        review.deleteMany.mockResolvedValue(employee)
        let filterSpy = jest.spyOn(Array.prototype, "filter");


        //delete employe
        let data = { employe_id: "1" };
        let result = await admin_service.DeleteEmploye(data);
        expect(employe.findById).toHaveBeenCalled();
        expect(employe.findById).toHaveBeenCalledWith(data.employe_id);
        expect(filterSpy).toHaveBeenCalledTimes(3);
        // expect(user.findByIdAndUpdate).toHaveBeenCalled();
        expect(review.deleteMany).toHaveBeenCalledTimes(2);
        expect(employe.findByIdAndDelete).toHaveBeenCalledTimes(1);

        //delete employe error
        employe.findById.mockResolvedValue(null);
        expect(admin_service.DeleteEmploye(data)).rejects.toThrow("Delete Employee service error ::Employe not exist :: ");
        employe.findById.mockResolvedValue(employee);
        review.find.mockRejectedValue(new Error("Review not find"));
        expect(admin_service.DeleteEmploye(data)).rejects.toThrow("Delete Employee service error ::Review not find");

    });

    it("admin creation test", async () => {
        let users = [
            {   
                _id:"1",
                name: "test1",
                email: "test@gmail.com",
                password: "Test@1234",
                role: "user",
                __v:"0"
            },
            {
                _id:"2",
                name: "test2",
                email: "test2@gmail.com",
                password: "Test@1234",
                role: "user",
                __v:"0"
            },
            {
                _id:"3",
                name: "test3",
                email: "test3@gmail.com",
                password: "Test@1234",
                role: "admin",
                __v:"0"
            }
        ];
        let data = {
            name: "test3",
            email: "test3@gmail.com",
            password: "Test@1234",
            role: "admin",
        };
        user.find.mockResolvedValue([]);
        let bcryptSpy = jest.spyOn(bcrypt , 'hash');
        await admin_service.AdminCreation(data);
        //adminCreat
        expect(user.find).toHaveBeenCalledTimes(1);
        expect(user.find).toHaveBeenCalledWith({role:"admin"});
        expect(user.create).toHaveBeenCalledTimes(1);
        //admin create error
        user.find.mockResolvedValue([users[2]]);
        expect(admin_service.AdminCreation(data)).rejects.toThrow("Admin Creation service error ::Admin already exist");
    });
});