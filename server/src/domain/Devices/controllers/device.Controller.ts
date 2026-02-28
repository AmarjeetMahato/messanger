import { Request, Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { DeviceService } from "../services/device.service";
import { createDeviceZodSchema } from "../Dtos/deviceDtos";
import { HTTPSTATUS } from "../../../utils/https.config";
import { Result } from "pg";

@injectable()
export class DeviceController{
   
     constructor(@inject(TOKENS.DeviceService) private service:DeviceService){}

     registerDevice = async(req:Request, res:Response,next:NextFunction) :Promise<void> =>{

             const  result = createDeviceZodSchema.safeParse(req.body);
             if(!result?.success){
                res.status(HTTPSTATUS.BAD_REQUEST).json({
                    message:"Invalid fields",
                    success:false
                })
                return;
             }
                       
          try {
                  const device = await this.service.regiterUserDevice(result?.data);
                  res.status(HTTPSTATUS.OK).json({
                        message:"Device register sucessfully",
                        success:true,
                        device
                  });
          } catch (error) {
             console.log(error);
             next(error); 
          }
     }
 }