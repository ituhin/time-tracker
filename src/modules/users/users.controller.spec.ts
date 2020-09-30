import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockRes: any = {
    locals: { user_name : 'test1234'},
    json: res => res,
    status: (code: number) => mockRes,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [ UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('login', () => {
    expect(controller.login({user_name: 'test', password: 'dummy'}, mockRes))
      .toEqual({success: true, data: {jwt: 'jwt-test'}});
  });
});
