const common_service = require('../../services/commonService');
const employe = require('../../model/employe');
const review = require('../../model/review');

jest.mock('../../model/employe');
jest.mock('../../model/review');

describe('CommonService', () => {
    beforeEach(() => {
        employe.mockClear();
        review.mockClear();
    });

    test('AllEmploye should call this.employe.find', async () => {
        const employeesMock = [
            { _id: '1', name: 'John Doe', work_group: 'A', position: 'Developer' },
            { _id: '2', name: 'Jane Smith', work_group: 'B', position: 'Manager' }
        ];
        employe.find.mockReturnValue({
            select: jest.fn().mockResolvedValue(employeesMock)
        });
        review.aggregate.mockResolvedValue([{ times: 5 }]);

        // Act
        const result = await common_service.AllEmploye();

        // Assert
        expect(employe.find).toHaveBeenCalled();
        expect(result).toEqual([
            {
                employee: employeesMock[0],
                reviews: [{ times: 5 }]
            },
            {
                employee: employeesMock[1],
                reviews: [{ times: 5 }]
            }
        ]);
    });
});
