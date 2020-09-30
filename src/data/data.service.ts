import { Injectable } from '@nestjs/common';
import {InMemoryDataUsersTimer} from './interface';
import { UserTimerData } from '../modules/user-timer/interface';

// ideally db should be used and this can be replaced easily by a db wrapper
// but using memory as storage here in this case
const dataUsersTimer = {};
const dataUsersRecentTimerId = {};

@Injectable()
export class DataService {

  insertTimer(userName: string, data: UserTimerData): number {
    if(!dataUsersTimer[userName]) {
      dataUsersTimer[userName] = [];
    }

    data.id = dataUsersTimer[userName].length; // just using the position as id here
    // its not race condition safe, but ok for the test task, and ideally it should be auto increment in db
    // and this way we can access the data from the list easily here
    dataUsersTimer[userName].push(data);
    return data.id;
  }

  updateTimer(userName: string, timerId: number, data: UserTimerData): UserTimerData { 
    if(!dataUsersTimer[userName] || !dataUsersTimer[userName][timerId]) {
      throw new Error(`object not found - user_name: ${userName}, timerId: ${timerId}`);
    }

    return Object.assign(dataUsersTimer[userName][timerId], data);
  }

  getTimer(userName: string, timerId: number): UserTimerData {
    if(!dataUsersTimer[userName] || !dataUsersTimer[userName][timerId]) {
      throw new Error(`object not found - user_name: ${userName}, timerId: ${timerId}`);
    }

    return dataUsersTimer[userName][timerId];
  }

  getAllTimer(userName: string): UserTimerData[] {
    if(!dataUsersTimer[userName]) {
      return [];
    }
    
    // in db this sort will be done by query/index and probably paginated
    return dataUsersTimer[userName].sort((a,b) => a.start_time < b.start_time ? 1 : -1);
  }

  // in db we can do index based search query as well instead of this
  searchTitle(userName: string, query: string): UserTimerData[] {
    const timers: UserTimerData[] = this.getAllTimer(userName);

    return timers.filter(t => {
      const re = new RegExp(query, 'i');
      return re.test(t.title);
    });
  }

  getUsersRecentTimerId(userName: string): number {
    return dataUsersRecentTimerId[userName];
  }

  clearUsersRecentTimerId(userName: string) {
    delete dataUsersRecentTimerId[userName];
  }

  setUsersRecentTimerId(userName: string, timerId: number) {
    dataUsersRecentTimerId[userName] = timerId;
  }

  dumpData(){ // for debug
    console.log(dataUsersRecentTimerId, dataUsersTimer);
  }

}
