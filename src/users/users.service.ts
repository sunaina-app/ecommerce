import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersData } from './interfaces/users.interfaces';
import { UpdateUserDto, UserDto } from './dto/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from 'src/roles/schemas/roles.schema';


@Injectable()
export class UsersService {


    constructor(
        @InjectModel(Users.name) private usersData: Model<Users>,
        @InjectModel(Roles.name) private rolesData: Model<Roles>
    ) { }

    async createUser(userDto: UserDto, imagepath: string): Promise<UserResponseDto> {

        const { email } = userDto;

        const existingUser = await this.usersData.findOne({
            $or: [{ email: email.toLowerCase() }]
        });

        if (existingUser) {
            throw new NotFoundException('User with this email already exists');
        }

        const salt = await bcrypt.genSalt();
        const password = userDto.password;

        const hash = await bcrypt.hash(password, salt);

        const matchRole = await this.rolesData.findOne({ name: userDto.role.toLowerCase() });

        if (!matchRole) {
            throw new NotFoundException('Role does not exist');
        }

        const newUser = new this.usersData({
            ...userDto,
            email: userDto.email ? String(userDto.email.toLowerCase()) : '',
            mobileNo: userDto.mobileNo ? String(userDto.mobileNo) : '',
            password: hash,
            profile_photo: imagepath,
            role: matchRole._id
        });

        const addUser = await newUser.save();

        const userWithRole = await this.usersData.findById(addUser._id).populate('role', 'name');

        if (!userWithRole) {
            throw new NotFoundException('User not found');
        }

        const userObject = userWithRole.toObject();

        const response = {
            ...userObject,
            _id: userObject._id.toString(),
            role: userObject.role?.name,
        };

        return plainToInstance(UserResponseDto, response);
    }

    async fetchprofile(objectId?: Types.ObjectId, email?: string): Promise<UserResponseDto | UsersData> {


        if (objectId) {

            const user = await this.usersData.findById(objectId);
            if (!user) {
                throw new NotFoundException(`User with ID ${objectId} not found`);
            }

            const matchRole = await this.rolesData.findById(user.role);

            if (!matchRole) {
                throw new NotFoundException('Role does not exist');
            }

            return plainToInstance(UserResponseDto, {
                ...user.toObject(),
                _id: user._id.toString(),
                role: matchRole?.name ?? "null"
            });

        }

        if (email) {

            const users = await this.usersData.findOne({ email: email.toLowerCase() });

            if (!users) {
                throw new NotFoundException(`User with ${email} not found`);
            }

            const matchRole = await this.rolesData.findById(users.role);

            if (!matchRole) {
                throw new NotFoundException('Role does not exist');
            }

            return {
                ...users.toObject(),
                role: matchRole?.name ?? "null"
            } as UsersData;
        }
        throw new BadRequestException(
            'Either user ID or email is required'
        );

    }

    async fetchAllUsers(paginationQuery: PaginationQueryDto): Promise<UserResponseDto[]> {

        const page = paginationQuery.page ?? 1;
        const limit = paginationQuery.limit ?? 10;

        const skip = (page - 1) * limit;


        const userList = await this.usersData.find().skip(skip).limit(limit).exec();

        return plainToInstance(UserResponseDto, userList);

    }

    async updateProfile(id: Types.ObjectId, updateUserDto: UpdateUserDto, imagepath: string): Promise<UserResponseDto> {

        const updateData: any = {};

        Object.entries(updateUserDto).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && !(key === 'mobileNo' && value === 0)) {
                updateData[key] = value;
            }
        });

        if (imagepath) {
            updateData.profile_photo = imagepath;
        }

        const updatedUser = await this.usersData.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return plainToInstance(UserResponseDto, updatedUser.toObject());
    }

    async deleteUser(id: Types.ObjectId): Promise<UserResponseDto> {

        const deletedUser = await this.usersData.findByIdAndDelete(id);

        if (!deletedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return plainToInstance(UserResponseDto, deletedUser.toObject());

    }

    async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(refreshToken, salt);

        return await this.usersData.findByIdAndUpdate(
            userId,
            {
                refresh_token: hash,
            },
            {
                new: true
            }
        )
    }

}