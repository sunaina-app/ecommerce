import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';
import { UsersData } from 'src/users/interfaces/users.interfaces';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()

export class AuthService {
    
    constructor(
        private readonly userService:UsersService, 
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService
    ){}
    
    async signIn(authDto:AuthDto):Promise<{
        access_token:string;
        refresh_token:string
    } >{

        const {email,password} = authDto;

        const user =  await this.userService.fetchprofile(undefined,email.toLowerCase());

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            throw new UnauthorizedException("Invalid Crendentials");
        }

        const dbUser = user as UsersData & {_id:Types.ObjectId};

        const payload = {sub:dbUser._id,username:user.username,role:user.role,email:user.email};
        
        const accessToken = await this.jwtService.signAsync(payload);

        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d'
            }
        );

        await this.userService.updateRefreshToken(
            dbUser._id,
            refreshToken
        )

        return{
            access_token : accessToken,
            refresh_token: refreshToken
        };

    }

    async refreshToken(refreshTokenDto:RefreshTokenDto){
        try{

            const {refresh_token} = refreshTokenDto;

            const payload = await this.jwtService.verifyAsync(
                refresh_token,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET')
                }
            );

            const user = await this.userService.fetchprofile(undefined,payload.email);

            if(!user.refresh_token){
                throw new UnauthorizedException('Refresh token not found');
            }

            const matchRefreshToken = await bcrypt.compare(refresh_token,user.refresh_token);

            if(!matchRefreshToken){
                throw new UnauthorizedException('Inavlid refresh token');
            }

            const newAccesstoken = await this.jwtService.signAsync(
                {
                    sub:user._id,
                    username : user.username,
                    role: user.role,
                    email:user.email
                }
            );

            return{
                access_token: newAccesstoken
            }

        }catch(error){
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

}