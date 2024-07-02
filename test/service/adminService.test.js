const AdminService = require('../../services/adminService');
const bcrypt = require('bcrypt');
const Employee = require('../../model/employee');
const User = require('../../model/user');
const Review = require('../../model/review');

jest.mock('../../model/employee');
jest.mock('../../model/user');
jest.mock('../../model/review');

describe('Admin service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("employee creation test", async () => {
        const employeeMock = {
            _id: "1",
            name: "x",
            work_group: "x",
            position: "x",
            __v: "0"
        }
        const data = { name: "x", work_group: "x", position: "x" };
        //create test//

        Employee.create.mockResolvedValue(employeeMock);
        Employee.findOne.mockResolvedValue();
        const result = await AdminService.createEmployee(data);
        expect(Employee.findOne).toHaveBeenCalled();
        expect(Employee.create).toHaveBeenCalled();
        expect(Employee.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(employeeMock);

        //create error test//
        Employee.create.mockRejectedValue(new Error("Create Query Error:"));
        await expect(
            AdminService.createEmployee(data)
        ).rejects.toThrow("Create employee service error ::Create Query Error:");

        //findone error test//
        Employee.findOne.mockResolvedValue(employeeMock);
        await expect(
            AdminService.createEmployee(data)
        ).rejects.toThrow("Create employee service error ::Employee already Exist");

        Employee.findOne.mockRejectedValue(new Error("Find One Error:"));
        await expect(
            AdminService.createEmployee(data)
        ).rejects.toThrow("Create employee service error ::Find One Error:");
    });

    it("employee Update test", async () => {
        const findEmployeeMock = {
            _id: "1",
            name: "x",
            work_group: "x",
            position: "x",
            __v: "0"
        }
        const data = {
            employee_id: "1",
            name: "testNew",
            work_group: "testNew",
            position: ""
        }
        //update test//
        Employee.findById.mockResolvedValue(findEmployeeMock);
        Employee.findByIdAndUpdate.mockResolvedValue(findEmployeeMock);
        const result = await AdminService.updateEmployee(data);
        expect(Employee.findById).toHaveBeenCalledTimes(1);
        expect(Employee.findByIdAndUpdate).toHaveBeenCalled();
        expect(Employee.findById).toHaveBeenLastCalledWith(data.employee_id);
        expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(data.employee_id, findEmployeeMock);

        //error update test//
        Employee.findById.mockRejectedValueOnce(new Error("employee find error"));
        expect(AdminService.updateEmployee(data)).rejects.toThrow("Update employee service error ::employee find error");
        Employee.findById.mockResolvedValue(findEmployeeMock);
        Employee.findByIdAndUpdate.mockRejectedValue(new Error("updation Error"));
        expect(AdminService.updateEmployee(data)).rejects.toThrow("Update employee service error ::updation Error");
        Employee.findById.mockResolvedValue(null);
        expect(AdminService.updateEmployee(data)).rejects.toThrow("Update employee service error ::Employee not exist ::");
    });

    it("employee deletion test", async () => {
        const mockEmployee = {
            _id: "1",
            name: "x",
            work_group: "x",
            position: "x",
            __v: "0"
        }
        const mockReviews = [
            {
                _id: "1",
                __v: "0",
                user: "anonymous",
                employee_id: "1",
                review: "review1",
                reply: "reply1"
            },
            {
                _id: "2",
                __v: "0",
                user: "1",
                employee_id: "1",
                review: "review2",
                reply: "reply3"
            },
            {
                _id: "3",
                __v: "0",
                user: "2",
                employee_id: "1",
                review: "review3",
                reply: "reply3"
            },
        ];
        Employee.findById.mockResolvedValue(mockEmployee);
        Review.find.mockResolvedValue(mockReviews);
        Review.deleteMany.mockResolvedValue(mockEmployee)
        const filterSpy = jest.spyOn(Array.prototype, "filter");


        //delete employee
        const data = { employee_id: "1" };
        await AdminService.deleteEmployee(data);
        expect(Employee.findById).toHaveBeenCalled();
        expect(Employee.findById).toHaveBeenCalledWith(data.employee_id);
        expect(filterSpy).toHaveBeenCalledTimes(3);
        // expect(user.findByIdAndUpdate).toHaveBeenCalled();
        expect(Review.deleteMany).toHaveBeenCalledTimes(2);
        expect(Employee.findByIdAndDelete).toHaveBeenCalledTimes(1);

        //delete employee error
        Employee.findById.mockResolvedValue(null);
        expect(AdminService.deleteEmployee(data)).rejects.toThrow("Delete employee service error ::Employee not exist :: ");
        Employee.findById.mockResolvedValue(mockEmployee);
        Review.find.mockRejectedValue(new Error("Review not find"));
        expect(AdminService.deleteEmployee(data)).rejects.toThrow("Delete employee service error ::Review not find");

    });

    it("admin creation test", async () => {
        const mockUsers = [
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
        User.find.mockResolvedValue([]);
        const bcryptSpy = jest.spyOn(bcrypt , 'hash');
        await AdminService.adminCreation(data);
        //adminCreate
        expect(User.find).toHaveBeenCalledTimes(1);
        expect(User.find).toHaveBeenCalledWith({role:"admin"});
        expect(User.create).toHaveBeenCalledTimes(1);
        //admin create error
        User.find.mockResolvedValue([mockUsers[2]]);
        expect(AdminService.adminCreation(data)).rejects.toThrow("Admin creation service error ::Admin already exist");
    });
});