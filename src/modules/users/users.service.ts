import { Injectable } from '@nestjs/common';
import { LoginData, JwtToken } from './interface';

@Injectable()
export class UsersService {

  login(requestObj: LoginData): JwtToken {
    // user/password/auth related checks
    return {"jwt": `jwt-${requestObj.user_name}`}; // dummy jwt token
  }

  create(){}

}
