import { nonNull } from "@nexus/schema";
import { objectType } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("firstName");
        t.nonNull.string("lastName");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("cards", {    
            type: "Card",
            resolve(parent, args, context) {   
                return context.prisma.user  
                    .findUnique({ where: { id: parent.id } })
                    .cards();
            },
        }); 
        t.nonNull.list.nonNull.field("boards", {    
            type: "Board",
            resolve(parent, args, context) {   
                return context.prisma.user
                    .findMany({ where: { userId: parent.id } })
                    .boards();
            },
        }); 
      
    },
});
