import { container, Lifecycle } from "tsyringe";
import { db, DrizzleDb } from "../config/database";
import { TOKENS } from "./tokens";
import { AuthRepository } from "../domain/Auth/repository/auth.Repository";
import { AuthService } from "../domain/Auth/services/auth.Service";
import { AuthControllers } from "../domain/Auth/controllers/auth.Controller";
import { UserRepositoy } from "../domain/Users/repository/user.Repository";
import { UserService } from "../domain/Users/services/user.Service";
import { UserController } from "../domain/Users/controllers/user.Controller";
import { MessageRepository } from "../domain/Messages/repository/message.Repository";
import { MessageServices } from "../domain/Messages/services/message.Services";
import { MessageController } from "../domain/Messages/controllers/message.Controller";
import { ConversationRepository } from "../domain/Conversations/repository/conversation.Repository";
import { ConversationServices } from "../domain/Conversations/services/conversation.Service";
import { ConversationsController } from "../domain/Conversations/controllers/conversations.Controller";
import { ParticipantsRepository } from "../domain/Participants/repository/participants.Repository";
import { ParticipantsService } from "../domain/Participants/services/participants.Services";
import { ParticipantsController } from "../domain/Participants/controllers/participants.Controller";
import { DeviceRepository } from "../domain/Devices/repository/device.repository";
import { DeviceService } from "../domain/Devices/services/device.service";
import { DeviceController } from "../domain/Devices/controllers/device.Controller";
import { EmailService } from "../domain/Auth/services/email.Service";
import { TokenRepository } from "../domain/Token/repository/token.Repository";
import { TokenService } from "../domain/Token/services/token.Service";
import { RoleRepository } from "../domain/Role/repository/role.Repository";
import { RoleService } from "../domain/Role/services/role.Services";


// ==========================================
// 1. Database Connection (Static Value)
// ==========================================
container.register<DrizzleDb>(TOKENS.DB, { useValue: db });


// ==========================================
// 2. Email Module
// ==========================================
container.register(TOKENS.EmailService,  {useClass : EmailService}, {lifecycle:Lifecycle.Singleton})


// ==========================================
// 2. Auth Module
// ==========================================
container.register(TOKENS.AuthRepository, { useClass: AuthRepository }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.AuthService, { useClass: AuthService }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.AuthControllers, { useClass: AuthControllers });

// ==========================================
// 2. Device Module
// ==========================================
container.register(TOKENS.RoleRepository, {useClass: RoleRepository}, {lifecycle:Lifecycle.Singleton})
container.register(TOKENS.RoleService, {useClass:RoleService}, {lifecycle:Lifecycle.Singleton})
// ==========================================
// 2. Device Module
// ==========================================
container.register(TOKENS.DeviceRepository,{useClass:DeviceRepository}, {lifecycle:Lifecycle.Singleton})
container.register(TOKENS.DeviceService,{useClass:DeviceService}, {lifecycle:Lifecycle.Singleton})
container.register(TOKENS.DeviceController,{useClass:DeviceController});
// ==========================================
// 2. Token Module
// ==========================================
container.register(TOKENS.TokenRepository, {useClass:TokenRepository}, {lifecycle:Lifecycle.Singleton})
container.register(TOKENS.TokenService, {useClass:TokenService}, {lifecycle:Lifecycle.Singleton})
// ==========================================
// 3. Users Module
// ==========================================
container.register(TOKENS.UserRepositoy, { useClass: UserRepositoy }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.UserService, { useClass: UserService }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.UserController, { useClass: UserController });

// ==========================================
// 4. Messages Module
// ==========================================
container.register(TOKENS.MessageRepository, { useClass: MessageRepository }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.MessageServices, { useClass: MessageServices }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.MessageController, { useClass: MessageController });

// ==========================================
// 5. Conversations Module
// ==========================================
container.register(TOKENS.ConversationRepository, { useClass: ConversationRepository }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.ConversationServices, { useClass: ConversationServices }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.ConversationsController, { useClass: ConversationsController });

// ==========================================
// 6. Participants Module
// ==========================================
container.register(TOKENS.ParticipantsRepository, { useClass: ParticipantsRepository }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.ParticipantsService, { useClass: ParticipantsService }, { lifecycle: Lifecycle.Singleton });
container.register(TOKENS.ParticipantsController, { useClass: ParticipantsController });

export { container };