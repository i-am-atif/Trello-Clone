import { extendType, asNexusMethod, scalarType,  intArg, nonNull, objectType, stringArg } from "nexus";  
import { NexusGenObjects } from "../../nexus-typegen";  

export const Board = objectType({
    name: "Board", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        
        t.nonNull.list.nonNull.field("users", {    
            type: "User",
            resolve(parent, args, context) {   
                return context.prisma.board  
                    .findMany({ where: { id: parent.id } })
                    .users();
            },
        }); 
        t.nonNull.list.nonNull.field('lists', {
            type: 'List',
            resolve: (parent, args, context) => {
                return context.db.board
                    .findMany({
                        where: { id: parent.id },
                    })
                    .boards();
            },
        });
    },
});


export const BoardMutation = extendType({ 
    type: "Mutation",    
    definition(t) {
        //create a board
        t.nonNull.field("createBoard", {  
            type: "Board",  
            args: {   
                title: nonNull(stringArg()),
            },
            
            async resolve(parent, args, context) {    
                
                const { title } = args;
                const { userId } = context;
                
                if (!userId) { 
                    throw new Error("Cannot create without logging in.");
                }

                const newBoard = context.prisma.board.create({
                    data: {
                        title,
                    },
                });

                return await newBoard;
            },
        });
        
        // delete a board by id
        t.field('deleteBoardById', {
            type: 'Board',
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context) {
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot delete without logging in.");
                }

                return await context.prisma.board.delete({
                    where: {id: args.id}
                })
            }
        });

    },
});