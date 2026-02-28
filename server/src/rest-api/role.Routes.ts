import express from 'express';
import { container } from 'tsyringe';
import { RoleController } from '../domain/Role/controllers/role.Controllers';


const router = express.Router();

const roleController  = container.resolve(RoleController);

router.post("/create", roleController.createRole)



export default router;