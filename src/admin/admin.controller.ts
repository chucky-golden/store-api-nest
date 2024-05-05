import { Post, Body, Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SignupDto, SigninDto } from './dto/admin.dto';

@Controller('/api/v1/admin')
export class AdminController {
    constructor(private adminService: AdminService){}

    @Post('/signup')
    signUp(@Body() signUpDto: SignupDto): Promise<{ admin: any, token: string }> {
        return this.adminService.signUp(signUpDto)
    }

    @Post('/signin')
    signIn(@Body() signinDto: SigninDto): Promise<{ token: string }> {
        return this.adminService.login(signinDto)
    }

    @Post('/forgot')
    forgot(@Body() body: { email: string }){       
        return this.adminService.forgotPassword(body)
    }

    @Post('/reset')
    reset(@Body() body: { email: string, password: string }){       
        return this.adminService.passwordReset(body)
    }
}
