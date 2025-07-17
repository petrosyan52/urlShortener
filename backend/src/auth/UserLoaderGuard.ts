import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class UserLoaderGuard implements CanActivate {
    constructor(private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        if (!req.user) {
            console.log('UserLoaderGuard: No user in request');
            return false;
        }

        const userId = req.user.userId;
        if (!userId) {
            return false;
        }

        const user = await this.userService.findById(userId);
        if (!user) {
            return false;
        }

        req.user = user;
        return true;
    }

}
