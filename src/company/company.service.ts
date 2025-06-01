import { BadRequestException, Get, Injectable, NotAcceptableException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService){}

    async registerCompany(
        userId:string,
        registerCompanyDto: RegisterCompanyDto
    ){
        const {
            name,
            description, 
            website,
            location,
            logo
        } = registerCompanyDto
        
        const exisingCompany = await this.prisma.company.findUnique({
            where: {name}
        })

        if(exisingCompany){
            throw new BadRequestException("You canot add same company")
        }

        const company = await this.prisma.company.create({
            data:{
                name,
                description, 
                website,
                location,
                logo,
                userId
            }
        })
        return company
    }
    async getCompanies(userId:string){
        const companies = await this.prisma.company.findMany({
            where:{userId}
        })

        if (!companies || companies?.length == 0){
            throw new NotAcceptableException("company not Found")
        }
        return companies
    }

    
    async getCompanyById(id:string) {
        const company = await this.prisma.company.findUnique({
            where: { id }
        })

        if(!company){
            throw new NotAcceptableException("Company not found")
        }
        
        return company
    }

    async deleteCompanyById(id:string) {
        const company = await this.prisma.company.delete({
            where: { id }
        })

        if(!company){
            throw new NotAcceptableException("No Company to delete")
        }
        
        return company
    }

    async updateCompany(id:string, updateCompanyDto: UpdateCompanyDto){
        const company = await this.prisma.company.update({
            where: { id },
            data: updateCompanyDto
        })

        if (!company){
            throw new NotAcceptableException("Company not found")
        }
        return company
    }
}
