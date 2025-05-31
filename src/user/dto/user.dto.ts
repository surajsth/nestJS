import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray, IsUrl } from "class-validator";


export class RegisterUserDto{
    @IsNotEmpty()
    @IsString()
    fullname: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    profileBio?: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    profileSkills?: string[]

    @IsOptional()
    @IsUrl()
    profileResume?: string
    
    @IsOptional()
    @IsString()
    profileResumeOriginalName?: string

    @IsOptional()
    @IsString()
    profilePhoto?: string

    @IsOptional()
    @IsString()
    role?: any
}


export class UpdateUserDto{
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    fullname?: string

    @IsNotEmpty()
    @IsOptional()
    @IsEmail()
    email?: string

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    phoneNumber?: string

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    profileBio?: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    profileSkills?: string[]

    @IsOptional()
    @IsUrl()
    profileResume?: string
    
    @IsOptional()
    @IsString()
    profileResumeOriginalName?: string

    @IsOptional()
    @IsString()
    profilePhoto?: string

    @IsOptional()
    @IsString()
    role?: any
}

export class UserResponseDto{
    id:string
    fullname: string
    email: string
    phoneNumber: string
    role: string
    profileBio?: String
    profileSkills?: String
    profileResume?: String
    profileResumeOriginalName?: String
    profileCompanyId?: String
    profilePhoto?:String        
    createdAt?: Date  
    updatedAt?:Date  
}
