import express from 'express';
import { container } from 'tsyringe';
import { RoleController } from '../domain/Role/controllers/role.Controllers';
import { requireRole } from '../middleware/roleMiddleware';
import { verifyToken } from '../middleware/tokenVerification';
import { validateRequest } from '../middleware/zodValidations';
import { roleCreateSchemaParams, RoleSchema } from '../domain/Role/dtos/roleDtos';


const router = express.Router();

const roleController  = container.resolve(RoleController);

router.post("/create",requireRole("ADMIN"),validateRequest({
        body:RoleSchema}), roleController.createRole)

router.post("/get-role/:roleId", verifyToken,validateRequest({
       params:roleCreateSchemaParams}), roleController.fetchRoleById)

router.delete("/:roleId/delete",verifyToken,validateRequest({
       params:roleCreateSchemaParams}), roleController.deleteRoleById)


export default router;