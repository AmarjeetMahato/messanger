import express from "express"
import { container } from "tsyringe";
import { DeviceController } from "../domain/Devices/controllers/device.Controller";
import { verifyToken } from "../middleware/tokenVerification";
import { validateRequest } from "../middleware/zodValidations";
import { createDeviceZodSchemaParams,updateDeviceZodSchema} from "../domain/Devices/Dtos/deviceDtos";



const router = express.Router();

const deviceController = container.resolve(DeviceController);

router.get("/:deviceId/get_device_id", verifyToken, validateRequest({
      params:createDeviceZodSchemaParams}), deviceController.getDeviceById)

router.get("/get_user_device",verifyToken,deviceController.getUserDevices)

router.get("/get_active_device", verifyToken, deviceController.getActiveDevices)

router.patch("/:deviceId/update",verifyToken, validateRequest({
     body:updateDeviceZodSchema, params:createDeviceZodSchemaParams}), deviceController.updateDevice)

router.post("/:deviceId/logout_device", verifyToken,validateRequest({
      params: createDeviceZodSchemaParams}), deviceController.logoutDevice)

router.get("/logout_all_devices", verifyToken,deviceController.logoutAllDevices)

router.get("/get_all_devices",verifyToken, deviceController.getAllDevices)

router.get("/search", verifyToken, deviceController.searchDevices)

router.post("/find_by_user_and_fingerprint", verifyToken, deviceController.findByUserAndFingerprint)

export default router;