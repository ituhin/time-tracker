import { Test, TestingModule } from '@nestjs/testing';
import { UserTimerService } from './user-timer.service';
import { DataService } from '../../data/data.service';
// import * as time from '../../helpers/time';

describe('UserTimerService', () => {
  let service: UserTimerService;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTimerService, DataService],
    }).compile();

    dataService = module.get<DataService>(DataService);

    dataService.insertTimer = jest.fn();
    dataService.setUsersRecentTimerId = jest.fn();
    dataService.getTimer = jest.fn();
    dataService.getUsersRecentTimerId = jest.fn();
    dataService.updateTimer = jest.fn();
    dataService.clearUsersRecentTimerId = jest.fn();
    dataService.searchTitle = jest.fn();

    //service = module.get<UserTimerService>(UserTimerService);
    service = new UserTimerService(dataService);
  });

  it('startTimer()', () => {
    const title = 'starting my time in this world';
    const userName = 'test123';
    service.startTimer(userName, title);
    
    expect(dataService.getUsersRecentTimerId).toHaveBeenCalledWith(userName);
    expect(dataService.insertTimer).toHaveBeenCalled();
    expect(dataService.setUsersRecentTimerId).toHaveBeenCalled();
    expect(dataService.getTimer).toHaveBeenCalled();
  });

  it('startTimer() fails when already 1 running', () => {
    const title = 'starting my time in this world';
    const userName = 'test123';
    
    dataService.getUsersRecentTimerId = jest.fn().mockReturnValue(123);
    service = new UserTimerService(dataService);

    try {
      service.startTimer(userName, title)
    } catch(err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('stopTimer()', () => {
    const userName = 'test123';
    const timerId = '123';
    const fakeTimer = {start_time: 100};

    dataService.getUsersRecentTimerId = jest.fn().mockReturnValue(timerId);
    dataService.getTimer = jest.fn().mockReturnValue(fakeTimer);
    service = new UserTimerService(dataService);

    service.stopTimer(userName);
    
    expect(dataService.getUsersRecentTimerId).toHaveBeenCalledWith(userName);
    expect(dataService.getTimer).toHaveBeenCalledWith(userName, timerId);
    expect(dataService.updateTimer).toHaveBeenCalled();
    expect(dataService.clearUsersRecentTimerId).toHaveBeenCalledWith(userName);
  });

  it('stopTimer() fails when no timer running', () => {
    const userName = 'test123';
    try {
      service.stopTimer(userName)
    } catch(err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('editTimer()', () => {
    const userName = 'test123';
    service.editTimer(userName, 123, {start_time: 100, end_time: 110});
    expect(dataService.updateTimer).toHaveBeenCalledWith(userName, 123, {start_time: 100, end_time: 110, duration: 10});
  });

  it('editTimer() fails when start_time is bigger than end_time', () => {
    const userName = 'test123';
    try {
      service.editTimer(userName, 123, {start_time: 100, end_time: 10});
    } catch(err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('getAllTimer()', () => {
    const userName = 'test123';
    const timers = [{duration: 1}, {duration: 2}, {duration: 3}];

    dataService.getAllTimer = jest.fn().mockReturnValue(timers);
    service = new UserTimerService(dataService);

    expect(service.getAllTimer(userName)).toEqual({timers, totalDuration: 6});
    expect(dataService.getAllTimer).toHaveBeenCalledWith(userName);
  });

  it('search()', () => {
    const userName = 'test123';
    const query = {title : 'hellow'};
    service.search(userName, query);

    expect(dataService.searchTitle).toHaveBeenCalledWith(userName, query.title);
  });

});
