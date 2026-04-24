import express from 'express';
import { container } from 'tsyringe';
import { RoleController } from '../domain/Role/controllers/role.Controllers';
import { requireRole } from '../middleware/roleMiddleware';
import { verifyToken } from '../middleware/tokenVerification';


const router = express.Router();

const roleController  = container.resolve(RoleController);

router.post("/create",requireRole("ADMIN"),roleController.createRole)
router.post("/get-role/:roleId", verifyToken, roleController.fetchRoleById)
router.delete("/:roleId/delete",verifyToken,roleController.deleteRoleById)


export default router;