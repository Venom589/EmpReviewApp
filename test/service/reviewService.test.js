const review_service = require('../../services/reviewService');
const User = require('../../model/user');
const Review = require('../../model/review');
const Employee = require('../../model/employee');

jest.mock('../../model/user');
jest.mock('../../model/review');
jest.mock('../../model/employee');

describe("Review service test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Add review function", async () => {
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
            reivew: "test Review"
        }
        User.findOne.mockResolvedValue(mockUser);
        Employee.findOne.mockResolvedValue(mockEmployee);
        Review.find.mockResolvedValue([]);
        User.findByIdAndUpdate.mockResolvedValue();
        //add review
        const result = await review_service.addReview(data);
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(Employee.findOne).toHaveBeenCalled();
        expect(Employee.findOne).toHaveBeenCalledWith({ _id: data.employee_id });
        expect(Review.find).toHaveBeenCalled();
        expect(User.findByIdAndUpdate).toHaveBeenCalled();
        expect(Review.create).toHaveBeenCalled();

        Review.find.mockResolvedValue(mockReviews);
        const result2 = await review_service.addReview(data);
        expect(User.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //add review error
        User.findOne.mockResolvedValueOnce();
        await expect(review_service.addReview(data)).rejects
            .toThrow("Add review service error ::User not found :: ");
        Employee.findOne.mockResolvedValueOnce();
        await expect(review_service.addReview(data)).rejects
            .toThrow("Add review service error ::Employee not found :: ");
        Review.find.mockResolvedValueOnce(errorMockReview);
        await expect(review_service.addReview(data)).rejects
            .toThrow("Add review service error ::you have already review 3 time you cannot review now.");

    });
    it("Edit review function", async () => {
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
            review: "test update"
        }
        User.findOne.mockResolvedValue(mockUser);
        Review.findOne.mockResolvedValue(mockReview);
        Review.findByIdAndUpdate.mockResolvedValue();
        await review_service.editReview(data);
        //edit review 
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(Review.findOne).toHaveBeenCalled();
        expect(Review.findByIdAndUpdate).toHaveBeenCalled();
        await review_service.editReview({
            email: "test1@xyz.com",
            review_id: "1",
        });
        expect(Review.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //edit review error
        User.findOne.mockResolvedValueOnce();
        await expect(review_service.editReview(data)).rejects
            .toThrow("Edit review service error ::User not found :: ");
        Review.findOne.mockResolvedValueOnce();
        await expect(review_service.editReview(data)).rejects
            .toThrow("Edit review service error ::Review not found :: ");

    });
    it("Delete review function", async () => {
        const mockReview = {
            _id: "1",
            user: "1",
            employee_id: "1",
            review: "Test Review",
            reply: "Test Reply",
            __v: "0"
        }
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
        const data = {
            review_id: "1"
        }
        Review.findOne.mockResolvedValue(mockReview)
        Review.find.mockResolvedValue([]);
        User.findById.mockResolvedValue(mockUser)
        User.findByIdAndUpdate
        await review_service.deleteReview(data);
        //delete review
        expect(Review.findOne).toHaveBeenCalledTimes(1);
        expect(Review.findOne).toHaveBeenCalledWith({ _id: data.review_id });
        expect(Review.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(Review.find).toHaveBeenCalledTimes(1);
        expect(User.findById).toHaveBeenCalledTimes(1);
        expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1);

        mockReview.user = 'anonymous';
        await review_service.deleteReview(data);
        expect(Review.findOne).toHaveBeenCalledTimes(2);
        expect(Review.find).not.toHaveBeenCalledTimes(2);
        expect(User.findById).not.toHaveBeenCalledTimes(2);
        expect(User.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        expect(Review.findByIdAndDelete).toHaveBeenCalledTimes(2);
        //delete review error
        Review.findOne.mockResolvedValueOnce();
        expect(review_service.deleteReview(data)).rejects
            .toThrow("Delete review service error ::Review not found :: ");
    });
    it("Reply review function", async () => {
        const mockReview = {
            _id: "1",
            user: "1",
            employee_id: "1",
            review: "Test Review",
            __v: "0"
        }
        const mockUser = {
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "admin",
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
        let data = {
            email: "test@xyz.com",
            review_id: "1",
            reply: "test reply"
        }
        User.findOne.mockResolvedValue(mockUser);
        Review.findById.mockResolvedValue(mockReview);
        await review_service.replyReview(data);
        //reply review
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(Review.findById).toHaveBeenCalled();
        expect(Review.findById).toHaveBeenCalledWith(data.review_id);
        expect(Review.findOneAndUpdate).toHaveBeenCalled();
        //reply review error
        User.findOne.mockResolvedValueOnce();
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::User not found");
        User.findOne.mockResolvedValueOnce({
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "user"
        });
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::Admin not found");
        Review.findById.mockResolvedValueOnce();
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::Review not found :: ");
        mockReview.reply = "value";
        Review.findById.mockResolvedValueOnce(mockReview);
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::You already replied this review");
    });
    it("Edit reply function", async () => {
        const mockReview = {
            _id: "1",
            user: "1",
            employee_id: "1",
            review: "Test Review",
            reply: "test reply",
            __v: "0"
        }
        const data = {
            review_id: "1",
            reply: "test edit reply"
        }
        Review.findOne.mockResolvedValue(mockReview);
        await review_service.editReply(data);
        //edit review         
        expect(Review.findOne).toHaveBeenCalled();
        expect(Review.findOne).toHaveBeenCalledWith({ _id: data.review_id });
        expect(Review.findOneAndUpdate).toHaveBeenCalled();
        //edit review error
        Review.findOne.mockResolvedValue();
        await expect(review_service.editReply(data)).rejects
            .toThrow("Edit reply service error ::Review not found :: ");
        mockReview.reply = null;
        Review.findOne.mockResolvedValue(mockReview);
        await expect(review_service.editReply(data)).rejects
            .toThrow("Edit reply service error ::You have not replied this review");
    });
    it("Add anonymous review function", async () => {
        const mockEmployee = {
            _id: "1",
            name: 'test1',
            work_group: 'test1',
            position: 'test1',
            __v: "0"
        }
        const data = {
            employee_id: "1",
            review: "test anonymous review"
        }
        //add anonymous review
        Employee.findById.mockResolvedValue(mockEmployee);
        await review_service.addAnonymousReview(data);
        expect(Employee.findById).toHaveBeenCalled();
        expect(Employee.findById).toHaveBeenCalledWith(data.employee_id);
        expect(Review.create).toHaveBeenCalled();
        //add anonymous review error
        Employee.findById.mockResolvedValueOnce();
        expect(review_service.addAnonymousReview(data)).rejects
            .toThrow("Add anonymous review service error ::Employee not found :: ");
        Review.create.mockRejectedValue(new Error("Database error"));
        expect(review_service.addAnonymousReview(data)).rejects
            .toThrow("Add anonymous review service error ::Database error");
        });
})