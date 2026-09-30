import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Users, UsersDocument } from "src/users/schemas/users.schema";
import { PERMISSION_KEY } from "./permission.decorator";
import { Model } from "mongoose";


export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectModel(Users.name)
        private userModel: Model<UsersDocument>
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required = this.reflector.getAllAndOverride<string[]>(
            PERMISSION_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        if (!required) return true;

        const request = context.switchToHttp().getRequest();

        const user = await this.userModel.findById(request.user.sub).populate({ path: 'role', populate: { path: 'permissions' } });
        const userPermission = user?.role.permissions.map(p => p.name);
        return required.every(permission =>userPermission?.includes(permission));
    }
}