import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostJobDto } from './dto/job.dto';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async postJob(
        @Req() req:any,
        @Body() postJobDto: PostJobDto
    ){
        const userId = req.user.id;
        const job = await this.jobService.postJob(userId, postJobDto);
        return {
            job, 
            message: "job created Successfully",
            success:  true
        }
    }

    @Get()
    async getJobs(
        @Query() query:string
    ){
        const jobs = await this.jobService.getAllJobs(query);
        return {
            jobs,
            success: true
        }
    }
}
