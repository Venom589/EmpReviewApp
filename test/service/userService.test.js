const user_service = require('../../services/userService');
const User = require('../../model/user');
const Review = require('../../model/review');
const Employee = require('../../model/employee');

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
        User.find.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUsers)
        });
        const result = await user_service.allUsers();
        //all users
        expect(User.find).toHaveBeenCalled();
        expect(User.find().select).toHaveBeenCalled();
        expect(User.find().select).toHaveBeenCalledWith("_id name email role reviewed");
        expect(result).toEqual(mockUsers);
        //all users error
        User.find.mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error("Database error"))
        });
        await expect(user_service.allUsers()).rejects.toThrow("All user service Error ::Database error");

    });
    it("Delete User test", async () => {
        const mockUser = {
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
        User.findById.mockResolvedValue(mockUser);
        Review.deleteMany.mockResolvedValue();
        User.findByIdAndDelete.mockResolvedValue();
        await user_service.deleteUser(data);
        //delete user
        expect(User.findById).toHaveBeenCalled();
        expect(User.findById).toHaveBeenCalledWith(data.user_id);
        expect(User.findByIdAndDelete).toHaveBeenCalled();
        mockUser.reviewed = null;
        User.findById.mockResolvedValue(mockUser);
        await user_service.deleteUser(data);
        expect(User.findById).toHaveBeenCalledTimes(2);
        expect(Review.deleteMany).not.toHaveBeenCalledTimes(2);
        expect(User.findByIdAndDelete).toHaveBeenCalledTimes(2);
        //delete user error
        User.findById.mockResolvedValue();
        await expect(user_service.deleteUser(data)).rejects
            .toThrow("Delete user service Error ::User not found");
        User.findById.mockResolvedValueOnce({
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "admin",
            reviewed: []
        });
        await expect(user_service.deleteUser(data)).rejects
            .toThrow("Delete user service Error ::Cannot delete admin user");
        User.findByIdAndDelete.mockRejectedValue(new Error("Data not deleted"));
        User.findById.mockResolvedValue(mockUser);
        await expect(user_service.deleteUser(data)).rejects
            .toThrow("Delete user service Error ::Data not deleted");

    });
    it("Change Name test", async () => {
        const mockUser = {
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
        User.findOne.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockResolvedValue();
        await user_service.changeName(data);
        //change name
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(User.findByIdAndUpdate).toHaveBeenCalled();
        await user_service.changeName({ email: "test1@xyz.com" });
        expect(User.findOne).toHaveBeenCalledTimes(2);
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(User.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //change name error
        User.findOne.mockResolvedValue();
        expect(user_service.changeName(data)).rejects
            .toThrow("Change name service error ::User not found :: ");
        User.findOne.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockRejectedValue(new Error("Data not update"));
        expect(user_service.changeName(data)).rejects
            .toThrow("Change name service error ::Data not update");
    });
    it("Add Review test", async () => {
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
            review: "test Review"
        }
        User.findOne.mockResolvedValue(mockUser);
        Employee.findById.mockResolvedValue(mockEmployee);
        Review.find.mockResolvedValue([]);
        User.findByIdAndUpdate.mockResolvedValue();
        //add review
        await user_service.addReview(data);
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(Employee.findById).toHaveBeenCalled();
        expect(Employee.findById).toHaveBeenCalledWith(data.employee_id);
        expect(Review.find).toHaveBeenCalled();
        expect(User.findByIdAndUpdate).toHaveBeenCalled();
        expect(Review.create).toHaveBeenCalled();

        Review.find.mockResolvedValue(mockReviews);
        await user_service.addReview(data);
        expect(User.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //add review error
        User.findOne.mockResolvedValueOnce();
        await expect(user_service.addReview(data)).rejects
            .toThrow("Add review service error ::User not found :: ");
        Employee.findById.mockResolvedValueOnce();
        await expect(user_service.addReview(data)).rejects
            .toThrow("Add review service error ::Employee not found :: ");
        Review.find.mockResolvedValueOnce(errorMockReview);
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

        User.findOne.mockResolvedValue(mockUser)
        Review.findOne.mockResolvedValue(mockReview);
        await user_service.editReview(data);
        //edit review
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(Review.findOne).toHaveBeenCalled();
        expect(Review.findByIdAndUpdate).toHaveBeenCalled();
        await user_service.editReview({
            email: "test1@xyz.com",
            review_id: "1",
        });
        expect(Review.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //Edit review error
        User.findOne.mockResolvedValueOnce();
        await expect(user_service.editReview(data)).rejects
            .toThrow("Edit review service error ::User not found :: ");
        Review.findOne.mockResolvedValueOnce();
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
        expect(User.create).toHaveBeenCalled();
        //user creation error
        User.create.mockRejectedValueOnce(new Error("User creation error"));
        expect(user_service.userCreation(data)).rejects
            .toThrow("User creation service error ::User creation error");
    });
});