import { ITicketService } from './i-ticket-service';
import { ITokenSession } from './i-token-session';
import { IUserData } from './i-userdata';
import { User } from './i-user-user';

export interface IUser {
    user: User;
    userdata: IUserData;
    token: ITokenSession;
    service?: ITicketService[];
}
