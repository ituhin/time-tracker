import { Controller,Get, Post, Put, Req, Res, Param, Query, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserTimerService } from './user-timer.service';
import { UserTimerData, SearchQuery } from './interface';
import * as responseHandler from '../../helpers/response-handler';
import * as Joi from 'joi';

@Controller('user-timer')
export class UserTimerController {
  constructor(private readonly userTimerService: UserTimerService) {

  }

  @Post('start')
  startTimer(@Req() req: Request, @Res() res: Response) {
    try {
      const validationSchema = Joi.object({
        title: Joi.string().required()
      });
  
      const {error} = validationSchema.validate({
        title: req.body.title
      });
      if(error) throw error;

      const response = this.userTimerService.startTimer(res.locals.user_name, req.body.title);

      return responseHandler.sendSuccess(response, res);
	  } catch (err) {
      return responseHandler.sendError(err, res);
    }
  }

  @Post('stop')
  stopTimer(@Req() req: Request, @Res() res: Response) {
    try {
      const response = this.userTimerService.stopTimer(res.locals.user_name);

      return responseHandler.sendSuccess(response, res);
	  } catch (err) {
      return responseHandler.sendError(err, res);
    }
  }

  @Post('edit/:timerId')
  editTimer(@Body() userTimerData: UserTimerData, @Res() res: Response, @Param() params) {
    try {
      if(isNaN(params.timerId)){
        throw new Error('param:timerId missing');
      }

      const validationSchema = Joi.object({
        start_time: Joi.number().integer().positive(),
        end_time: Joi.number().integer().positive(),
        title: Joi.string()
      });
  
      const {error} = validationSchema.validate({
        start_time: userTimerData.start_time,
        end_time: userTimerData.end_time,
        title: userTimerData.title
      });
      if(error) throw error;

      const response = this.userTimerService.editTimer(res.locals.user_name, params.timerId, userTimerData);

      return responseHandler.sendSuccess(response, res);
	  } catch (err) {
      return responseHandler.sendError(err, res);
    }
  }

  @Get('getAll')
  getAll(@Res() res: Response) {
    try {
      const response = this.userTimerService.getAllTimer(res.locals.user_name);

      return responseHandler.sendSuccess(response, res);
	  } catch (err) {
      return responseHandler.sendError(err, res);
    }
  }

  @Get('search')
  search(@Query() query: SearchQuery, @Res() res: Response) {
    try {
      const validationSchema = Joi.object({
        title: Joi.string().required()
      });
  
      const {error} = validationSchema.validate({
        title: query.title
      });
      if(error) throw error;

      const response = this.userTimerService.search(res.locals.user_name, query);

      return responseHandler.sendSuccess(response, res);
	  } catch (err) {
      return responseHandler.sendError(err, res);
    }
  }
}
