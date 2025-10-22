export class UserRto {
    id: string;
    username: string;
    email: string;

    constructor(partial: Partial<UserRto>) {
        Object.assign(this, partial);
    }
}