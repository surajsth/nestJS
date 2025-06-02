import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompanyDto } from 'src/company/dto/company.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateStatusDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
    constructor(private prisma: PrismaService) {}
    async applyJob(applicantId: string, jobId: string){
        if(!jobId){
            throw new BadRequestException("Job id required")
        }

        const existingApplication = await this.prisma.application.findFirst({
            where: {jobId, applicantId},
        })

        if(existingApplication){
            throw new BadRequestException("Application already exists")
        }
        const job = await this.prisma.job.findUnique({
            where: {id: jobId}
        })
        if(!job){
            throw new BadRequestException("Job not found")
        }

        const newApplication = await this.prisma.application.create({
            data: {
                jobId,
                applicantId,
            }
        })
        return newApplication
    }

    async getApplicationJob(applicantId: string){
        const applications = await this.prisma.application.findMany({
            where: {applicantId},
            orderBy: {createdAt: 'desc'},
            include: {
                job: {include: {company:true}}
            }
        })

        if (!applications || applications?.length == 0){
            throw new NotFoundException("No application found")
        }
        return applications
    }

    async getApplicants(jobId:string){
        const job = await this.prisma.job.findUnique({
            where: {id: jobId},
            include: {
                applications: {
                    orderBy: {createdAt: 'desc'},
                    include: {applicant: true}
                }
            }
        })

        if (!job){
            throw new NotFoundException("Job not found")
        }
        return job
    }

    async updateStatus(id:string, updateStatusDto: UpdateStatusDto){
        const { status} = updateStatusDto
        const application = await this.prisma.application.findUnique({
            where: {id},
        })

        if(!application){
            throw new NotFoundException("Application not found")
        }

        const updatedApplication = await this.prisma.application.update({
            where: {id},
            data: {status}
        })
        return updatedApplication
    }

   
}
