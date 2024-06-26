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
        employe.findById();
        review.find();
        user.findByIdAndUpdate();
        let data={};
    });
});