const common_service = require('../../services/commonService');
const user = require('../../model/user');
const employee = require('../../model/employee');
const review = require('../../model/review');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../../model/user');
jest.mock('../../model/employee');
jest.mock('../../model/review');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe("Common_service", () => {
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
        user.findOne.mockResolvedValue(mockedUser);
        jwt.sign.mockResolvedValue();
        const result = await common_service.login(adminData);

        expect(user.findOne).toHaveBeenCalledTimes(1);
        expect(user.findOne).toHaveBeenCalledWith({ email: adminData.email });
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({
            name: mockedUser.name,
            email: mockedUser.email,
            role: "admin",
        });
        //login admin test
        adminData.role = "user";
        mockedUser.role = "user";
        user.findOne.mockResolvedValue(mockedUser);
        jwt.sign.mockResolvedValue();
        const result2 = await common_service.login(adminData);

        expect(user.findOne).toHaveBeenCalledTimes(2);
        expect(user.findOne).toHaveBeenCalledWith({ email: adminData.email });
        expect(jwt.sign).toHaveBeenCalledTimes(2);
        expect(result2).toMatchObject({
            name: mockedUser.name,
            email: mockedUser.email,
            role: "user",
        });

        //error test
        user.findOne.mockResolvedValue();
        expect(common_service.login(adminData)).rejects.toThrow("login service error ::User not found");
        mockedUser.role = "";
        user.findOne.mockResolvedValue(mockedUser);
        expect(common_service.login(adminData)).rejects.toThrow("login service error ::Token not created :: ");


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
        user.findOne.mockResolvedValue(mockedUser);
        const result = await common_service.checkUser(data);
        expect(user.findOne).toHaveBeenCalledTimes(1);
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(result).toEqual(mockedUser);
        //check user errors
        user.findOne.mockResolvedValue();
        expect(common_service.checkUser(data)).rejects.toThrow("Check user service error ::User not found ::");
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
        employee.find.mockResolvedValue(mockEmployee);
        review.aggregate.mockResolvedValueOnce(mockReview[0])
            .mockResolvedValueOnce(mockReview[1]);
        const result = await common_service.allEmployee();
        //all employe
        expect(employee.find).toHaveBeenCalled();
        expect(review.aggregate).toHaveBeenCalledTimes(2);
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
        employee.find.mockRejectedValue(new Error('Database error'));
        await expect(common_service.allEmployee()).rejects
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

        employee.findById.mockResolvedValue(mockEmployee);
        review.aggregate.mockResolvedValue(mockReview);
        const result = await common_service.selectEmployee(data);
        //select employe
        expect(employee.findById).toHaveBeenCalled();
        expect(review.aggregate).toHaveBeenCalledTimes(1);
        expect(result).toEqual(
            {
                employee:mockEmployee,
                reviws: mockReview
            }
        );
        //select employe error
        employee.findById.mockResolvedValue();
        expect(common_service.selectEmployee(data)).rejects
            .toThrow("Select one employee service error ::Employee not exist ::");
    });
});