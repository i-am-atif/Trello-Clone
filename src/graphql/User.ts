import { nonNull } from "@nexus/schema";
import { objectType, extendType} from "nexus";
import { intArg } from "nexus";
export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.nonNull.string("email");

        t.nonNull.list.nonNull.field("boards", {    
            type: "Board",
            resolve(parent, args, context) {   
                return context.prisma.user
                    .findUnique({ where: { id: parent.id || undefined} })
                    .boards();
            },
        }); 
      
    },
});


export const UserQuery = extendType({  
    type: "Query",
    definition(t) {
        
        //get all users
        t.nonNull.list.nonNull.field("getAllUsers", {   
            type: "User",
            async resolve(parent, args, context, info) {    
                return await context.prisma.user.findMany();
            },
        });

    },
});
