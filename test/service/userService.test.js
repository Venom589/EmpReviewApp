const user_service = require('../../services/userService');
const user = require('../../model/user');
const review = require('../../model/review');
const employee = require('../../model/employee');

jest.mock('../../model/user');
jest.mock('../../model/review');
jest.mock('../../model/employee');

describe('User service ', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("All Users test", async () => {
        const mockUsers = [
            {
                _id: "1",
                name: "test1",
                email: "test1@xyz.com",
                role: "user",
                reviewed: [
                    {
                        employee_id: "1",
                        _id: "1"
                    },
                    {
                        employee_id: "2",
                        _id: "2"
                    }
                ]
            },
            {
                _id: "2",
                name: "test2",
                email: "test2@xyz.com",
                role: "admin",
                reviewed: [
                    {
                        employee_id: "1",
                        _id: "1"
                    },
                    {
                        employee_id: "2",
                        _id: "2"
                    }
                ]
            }
        ]
        user.find.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUsers)
        });
        const result = await user_service.allUsers();
        //all users
        expect(user.find).toHaveBeenCalled();
        expect(user.find().select).toHaveBeenCalled();
        expect(user.find().select).toHaveBeenCalledWith("_id name email role reviewed");
        expect(result).toEqual(mockUsers);
        //all users error
        user.find.mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error("Database error"))
        });
        await expect(user_service.allUsers()).rejects.toThrow("All user service Error ::Database error");

    });
    it("Delete User test", async () => {
        const mockuser = {
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "user",
            reviewed: []
        }
        const data = {
            user_id: "1"
        }
        user.findById.mockResolvedValue(mockuser);
        review.deleteMany.mockResolvedValue();
        user.findByIdAndDelete.mockResolvedValue();
        await user_service.deleteUser(data);
        //delete user
        expect(user.findById).toHaveBeenCalled();
        expect(user.findById).toHaveBeenCalledWith(data.user_id);
        expect(user.findByIdAndDelete).toHaveBeenCalled();
        mockuser.reviewed = null;
        user.findById.mockResolvedValue(mockuser);
        await user_service.deleteUser(data);
        expect(user.findById).toHaveBeenCalledTimes(2);
        expect(review.deleteMany).not.toHaveBeenCalledTimes(2);
        expect(user.findByIdAndDelete).toHaveBeenCalledTimes(2);
        //delete user error
        user.findById.mockResolvedValue();
        await expect(user_service.deleteUser(data)).rejects
            .toThrow("Delete user service Error ::User not found");
        user.findById.mockResolvedValueOnce({
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "admin",
            reviewed: []
        });
        await expect(user_service.deleteUser(data)).rejects
            .toThrow("Delete user service Error ::Cannot delete admin user");
        user.findByIdAndDelete.mockRejectedValue(new Error("Data not deleted"));
        user.findById.mockResolvedValue(mockuser);
        await expect(user_service.deleteUser(data)).rejects
            .toThrow("Delete user service Error ::Data not deleted");

    });
    it("Change Name test", async () => {
        const mockuser = {
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "user",
            reviewed: []
        }
        let data = {
            name: "test",
            email: "test1@xyz.com"
        }
        user.findOne.mockResolvedValue(mockuser);
        user.findByIdAndUpdate.mockResolvedValue();
        await user_service.changeName(data);
        //change name
        expect(user.findOne).toHaveBeenCalled();
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(user.findByIdAndUpdate).toHaveBeenCalled();
        await user_service.changeName({ email: "test1@xyz.com" });
        expect(user.findOne).toHaveBeenCalledTimes(2);
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(user.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //change name error
        user.findOne.mockResolvedValue();
        expect(user_service.changeName(data)).rejects
            .toThrow("Change name service error ::User not found :: ");
        user.findOne.mockResolvedValue(mockuser);
        user.findByIdAndUpdate.mockRejectedValue(new Error("Data not update"));
        expect(user_service.changeName(data)).rejects
            .toThrow("Change name service error ::Data not update");
    });
    it("Add Review test", async () => {
        const mockuser = {
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "user",
            reviewed: [
                {
                    employee_id: "1",
                    _id: "01"
                },
                {
                    employee_id: "2",
                    _id: "02"
                },
            ],
            __v: "0"
        }
        const mockEmployee = {
            _id: "1",
            name: 'test1',
            work_group: 'test1',
            position: 'test1',
            __v: "0"
        }
        const mockReviews = [
            {
                _id: "1",
                user: "1",
                employee_id: "1",
                review: "Test Review",
                reply: "Test Reply",
                __v: "0"
            }
        ]
        const errorMockReview = [
            {
                _id: "1",
                user: "1",
                employee_id: "1",
                review: "Test Review1",
                reply: "Test Reply1",
                __v: "0"
            },
            {
                _id: "2",
                user: "1",
                employee_id: "1",
                review: "Test Review2",
                reply: "Test Reply2",
                __v: "0"
            },
            {
                _id: "3",
                user: "1",
                employee_id: "1",
                review: "Test Review3",
                reply: "Test Reply3",
                __v: "0"
            }
        ]
        const data = {
            email: "test1@xyz.com",
            employee_id: "1",
            reivew: "test Review"
        }
        user.findOne.mockResolvedValue(mockuser);
        employee.findById.mockResolvedValue(mockEmployee);
        review.find.mockResolvedValue([]);
        user.findByIdAndUpdate.mockResolvedValue();
        //add review
        await user_service.addReview(data);
        expect(user.findOne).toHaveBeenCalled();
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(employee.findById).toHaveBeenCalled();
        expect(employee.findById).toHaveBeenCalledWith(data.employee_id);
        expect(review.find).toHaveBeenCalled();
        expect(user.findByIdAndUpdate).toHaveBeenCalled();
        expect(review.create).toHaveBeenCalled();

        review.find.mockResolvedValue(mockReviews);
        await user_service.addReview(data);
        expect(user.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //add review error
        user.findOne.mockResolvedValueOnce();
        await expect(user_service.addReview(data)).rejects
            .toThrow("Add review service error ::User not found :: ");
        employee.findById.mockResolvedValueOnce();
        await expect(user_service.addReview(data)).rejects
            .toThrow("Add review service error ::Employee not found :: ");
        review.find.mockResolvedValueOnce(errorMockReview);
        await expect(user_service.addReview(data)).rejects
            .toThrow("Add review service error ::you have already review 3 time you cannot review now.");
    });
    it("Edit Review test", async () => {
        const mockUser = {
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "user",
            reviewed: [
                {
                    employee_id: "1",
                    _id: "01"
                },
                {
                    employee_id: "2",
                    _id: "02"
                },
            ],
            __v: "0"
        }
        const mockReview = {
            _id: "1",
            user: "1",
            employee_id: "1",
            review: "Test Review",
            reply: "Test Reply",
            __v: "0"
        }
        const data = {
            email: "test1@xyz.com",
            review_id: "1",
            review: "the edit test"
        }

        user.findOne.mockResolvedValue(mockUser)
        review.findOne.mockResolvedValue(mockReview);
        await user_service.editReview(data);
        //edit review
        expect(user.findOne).toHaveBeenCalled();
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(review.findOne).toHaveBeenCalled();
        expect(review.findByIdAndUpdate).toHaveBeenCalled();
        await user_service.editReview({
            email: "test1@xyz.com",
            review_id: "1",
        });
        expect(review.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //Edit review error
        user.findOne.mockResolvedValueOnce();
        await expect(user_service.editReview(data)).rejects
            .toThrow("Edit review service error ::User not found :: ");
        review.findOne.mockResolvedValueOnce();
        await expect(user_service.editReview(data)).rejects
            .toThrow("Edit review service error ::Review not found :: ");
    });
    it("User Creation test", async () => {
        let data = {
            name: "test",
            email: "test@123.com",
            password: "Test@123",
            role: "user",
        }
        await user_service.userCreation(data);
        //user creation
        expect(user.create).toHaveBeenCalled();
        //user creation error
        user.create.mockRejectedValueOnce(new Error("User creation error"));
        expect(user_service.userCreation(data)).rejects
            .toThrow("User creation service error ::User creation error");
    });
});