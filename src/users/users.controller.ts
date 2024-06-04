import { Post, Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto, SigninDto } from './dto/user.dto';

@Controller('api/v1/users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post('/signup')
    signUp(@Body() signUpDto: SignupDto){
        return this.userService.signUp(signUpDto)
    }

    @Post('/login')
    login(@Body() signinDto: SigninDto){
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
    @Post('/thirdparty/signup')
    thirdPartySignup(@Body() signinDto: { email: string }){
        return this.userService.thirdPartySignup(signinDto)
    }

    @Post('/thirdparty/login')
    thirdPartyLogin(@Body() body: { email: string }){       
        return this.userService.thirdPartyLogin(body)
    }

    @Post('/verifyemail')
    verifyEmail(@Body() body: { email: string }){       
        return this.userService.verifyEmail(body)
    }

    @Post('/otpagain')
    otpAgain(@Body() body: { email: string }){       
        return this.userService.otpAgain(body)
    }

    @Post('/contact')
    contact(@Body() body: any){       
        return this.userService.contact(body)
    }
}
