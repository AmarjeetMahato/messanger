import express from 'express';
import { container } from 'tsyringe';
import { RoleController } from '../domain/Role/controllers/role.Controllers';
import { requireRole } from '../middleware/roleMiddleware';


const router = express.Router();

const roleController  = container.resolve(RoleController);

router.post("/create",requireRole("ADMIN"),roleController.createRole)



export default router;