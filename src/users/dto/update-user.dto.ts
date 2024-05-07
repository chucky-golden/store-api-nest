import { PartialType } from '@nestjs/mapped-types'
import { CreateOrderDto, SignupDto } from './user.dto'

export class UpdateUserDto extends PartialType (SignupDto){}
export class UpdateOrderDto extends PartialType (CreateOrderDto){}