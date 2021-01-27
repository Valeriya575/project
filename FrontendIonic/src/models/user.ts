import { BasicStation } from './station';
import { BasicBus } from './bus';

export class UserLogin {
    username: string;
    password: string;
}

export class UserRegister extends UserLogin {
    email: string;
}

export class BasicUser {
    email: string;
    password: string;
    favouriteStations: BasicStation[];
    favouriteBuses: BasicBus[];
}

export class UserDetails extends BasicUser {
    id: string;
    username: string;
}
