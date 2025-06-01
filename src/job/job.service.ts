import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostJobDto } from './dto/job.dto';
import { Prisma } from 'generated/prisma';


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
    async getAllJobs(query: any) {
    const { keyword, location, jobType, salary } = query;
    const salaryRange = salary?.split("-");
    
    let jobs: Prisma.JobGetPayload<{ include: { company: true } }>[] = [];

    if (keyword || location || jobType || salary) {
      jobs = await this.prisma.job.findMany({
        where: {
          ...(keyword && keyword !== '' && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ]
          }),
          ...(location && location !== '' && {
            location: { contains: location, mode: 'insensitive' }
          }),
          ...(jobType && jobType !== '' && {
            jobType: { contains: jobType, mode: 'insensitive' }
          }),
          ...(salary && salaryRange?.length === 2 && {
            salary: {
              gte: parseInt(salaryRange[0], 10),
              lte: parseInt(salaryRange[1], 10)
            }
          })
        },
        include: { company: true },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      jobs = await this.prisma.job.findMany({
        skip: 0,
        take: 6,
        include: { company: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!jobs || jobs.length === 0) {
      throw new NotFoundException("Jobs are not found");
    }

    return jobs;
  }

}
