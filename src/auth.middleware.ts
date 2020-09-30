import { Injectable, NestMiddleware } from '@nestjs/common';
import * as responseHandler from './helpers/response-handler';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    
    const jwtToken = req.get('jwt');
    // validate token
    try {
      res.locals.user_name = this.decodeJwt(jwtToken);
      next();
    } catch(err) {
      responseHandler.sendError(err, res);
    }
  }

  decodeJwt(jwtToken: string): string {
    // token to uid decode, in this case user_name
    const token = jwtToken.split('-');
    if(token[0] !== 'jwt' || !token[1]) {
      throw new Error('jwt auth failed');
    }

    return token[1];
  }
}
