import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UpdateUserDto, UserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('Users')
@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post('/signup')
    @ApiOperation({ summary: 'Add new user' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UserDto })

    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/profile',
                filename: (req, file, callback) => {

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname).toLowerCase();
                    callback(null, `profile-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const ext = extname(file.originalname).toLowerCase();
                if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                    return callback(
                        new BadRequestException(
                            'Only JPG, JPEG, PNG and WEBP files are allowed',
                        ),
                        false,
                    )
                }

                const allowedMime = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];

                if (!allowedMime.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Invalid Image Type',
                        ),
                        false,
                    )
                }

                callback(null, true);
            }
        }),
    )

    addUser(
        @Body() userDto: UserDto,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
                ],
            }),
        )
        file: Express.Multer.File
    ) {
        const imagepath = file.path.replace(/\\/g, '/');

        return this.usersService.createUser(userDto, imagepath);
    }

    @Get('/all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Fetch all user' })
    @ApiBearerAuth('access-token')

    fetchAllUsers(@Query() paginationQuery: PaginationQueryDto) {
        return this.usersService.fetchAllUsers(paginationQuery);
    }

    @Put('/updateProfile/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: 'Update user profile' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateUserDto })
    @ApiBearerAuth('access-token')

    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/profile',
                filename: (req, file, callback) => {

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname).toLowerCase();
                    callback(null, `profile-${uniqueSuffix}${ext}`);
                },
            }),

            fileFilter: (req, file, callback) => {
                const ext = extname(file.originalname).toLowerCase();
                if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                    return callback(
                        new BadRequestException(
                            'Only JPG, JPEG, PNG and WEBP files are allowed',
                        ),
                        false,
                    )
                }

                const allowedMime = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];

                if (!allowedMime.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Invalid Image Type',
                        ),
                        false,
                    )
                }

                callback(null, true);
            }
        })
    )

    updateUserProfile(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })
                ],
            }),
        )
        file?: Express.Multer.File
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        const objectId = new Types.ObjectId(id);

        const imagepath = file ? file.path.replace(/\\/g, '/') : '';
        return this.usersService.updateProfile(objectId, updateUserDto, imagepath);
    }

    @Delete('/deleteUser/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Delete specific user' })
    @ApiBearerAuth('access-token')

    deleteUser(@Param('id') id: string) {

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        const objectId = new Types.ObjectId(id);
        return this.usersService.deleteUser(objectId);
    }

    @UseGuards(AuthGuard,RolesGuard)
    @Get('/profile/:id')
    @Roles(Role.Admin, Role.User)
    @ApiOperation({ summary: 'Fecth specific user' })
    @ApiBearerAuth('access-token')

    getProfile(@Param('id') id:string) {
        if(! Types.ObjectId.isValid(id)){
            throw new BadRequestException('Invalid user ID');
        }
        const objectId = new Types.ObjectId(id);
        return this.usersService.fetchprofile(objectId);
    }

}