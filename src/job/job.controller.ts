import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
  async getJobs(@Query() query: any) {
    const jobs = await this.jobService.getAllJobs(query);
    return {
      jobs,
      success: true,
    };
  }


//   get job by id
    @Get(':id')
    async getJobById(@Param('id') jobId: string) {
        const job = await this.jobService.getJobById(jobId);
        return{
            job,
            success: true
        }
    }

    // get job by userid
    @UseGuards(JwtAuthGuard)
    @Post('admin')
    async getJobByUserId(@Req() req: any) {
        const userId = req.user.id;
        const jobs = await this.jobService.getJobByUserId(userId);
        
        return {
        jobs,
        success: true, 
        };
    }

    //create Favourite
    @UseGuards(JwtAuthGuard)
    @Post('favourite/:id')
    async favouriteJob(@Req() req, @Param('id') jobId: string) {
        const userId = req.user.id;
        const favourite = await this.jobService.createFavourite(jobId, userId);
        
        return {
        success: true,
        message: 'Job added to favourites successfully',
        favourite,
        };
    }

    // get favourite
    @UseGuards(JwtAuthGuard)
    @Post('favourites')
    async getFavourite(@Req() req,) {
        const userId = req.user.id;
        const favourite = await this.jobService.getFavourite(userId);
        
        return {
        success: true,
        message: 'Job added to favourites successfully',
        favourite,
        };
    }
}
