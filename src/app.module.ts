import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataService } from './data/data.service';
import { AuthMiddleware } from './auth.middleware';

import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';

import { UserTimerService } from './modules/user-timer/user-timer.service';
import { UserTimerController } from './modules/user-timer/user-timer.controller';


@Module({
  imports: [],
  controllers: [AppController, UsersController, UserTimerController],
  providers: [AppService, UsersService, DataService, UserTimerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('user-timer');
  }
}
