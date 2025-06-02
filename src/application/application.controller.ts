import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateStatusDto } from './dto/application.dto';

@Controller('application')
export class ApplicationController {
    constructor(
        private readonly applicationService: ApplicationService) {}
    
    
    @UseGuards(JwtAuthGuard)
    @Post(":id")
    async applyJob(@Req() req:any, @Param("id") jobId: string) {
        const userId = req.user.id
        const application = await this.applicationService.applyJob(userId, jobId)

        return {
            message: "Job applied successfully",
            application, 
            success: true
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getApplicationJobs(@Req() req: any) {
        const userId = req.user.id
        const applications = await this.applicationService.getApplicationJob(userId)
        return{
            applications,
            success: true
        }
    }

    @Get(":id")
    async getApplication(@Param("id") jobId: string) {
        const job = await this.applicationService.getApplicants(jobId)
         return{
            job,
            success: true
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('update-status/:id')
    async updateApplicationStatus(
        @Param("id") id: string, 
        @Body() updateStatusDto: UpdateStatusDto) {
            const updatedApplication = await this.applicationService.updateStatus(
                id, updateStatusDto
            )
            return{
            updatedApplication,
            success: true,
            message: "Application updated succesfully"
        }
        }
        
}
