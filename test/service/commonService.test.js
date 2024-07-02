const CommonService = require('../../services/commonService');
const User = require('../../model/user');
const Employee = require('../../model/employee');
const Review = require('../../model/review');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../../model/user');
jest.mock('../../model/employee');
jest.mock('../../model/review');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe("CommonService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Login function", async () => {
        let adminData = {
            email: "test@gmail.com",
            password: "test@123",
            role: "admin"
        }
        let mockedUser = {
            _id: "1",
            name: "test",
            email: "test@gmail.com",
            password: "test@123",
            role: "admin",
            __v: "0"
        }
        //login user test
        User.findOne.mockResolvedValue(mockedUser);
        jwt.sign.mockResolvedValue();
        const result = await CommonService.login(adminData);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ email: adminData.email });
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            name: mockedUser.name,
            email: mockedUser.email,
            role: "admin",
        });
        //login admin test
        adminData.role = "user";
        mockedUser.role = "user";
        User.findOne.mockResolvedValue(mockedUser);
        jwt.sign.mockResolvedValue();
        const result2 = await CommonService.login(adminData);

        expect(User.findOne).toHaveBeenCalledTimes(2);
        expect(User.findOne).toHaveBeenCalledWith({ email: adminData.email });
        expect(jwt.sign).toHaveBeenCalledTimes(2);
        expect(result2).toMatchObject({
            name: mockedUser.name,
            email: mockedUser.email,
            role: "user",
        });

        //error test
        User.findOne.mockResolvedValue();
        expect(CommonService.login(adminData)).rejects.toThrow("login service error ::User not found");
        mockedUser.role = "";
        User.findOne.mockResolvedValue(mockedUser);
        expect(CommonService.login(adminData)).rejects.toThrow("login service error ::Token not created :: ");


    });

    it("checkUser function", async () => {
        const data = {
            email: "test@gmail.com"
        }
        const mockedUser = {
            _id: "1",
            name: "test",
            email: "test@gmail.com",
            password: "test@123",
            role: "admin",
            __v: "0"
        }
        //check user
        User.findOne.mockResolvedValue(mockedUser);
        const result = await CommonService.checkUser(data);
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(result).toEqual(mockedUser);
        //check user errors
        User.findOne.mockResolvedValue();
        expect(CommonService.checkUser(data)).rejects.toThrow("Check user service error ::User not found ::");
    });

    it("All employee function", async () => {
        const mockEmployee = [
            {
                _id: "1",
                name: 'test1',
                work_group: 'test1',
                position: 'test1'
            },
            {
                _id: "2",
                name: 'test2',
                work_group: 'test2',
                position: 'test2'
            },
        ];

        const mockReview = [
            { count: 2 },
            { count: 2 }
        ];
        Employee.find.mockResolvedValue(mockEmployee);
        Review.aggregate.mockResolvedValueOnce(mockReview[0])
            .mockResolvedValueOnce(mockReview[1]);
        const result = await CommonService.allEmployee();
        //all employee
        expect(Employee.find).toHaveBeenCalled();
        expect(Review.aggregate).toHaveBeenCalledTimes(2);
        expect(result).toEqual([
            {
                employee: mockEmployee[0],
                reviews: mockReview[0]
            },
            {
                employee: mockEmployee[1],
                reviews: mockReview[1]
            }
        ]);

        //error
        Employee.find.mockRejectedValue(new Error('Database error'));
        await expect(CommonService.allEmployee()).rejects
            .toThrow('All employee service error ::Database error');

    });

    it("Select employee function", async () => {
        const mockEmployee = {
            _id: "1",
            name: 'test1',
            work_group: 'test1',
            position: 'test1'
        }
        const mockReview = [
            {
                _id: "111",
                user: "1",
                employee_id: "1",
                review: "test Review 1",
                reply: "test reply 1",
                created_at: "2024-06-27T22:37:11",
                updated_at: "2024-06-27T22:37:11"
            },
            {
                _id: "222",
                user: "anonymous",
                employee_id: "1",
                review: "test Review 2",
                created_at: "2024-06-27T22:37:11",
                updated_at: "2024-06-27T22:37:11"
            }
        ]
        const data={
            employee_id:"1"
        }

        Employee.findById.mockResolvedValue(mockEmployee);
        Review.aggregate.mockResolvedValue(mockReview);
        const result = await CommonService.selectEmployee(data);
        //select employee
        expect(Employee.findById).toHaveBeenCalled();
        expect(Review.aggregate).toHaveBeenCalledTimes(1);
        expect(result).toEqual(
            {
                employee:mockEmployee,
                review: mockReview
            }
        );
        //select employee error
        Employee.findById.mockResolvedValue();
        expect(CommonService.selectEmployee(data)).rejects
            .toThrow("Select one employee service error ::Employee not exist ::");
    });
});