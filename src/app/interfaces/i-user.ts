import { ITicketService } from './i-ticket-service';
import { ITokenSession } from './i-token-session';
import { IUserData } from './i-userdata';

export interface IUser {
    user: IUser;
    user_data: IUserData;
    token: ITokenSession;
    service?: ITicketService[];
}
