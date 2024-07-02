const admin_service = require('../../services/adminService');
const bcrypt = require('bcrypt');
const employee = require('../../model/employee');
const user = require('../../model/user');
const review = require('../../model/review');

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

        employee.create.mockResolvedValue(employeeMock);
        employee.findOne.mockResolvedValue();
        const result = await admin_service.createEmployee(data);
        expect(employee.findOne).toHaveBeenCalled();
        expect(employee.create).toHaveBeenCalled();
        expect(employee.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(employeeMock);

        //create error test//
        employee.create.mockRejectedValue(new Error("Create Query Error:"));
        await expect(
            admin_service.createEmployee(data)
        ).rejects.toThrow("Create employee service error ::Create Query Error:");

        //findone error test//
        employee.findOne.mockResolvedValue(employeeMock);
        await expect(
            admin_service.createEmployee(data)
        ).rejects.toThrow("Create employee service error ::Employee Alredy Exist");

        employee.findOne.mockRejectedValue(new Error("Find One Error:"));
        await expect(
            admin_service.createEmployee(data)
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
        employee.findById.mockResolvedValue(findEmployeeMock);
        employee.findByIdAndUpdate.mockResolvedValue(findEmployeeMock);
        const result = await admin_service.updateEmployee(data);
        expect(employee.findById).toHaveBeenCalledTimes(1);
        expect(employee.findByIdAndUpdate).toHaveBeenCalled();
        expect(employee.findById).toHaveBeenLastCalledWith(data.employee_id);
        expect(employee.findByIdAndUpdate).toHaveBeenCalledWith(data.employee_id, findEmployeeMock);
        expect(result).toMatchObject(findEmployeeMock);

        //error update test//
        employee.findById.mockRejectedValueOnce(new Error("employee find error"));
        expect(admin_service.updateEmployee(data)).rejects.toThrow("Update employee service error ::employee find error");
        employee.findById.mockResolvedValue(findEmployeeMock);
        employee.findByIdAndUpdate.mockRejectedValue(new Error("updation Error"));
        expect(admin_service.updateEmployee(data)).rejects.toThrow("Update employee service error ::updation Error");
        employee.findById.mockResolvedValue(null);
        expect(admin_service.updateEmployee(data)).rejects.toThrow("Update employee service error ::Employee not exist ::");
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
        employee.findById.mockResolvedValue(mockEmployee);
        review.find.mockResolvedValue(mockReviews);
        review.deleteMany.mockResolvedValue(mockEmployee)
        const filterSpy = jest.spyOn(Array.prototype, "filter");


        //delete employe
        const data = { employee_id: "1" };
        const result = await admin_service.deleteEmployee(data);
        expect(employee.findById).toHaveBeenCalled();
        expect(employee.findById).toHaveBeenCalledWith(data.employee_id);
        expect(filterSpy).toHaveBeenCalledTimes(3);
        // expect(user.findByIdAndUpdate).toHaveBeenCalled();
        expect(review.deleteMany).toHaveBeenCalledTimes(2);
        expect(employee.findByIdAndDelete).toHaveBeenCalledTimes(1);

        //delete employe error
        employee.findById.mockResolvedValue(null);
        expect(admin_service.deleteEmployee(data)).rejects.toThrow("Delete employee service error ::Employee not exist :: ");
        employee.findById.mockResolvedValue(employee);
        review.find.mockRejectedValue(new Error("Review not find"));
        expect(admin_service.deleteEmployee(data)).rejects.toThrow("Delete employee service error ::Review not find");

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
        user.find.mockResolvedValue([]);
        const bcryptSpy = jest.spyOn(bcrypt , 'hash');
        await admin_service.adminCreation(data);
        //adminCreat
        expect(user.find).toHaveBeenCalledTimes(1);
        expect(user.find).toHaveBeenCalledWith({role:"admin"});
        expect(user.create).toHaveBeenCalledTimes(1);
        //admin create error
        user.find.mockResolvedValue([mockUsers[2]]);
        expect(admin_service.adminCreation(data)).rejects.toThrow("Admin creation service error ::Admin already exist");
    });
});