import { Request,Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { RoleService } from "../services/role.Services";
import { RoleSchema } from "../dtos/roleDtos";
import { HTTPSTATUS } from "../../../utils/https.config";

@injectable()
export class RoleController{
     
     constructor(@inject(TOKENS.RoleService) private service :RoleService){}

     createRole = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                const  parsed =  RoleSchema.safeParse(req.body);
                if(!parsed.success){
                    res.status(400).json({
                          message:"Invalid Fields",
                          success:false
                    })
                    return;
                }

            try {
                   const  role = await this.service.createRole(parsed.data);
                   res.status(HTTPSTATUS.CREATED).json({
                      message:"",
                      success:true,
                      role
                   })
             } catch (error) {
                next(error);
            }
     }
}