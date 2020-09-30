import { Injectable } from '@nestjs/common';
import { UserTimerData, SearchQuery } from './interface';
import { DataService } from '../../data/data.service';
import * as time from '../../helpers/time';

@Injectable()
export class UserTimerService {
  constructor(private dataService: DataService) {}

  // ideally when using with db, it should be uid instead of userName
  startTimer(userName: string, title: string): UserTimerData {
    const recentTimerId = this.dataService.getUsersRecentTimerId(userName);
    if(recentTimerId !== undefined){
      throw new Error ('timer already started, need to stop previous timer first');
    }

    const data: UserTimerData = {
      start_time: time.unixTimestamp(),
      title: title
    };

    const timerId = this.dataService.insertTimer(userName, data);
    this.dataService.setUsersRecentTimerId(userName, timerId); 
    //this.dataService.dumpData();

    return this.dataService.getTimer(userName, timerId);
  }

  stopTimer(userName: string): UserTimerData {
    const recentTimerId = this.dataService.getUsersRecentTimerId(userName);
    if(recentTimerId === undefined){
      throw new Error ('timer not started, need to be start first');
    }

    const recentTimerObject = this.dataService.getTimer(userName, recentTimerId);

    const endTime = time.unixTimestamp();
    const updateData: UserTimerData = {
      end_time: endTime,
      duration: endTime - recentTimerObject['start_time'],
      // titie ?
    };
    
    const status = this.dataService.updateTimer(userName, recentTimerId, updateData);
    this.dataService.clearUsersRecentTimerId(userName); 
    //this.dataService.dumpData();

    return status;
  }

  editTimer(userName: string, timerId: number, data: UserTimerData): UserTimerData {
    const updateData: any = {};

    if(data.start_time) updateData.start_time = data.start_time;
    if(data.end_time) updateData.end_time = data.end_time;
    if(data.title) updateData.title = data.title;

    if(updateData.start_time || updateData.end_time){
      const userTimerObj = this.dataService.getTimer(userName, timerId);
      const startTime = updateData.start_time ? updateData.start_time : userTimerObj.start_time;
      const endTime = updateData.end_time ? updateData.end_time : userTimerObj.end_time;
      
      if(endTime < startTime){
        throw new Error('start_time can not be greater than end_time');
      }
      updateData.duration = endTime - startTime;
    }

    return this.dataService.updateTimer(userName, timerId, updateData);
  }

  getAllTimer(userName: string) { 
    const timers: UserTimerData[] = this.dataService.getAllTimer(userName);
    const totalDuration = timers.reduce((sum, t) => { 
      if(isNaN(t.duration)) return sum;
      return sum + t.duration;
    }, 0);

    return { timers, totalDuration };
  }

  search(userName: string, query: SearchQuery): UserTimerData[] {
    return this.dataService.searchTitle(userName, query.title);
  }
}
