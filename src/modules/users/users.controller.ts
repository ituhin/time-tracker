import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { LoginData } from './interface';
import * as responseHandler from '../../helpers/response-handler';
import * as Joi from 'joi';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginData: LoginData, @Res() res: Response) {
    try {
      const validationSchema = Joi.object({
        user_name: Joi.string().required(),
        password: Joi.string().required()
      });
  
      const {error} = validationSchema.validate({
        user_name: loginData.user_name,
        password: loginData.password
      });
      if(error) throw error;

      const response = this.usersService.login(loginData);
      return responseHandler.sendSuccess(response, res);
	  } catch (err) {
      return responseHandler.sendError(err, res);
    }
    
  }

}
