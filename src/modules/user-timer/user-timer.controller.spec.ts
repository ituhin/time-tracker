import { Test, TestingModule } from '@nestjs/testing';
import { UserTimerController } from './user-timer.controller';
import { UserTimerService } from './user-timer.service';
import { DataService } from '../../data/data.service';
import * as responseHandler from '../../helpers/response-handler';

describe('UserTimerController', () => {
  let controller: UserTimerController;
  let userTimerService: UserTimerService;
  let dataService: DataService;

  const mockRes: any = {
    locals: { user_name : 'test1234'},
    json: res => res,
    status: (code: number) => mockRes,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTimerController],
      providers: [DataService, UserTimerService],
    }).compile();

    dataService = module.get<DataService>(DataService);
    userTimerService = module.get<UserTimerService>(UserTimerService);
    controller = module.get<UserTimerController>(UserTimerController);
  });

  it('getAll', () => {
    const dummyData = {timers: [{id: 1, start_time: 123, duration: 3}], totalDuration: 3};
    jest.spyOn(userTimerService, 'getAllTimer').mockImplementation(() => dummyData);

    expect(controller.getAll(mockRes)).toEqual({success: true, data: dummyData});
  });
});
