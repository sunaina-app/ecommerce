import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {

    constructor(private readonly authService:AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({summary:'User signIn'})
    
    signIn(@Body() authDto:AuthDto){
        return this.authService.signIn(authDto);
    }

    @Post('refresh')
    @ApiOperation({summary:'Generate refresh token'})
    
    refreshToken(@Body() refreshToken:RefreshTokenDto){
        return this.authService.refreshToken(refreshToken);
    }

}