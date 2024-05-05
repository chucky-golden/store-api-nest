import { PartialType } from '@nestjs/mapped-types'
import { SignupDto } from './admin.dto'

export class UpdateAdminDto extends PartialType (SignupDto){}