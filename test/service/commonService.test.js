const common_service = require('../../services/commonService');
const user = require('../../model/user');
const employe = require('../../model/employe');
const review = require('../../model/review');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../../model/user');
jest.mock('../../model/employe');
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
        let result = await common_service.Login(adminData);

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
        let result2 = await common_service.Login(adminData);

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
        expect(common_service.Login(adminData)).rejects.toThrow("login service error ::User not found");
        mockedUser.role = "";
        user.findOne.mockResolvedValue(mockedUser);
        expect(common_service.Login(adminData)).rejects.toThrow("login service error ::Token not created :: ");


    });

    it("checkUser function", async () => {
        let data = {
            email: "test@gmail.com"
        }
        let mockedUser = {
            _id: "1",
            name: "test",
            email: "test@gmail.com",
            password: "test@123",
            role: "admin",
            __v: "0"
        }
        //check user
        user.findOne.mockResolvedValue(mockedUser);
        let result = await common_service.CheckUser(data);
        expect(user.findOne).toHaveBeenCalledTimes(1);
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(result).toEqual(mockedUser);
        //check user errors
        user.findOne.mockResolvedValue();
        expect(common_service.CheckUser(data)).rejects.toThrow("login service error ::User not found ::");
    });

    it("All employe function", async () => {
        const mockEmploye = [
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
            { users: 2 },
            { users: 2 }
        ];
        employe.find.mockResolvedValue(mockEmploye);
        review.aggregate.mockResolvedValueOnce(mockReview[0])
            .mockResolvedValueOnce(mockReview[1]);
        let result = await common_service.AllEmploye();
        //all employe
        expect(employe.find).toHaveBeenCalled();
        expect(review.aggregate).toHaveBeenCalledTimes(2);
        expect(result).toEqual([
            {
                employee: mockEmploye[0],
                reviews: mockReview[0]
            },
            {
                employee: mockEmploye[1],
                reviews: mockReview[1]
            }
        ]);

        //error
        employe.find.mockRejectedValue(new Error('Database error'));
        await expect(common_service.AllEmploye()).rejects
            .toThrow('All employe service error ::Database error');

    });

    it("Select employe function", async () => {
        const mockEmploye = {
            _id: "1",
            name: 'test1',
            work_group: 'test1',
            position: 'test1'
        }
        const mockReview = [
            {
                _id: "111",
                user: "1",
                employe_id: "1",
                review: "test Review 1",
                reply: "test reply 1",
                created_at: "2024-06-27T22:37:11",
                updated_at: "2024-06-27T22:37:11"
            },
            {
                _id: "222",
                user: "anonymous",
                employe_id: "1",
                review: "test Review 2",
                created_at: "2024-06-27T22:37:11",
                updated_at: "2024-06-27T22:37:11"
            }
        ]
        let data={
            employe_id:"1"
        }

        employe.findById.mockResolvedValue(mockEmploye);
        review.aggregate.mockResolvedValue(mockReview);
        let result = await common_service.SelectEmploye(data);
        //select employe
        expect(employe.findById).toHaveBeenCalled();
        expect(review.aggregate).toHaveBeenCalledTimes(1);
        expect(result).toEqual(
            {
                employe:mockEmploye,
                reviws: mockReview
            }
        );
        //select employe error
        employe.findById.mockResolvedValue();
        expect(common_service.SelectEmploye(data)).rejects
            .toThrow("Select one Employee service error ::Employe not exist ::");
    });
});