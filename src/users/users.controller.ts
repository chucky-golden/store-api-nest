import { Post, Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto, SigninDto } from './dto/user.dto';

@Controller('api/v1/users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post('/signup')
    signUp(@Body() signUpDto: SignupDto): Promise<{ user: any, token: string }> {
        return this.userService.signUp(signUpDto)
    }

    @Post('/login')
    login(@Body() signinDto: SigninDto): Promise<{ user: string, token: string }> {
        return this.userService.login(signinDto)
    }

    @Post('/forgot')
    forgot(@Body() body: { email: string }){       
        return this.userService.forgotPassword(body)
    }

    @Post('/reset')
    reset(@Body() body: { email: string, password: string }){       
        return this.userService.passwordReset(body)
    }
}
