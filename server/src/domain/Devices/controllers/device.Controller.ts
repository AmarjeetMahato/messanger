import { Request, Response,NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { createDeviceZodSchema, DeviceFilterDTO, DeviceType, Platform } from "../Dtos/deviceDtos";
import { HTTPSTATUS } from "../../../utils/https.config";
import type { IDeviceService } from "../services/device.service.Interface";
import { BadRequestException } from "../../../utils/Catch-error";

@injectable()
export class DeviceController{
   
     constructor(@inject(TOKENS.DeviceService) private service:IDeviceService){}

     
     getDeviceById = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                   const {deviceId} = req.params as {deviceId:string}
                   const userId = req.userId
           try {
                  const result = await this.service.getDeviceById(deviceId, userId!);
                  res.status(HTTPSTATUS.OK).json({
                        message:"Device fetch successfully",
                        success: true,
                        data:result
                  })
           } catch (error) {
                next(error)
           }

     } 

     getUserDevices = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                   const userId = req.userId
            try {
                   const  result = await this.service.getUserDevices(userId!)
                   res.status(HTTPSTATUS.OK).json({
                        message:"All Device fetch successfully",
                        success: true,
                        data:result
                  })
            } catch (error) {
                 next(error)
            }
     }

     getActiveDevices = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                   const userId = req.userId
            try {
                   const  result = await this.service.getUserDevices(userId!)
                   res.status(HTTPSTATUS.OK).json({
                        message:"Fetch all active devices successfully",
                        success: true,
                        data:result
                  })
            } catch (error) {
                 next(error)
            }
     }

     updateDevice = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                   const userId = req.userId
            try {
                   const  result = await this.service.updateDevice(userId!,req.body)
                   res.status(HTTPSTATUS.OK).json({
                        message:"Update device successfully",
                        success: true,
                        data:result
                  })
            } catch (error) {
                 next(error)
            }
     }

     logoutDevice = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                   const {deviceId} = req.params as {deviceId: string}
                   const userId = req.userId
            try {
                   const  result = await this.service.logoutDevice( deviceId,userId!)
                   res.status(HTTPSTATUS.OK).json({
                        message:"logout device successfully",
                        success: true,
                        data:result
                  })
            } catch (error) {
                 next(error)
            }
     }

     logoutAllDevices = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                   const userId = req.userId
            try {
                   const  result = await this.service.logoutAllDevices(userId!)
                   res.status(HTTPSTATUS.OK).json({
                        message:"logout all device successfully",
                        success: true,
                        data:result
                  })
            } catch (error) {
                 next(error)
            }
     }

     getAllDevices = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
                     // 🔹 Extract query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // 🔹 Optional: validate
    if (page < 1 || limit < 1) {
      throw new BadRequestException("Page and limit must be positive numbers");
    }
            try {
                   const  result = await this.service.getAllDevices({page, limit})
                   res.status(HTTPSTATUS.OK).json({
                        message:"fetch all devices successfully",
                        success: true,
                         data: result,
                        pagination: {
                               page,
                               limit
                     }
                  })
            } catch (error) {
                 next(error)
            }
     }

     searchDevices = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
             const userId = req.userId;
             const params: DeviceFilterDTO = {};

    if (req.query.deviceType) {
      params.deviceType = req.query.deviceType as DeviceType;
    }

    if (req.query.platform) {
      params.platform = req.query.platform as Platform;
    }

    if (req.query.isTrusted !== undefined) {
      params.isTrusted = req.query.isTrusted === "true";
    }
            try {
                   const  result = await this.service.searchDevices(userId!, params)
                   res.status(HTTPSTATUS.OK).json({
                        message:"fetch all devices successfully",
                        success: true,
                        data:result
                  })
            } catch (error) {
                 next(error)
            }
     }

    findByUserAndFingerprint = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
                           
       try {
                        const userId = req.userId
                        const result = await this.service.findByUserAndFingerprint(userId!,req.body as string);
                        res.status(HTTPSTATUS.OK).json({
                             message:" device fetch successfully",
                             success:false,
                             data:result
                        })
       } catch (error) {
         next(error)
       }
     }



 }