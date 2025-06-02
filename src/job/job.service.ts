import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostJobDto } from './dto/job.dto';
// import { Prisma } from 'generated/prisma';
import { Prisma } from '@prisma/client'; // ✅ USE THIS ONLY


type JobWithCompany = Prisma.JobGetPayload<{ include: { company: true } }>;
@Injectable()
export class JobService {
  
    constructor(private prisma: PrismaService){}

    async postJob(createdById: string, postJobDto:PostJobDto){
        const{
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            companyId,
            
        } = postJobDto

        const job = await this.prisma.job.create({
            data:{
                title,
                description,
                requirements,
                salary,
                location,
                jobType,
                experienceLevel,
                position,
                companyId,
                createdById,
            } 
        })

        if(!job){
            throw new Error('Failed to create job')
        }
        return job
    }
    async getAllJobs(query: any): Promise<
    Prisma.JobGetPayload<{ include: { company: true } }>[]
  > {
    const { keyword, location, jobType, salary } = query;
    const salaryRange = salary?.split('-');

    let jobs: JobWithCompany[];

    if (keyword || location || jobType || salary) {
      jobs = await this.prisma.job.findMany({
        where: {
          ...(keyword &&
            keyword !== '' && {
              OR: [
                { title: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } },
              ],
            }),
          ...(location &&
            location !== '' && {
              location: { contains: location, mode: 'insensitive' },
            }),
          ...(jobType &&
            jobType !== '' && {
              jobType: { contains: jobType, mode: 'insensitive' },
            }),
          ...(salary &&
            salaryRange?.length === 2 && {
              salary: {
                gte: parseFloat(salaryRange[0]),
                lte: parseFloat(salaryRange[1]),
              },
            }),
        },
        include: { company: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      jobs = await this.prisma.job.findMany({
        skip: 0,
        take: 6,
        include: { company: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!jobs || jobs.length === 0) {
      throw new NotFoundException('Jobs are not found');
    }

    return jobs;
  }


  //job by id
  async getJobById(id:string){
    const job = await this.prisma.job.findUnique({
      where:{id:id},
      
  })
  if (!job){
    throw new NotFoundException('Job is not found')
  }
  return job
}

// get jobs by user id 
async getJobByUserId(createdById){
  try{
    const jobs = await this.prisma.job.findMany({
      where:{createdById},
      include:{company:true},
      orderBy:{createdAt:'desc'},
    })
    if(!jobs || jobs?.length === 0){
      throw new NotFoundException('Jobs are not found')
    }
    return jobs
  }catch(error){ 
    throw new NotFoundException('Jobs are not found')
  }
}

//create favourite
async createFavourite(jobId: string, userId: string) {
    const existingFav = await this.prisma.favourite.findFirst({
      where: { jobId, userId },
    });

    if (existingFav) {
      throw new BadRequestException('Job is already in your favourites');
    }

    try {
      const newFav = await this.prisma.favourite.create({
        data: {
          userId,
          jobId,
        },
      });

      return {
        success: true,
        message: 'Job added to favourites successfully',
        favourite: newFav,
      };
    } catch (error) {
      throw new NotFoundException('Failed to add job to favourites');
    }
  }

  //get user favourites
  async getFavourite(userId: string){
    try{
      const getJobs = await this.prisma.favourite.findMany({
        where: { userId },
        include: {
          job: {include: {company: true}},
        },
      })
      if (!getJobs?.length){
        throw new NotFoundException('No favourite jobs found')
      }
      return getJobs
    }
    catch(error){
      throw new NotFoundException('Failed to get favourite jobs')
    }
  }

}
