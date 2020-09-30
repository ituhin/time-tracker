import { Timestamp } from "rxjs";

export interface LoginData {
	user_name: string;
	password: string;
}

export interface JwtToken {
  jwt : string;
  expire?: Date;
}