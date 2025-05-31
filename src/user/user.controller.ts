import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("/register")
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.register(registerUserDto); // ✅ Correct
    }

    @Post("/login")
    async login(@Body() body, @Res() res:Response){
        const {email, password, role} = body

        try{
            const userResponse = await this.userService.login(email, password, role)
            res.cookie("token", userResponse?.token,{
                maxAge: 1*24*60*60*1000,
                httpOnly: true,
                sameSite: 'strict'
            })
            return res.status(200).json(userResponse)
        }
        catch(error){
            return res.status(error.status || 500).json({
                message: error.message || "Internal Server Error",
                success: false
            })
        }
    }

    @Get("/logout")
    async logout(@Res() res: Response){
        try{
            const result = await this.userService.logout()
             res.cookie("token", '',{
                maxAge: 0,
                httpOnly: true,
                sameSite: 'strict'
            })
            return res.status(200).json(result)
        }
        catch(error){
            return res.status(500).json({
                message: "internal server Error",
                success: false
            })
        }
    }

    // update user
    @UseGuards(JwtAuthGuard)
    @Put('/updateProfile')
    async updateProfile(
    @Req() req: Request & { user?: any },
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    ) {
    try {
        const userId = req.user.id;
        const user = await this.userService.updateProfile(userId, updateUserDto)
        return res.status(200).json({
            message: "Profile update Successfully",
            user,
            success: true
        })

        // you can now use userId to update the profile...
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
    }
}



