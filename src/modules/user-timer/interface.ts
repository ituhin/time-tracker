import { Timestamp } from "rxjs";

export interface UserTimerData {
  id?: number;
	start_time?: number; // unix timestamp
  end_time?: number;
  title?: string; // start title ? is there end title as well?
  duration?: number;
}

export interface SearchQuery {
  title: string;
}