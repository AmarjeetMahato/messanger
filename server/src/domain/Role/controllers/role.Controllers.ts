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
   
            try {
                   const  role = await this.service.createRole(req.body);
                   res.status(HTTPSTATUS.CREATED).json({
                      message:"Role Create Successfully",
                      success:true,
                      role
                   })
             } catch (error) {
                next(error);
            }
     }


     fetchRoleById = async ( req: Request, res:Response,  next:NextFunction):Promise<void> =>{
                   const {roleId} = req.params as {roleId : string}
              try {
                      const role = await this.service.fetchRoleByName(roleId)
                       res.status(HTTPSTATUS.CREATED).json({
                      message:"Role fetch Successfully",
                      success:true,
                      role
                   })
              } catch (error) {
                 next(error);
              }
     }

     deleteRoleById = async ( req: Request, res:Response,  next:NextFunction):Promise<void> =>{
                   const {roleId} = req.params as {roleId : string}
              try {
                    await this.service.deleteRole(roleId)
                       res.status(HTTPSTATUS.CREATED).json({
                      message:"Role deleted Successfully",
                      success:true,
                      
                   })
              } catch (error) {
                 next(error);
              }
     }
}