import { IsEnum } from "class-validator";
import { Role } from "@prisma/client";

export class selectRoleDto {
  @IsEnum(Role)
    role: Role;
}