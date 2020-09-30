import {UserTimerData} from '../modules/user-timer/interface';

export interface InMemoryDataUsersTimer {
	(user_name: string): UserTimerData[];
}
