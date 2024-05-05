import { PartialType } from '@nestjs/mapped-types'
import { SignupDto } from './user.dto'

export class UpdateUserDto extends PartialType (SignupDto){}