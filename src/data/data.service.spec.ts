import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  it('inserTimer() & getTimer()', () => {
    expect(service.insertTimer('test', {id: 0, title: 'title 0'})).toBe(0);
    expect(service.insertTimer('test', {id: 1, title: 'title 1'})).toBe(1);

    expect(service.getTimer('test', 1)).toEqual({id: 1, title: 'title 1'});
  });

  it('updateTimer()', () => {
    service.insertTimer('dummy', {id: 0, title: 'title 0'});
    expect(service.updateTimer('dummy', 0, {title: 'title dummy'})).toEqual({id: 0, title: 'title dummy'});

    expect(service.getTimer('dummy', 0)).toEqual({id: 0, title: 'title dummy'});
  });

  it('getAllTimer() - sorted by start_time descending order', () => {
    service.insertTimer('dummy123', {id: 0, start_time: 5});
    service.insertTimer('dummy123', {id: 1, start_time: 3});
    service.insertTimer('dummy123', {id: 2, start_time: 8});

    expect(service.getAllTimer('dummy123')).toEqual([
      {id: 2, start_time: 8},
      {id: 0, start_time: 5},
      {id: 1, start_time: 3}
    ]);
  });

  it('searchTitle() - search title string', () => {
    service.insertTimer('someuser', {id: 0, title: 'hello how are you'});
    service.insertTimer('someuser', {id: 1, title: 'how are you doing'});
    service.insertTimer('someuser', {id: 2, title: 'blah blah'});

    expect(service.searchTitle('someuser', 'how')).toEqual([
      {id: 1, title: 'how are you doing'},
      {id: 0, title: 'hello how are you'}
    ]);
  });
});
