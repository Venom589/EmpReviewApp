const admin_service = require('../../services/adminService');
const mongoose = require('mongoose');
const employe = require('../../model/employe');
const user = require('../../model/user');
const review = require('../../model/review');

jest.mock('../../model/employe');
jest.mock('../../model/user');
jest.mock('../../model/review');

describe('Admin service', () => {
    
    // afterAll(()=>{
        
    // });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("employee creation test", async () => {
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

    test("employee Update test", async() => {
        let findEmployeMock = {
            _id:"1",
            name: "x",
            work_group: "x",
            position: "x",
            __v:"0"
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
        expect(employe.findByIdAndUpdate).toHaveBeenCalledWith(data.employe_id,findEmployeMock );
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

    test("employee deletion test", async()=>{
        let employee = {
            _id:"1",
            name: "x",
            work_group: "x",
            position: "x",
            __v:"0"
        }
        let reviews = [
            {   
                _id:"1",
                __v:"0",
                user:"anonymous",
                employe_id:"1",
                review:"review1",
                reply:"reply1"
            },
            {   
                _id:"2",
                __v:"0",
                user:"1",
                employe_id:"1",
                review:"review2",
                reply:"reply3"
            },
            {
                _id:"3",
                __v:"0",
                user:"2",
                employe_id:"1",
                review:"review3",
                reply:"reply3"
            },
        ];
        let users = [
            {
                _id:'1',
                __v:"0",
                name:"D",
                email:"D@123.com",
                password:"Dtest@123",
                reviewed:[
                    {Employe:"1"}
                ],
                role:"admin"
            },
            {
                _id:'2',
                __v:"0",
                name:"f",
                email:"f@123.com",
                password:"ftest@123",
                reviewed:[
                    {Employe:"1"}
                ],
                role:"user"
            },
        ]
        employe.findById.mockResolvedValue(employee);
        review.find.mockResolvedValue(reviews);
        user.findById.mockResolvedValue(id => Promise.resolve(users.find(x => x._id == id)));
        // user.findByIdAndUpdate.mockResolvedValue();
        review.deleteMany.mockResolvedValue(employee)
        employe.findByIdAndDelete(employee);

        //let filterSpy = jest.spyOn(Array.prototype , 'filter');
        
        let data={employe_id:"1"};
        let result = await admin_service.DeleteEmploye(data);
        expect(employe.findById).toHaveBeenCalled();
        expect(employe.findById).toHaveBeenCalledWith(data.employe_id);
        expect(filterSpy).toHaveBeenCalledTimes(3);
        expect(review.find).toHaveBeenCalled();
        // expect(user.findByIdAndUpdate).toHaveBeenCalled();
        expect(user.findById).toHaveBeenCalledTimes(3);

    });
});