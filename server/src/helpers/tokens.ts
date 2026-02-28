

export const  TOKENS ={

     DB: Symbol("DB"),

    //  Email
    EmailService:Symbol("EmailService"),

    // Roles
    RoleController:Symbol("RoleController"),
    RoleRepository:Symbol("RoleRepository"),
    RoleService:Symbol("RoleService"),


    // Auth
    AuthRepository:Symbol("AuthRepository"),
    AuthService:Symbol("AuthService"),
    AuthControllers:Symbol("AuthRepository"), 

    // Device
    DeviceRepository:Symbol("DeviceRepository"),
    DeviceService:Symbol("DeviceService"),
    DeviceController:Symbol("DeviceController"),

    // Tokens
    TokenRepository:Symbol("TokenRepository"),
    TokenService:Symbol("TokenService"),

    // Users
    UserRepositoy: Symbol("UserRepositoy"),
    UserService : Symbol("UserService"),
    UserController : Symbol("UserController"),

    // Participants
    ParticipantsController:Symbol("ParticipantsController"),
    ParticipantsRepository:Symbol("ParticipantsRepository"),
    ParticipantsService: Symbol("ParticipantsService"),

    // Messages
    MessageController:Symbol("MessageController"),
    MessageRepository:Symbol("MessageRepository"),
    MessageServices : Symbol("MessageServices"),

    // Conversations
    ConversationRepository:Symbol("ConversationRepository"),
    ConversationsController:Symbol("ConversationsController"),
    ConversationServices: Symbol("ConversationServices")
}