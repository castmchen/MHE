import { BaseModel } from "./base-model";
import {RoleEnum} from "./role-enum";

export class UserModel implements BaseModel {
    public UserId: any;
    public UserName: string;
    public Email: string;
    public PhoneNumber: string;
    public Password: string;
    public ConfirmPassword: string;
    public UserRole : RoleEnum;
    public Location: Location;
    public CreatedTime: string;
    public CreatedBy: any;
    public UpdatedTime: string;
    public UpdatedBy: any;
}

export class Location {
    public LocaltionX: any;
    public LocaltionY: any;
}


