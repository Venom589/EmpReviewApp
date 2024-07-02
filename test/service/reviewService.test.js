const review_service = require('../../services/reviewService');
const user = require('../../model/user');
const review = require('../../model/review');
const employee = require('../../model/employee');

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
                employe_id: "1",
                review: "Test Review1",
                reply: "Test Reply1",
                __v: "0"
            },
            {
                _id: "2",
                user: "1",
                employe_id: "1",
                review: "Test Review2",
                reply: "Test Reply2",
                __v: "0"
            },
            {
                _id: "3",
                user: "1",
                employe_id: "1",
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
        user.findOne.mockResolvedValue(mockUser);
        employee.findOne.mockResolvedValue(mockEmployee);
        review.find.mockResolvedValue([]);
        user.findByIdAndUpdate.mockResolvedValue();
        //add review
        const result = await review_service.addReview(data);
        expect(user.findOne).toHaveBeenCalled();
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(employee.findOne).toHaveBeenCalled();
        expect(employee.findOne).toHaveBeenCalledWith({ _id: data.employee_id });
        expect(review.find).toHaveBeenCalled();
        expect(user.findByIdAndUpdate).toHaveBeenCalled();
        expect(review.create).toHaveBeenCalled();

        review.find.mockResolvedValue(mockReviews);
        const result2 = await review_service.addReview(data);
        expect(user.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //add review error
        user.findOne.mockResolvedValueOnce();
        await expect(review_service.addReview(data)).rejects
            .toThrow("Add review service error ::User not found :: ");
        employee.findOne.mockResolvedValueOnce();
        await expect(review_service.addReview(data)).rejects
            .toThrow("Add review service error ::Employee not found :: ");
        review.find.mockResolvedValueOnce(errorMockReview);
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
        user.findOne.mockResolvedValue(mockUser);
        review.findOne.mockResolvedValue(mockReview);
        review.findByIdAndUpdate.mockResolvedValue();
        await review_service.editReview(data);
        //edit review 
        expect(user.findOne).toHaveBeenCalled();
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(review.findOne).toHaveBeenCalled();
        expect(review.findByIdAndUpdate).toHaveBeenCalled();
        await review_service.editReview({
            email: "test1@xyz.com",
            review_id: "1",
        });
        expect(review.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        //edit review error
        user.findOne.mockResolvedValueOnce();
        await expect(review_service.editReview(data)).rejects
            .toThrow("Edit review service error ::User not found :: ");
        review.findOne.mockResolvedValueOnce();
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
        review.findOne.mockResolvedValue(mockReview)
        review.find.mockResolvedValue([]);
        user.findById.mockResolvedValue(mockUser)
        user.findByIdAndUpdate
        await review_service.deleteReview(data);
        //delete review
        expect(review.findOne).toHaveBeenCalledTimes(1);
        expect(review.findOne).toHaveBeenCalledWith({ _id: data.review_id });
        expect(review.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(review.find).toHaveBeenCalledTimes(1);
        expect(user.findById).toHaveBeenCalledTimes(1);
        expect(user.findByIdAndUpdate).toHaveBeenCalledTimes(1);

        mockReview.user = 'anonymous';
        await review_service.deleteReview(data);
        expect(review.findOne).toHaveBeenCalledTimes(2);
        expect(review.find).not.toHaveBeenCalledTimes(2);
        expect(user.findById).not.toHaveBeenCalledTimes(2);
        expect(user.findByIdAndUpdate).not.toHaveBeenCalledTimes(2);
        expect(review.findByIdAndDelete).toHaveBeenCalledTimes(2);
        //delete review error
        review.findOne.mockResolvedValueOnce();
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
        user.findOne.mockResolvedValue(mockUser);
        review.findById.mockResolvedValue(mockReview);
        await review_service.replyReview(data);
        //reply review
        expect(user.findOne).toHaveBeenCalled();
        expect(user.findOne).toHaveBeenCalledWith({ email: data.email });
        expect(review.findById).toHaveBeenCalled();
        expect(review.findById).toHaveBeenCalledWith(data.review_id);
        expect(review.findOneAndUpdate).toHaveBeenCalled();
        //reply review error
        user.findOne.mockResolvedValueOnce();
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::User not found");
        user.findOne.mockResolvedValueOnce({
            _id: "1",
            name: "test1",
            password: "Test@1234",
            email: "test1@xyz.com",
            role: "user"
        });
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::Admin not found");
        review.findById.mockResolvedValueOnce();
        expect(review_service.replyReview(data)).rejects
            .toThrow("Reply review service error ::Review not found :: ");
        mockReview.reply = "valuew";
        review.findById.mockResolvedValueOnce(mockReview);
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
        review.findOne.mockResolvedValue(mockReview);
        await review_service.editReply(data);
        //edit review         
        expect(review.findOne).toHaveBeenCalled();
        expect(review.findOne).toHaveBeenCalledWith({ _id: data.review_id });
        expect(review.findOneAndUpdate).toHaveBeenCalled();
        //edit review error
        review.findOne.mockResolvedValue();
        await expect(review_service.editReply(data)).rejects
            .toThrow("Edit reply service error ::Review not found :: ");
        mockReview.reply = null;
        review.findOne.mockResolvedValue(mockReview);
        await expect(review_service.editReply(data)).rejects
            .toThrow("Edit reply service error ::You have not replied this review");
    });
    it("Add anonymous review function", async () => {
        const mockEmploye = {
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
        employee.findById.mockResolvedValue(mockEmploye);
        await review_service.addAnonymousReview(data);
        expect(employee.findById).toHaveBeenCalled();
        expect(employee.findById).toHaveBeenCalledWith(data.employee_id);
        expect(review.create).toHaveBeenCalled();
        //add anonymous review error
        employee.findById.mockResolvedValueOnce();
        expect(review_service.addAnonymousReview(data)).rejects
            .toThrow("Add anonymous review service error ::Employee not found :: ");
        review.create.mockRejectedValue(new Error("Database error"));
        expect(review_service.addAnonymousReview(data)).rejects
            .toThrow("Add anonymous review service error ::Database error");
        });
})