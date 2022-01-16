import { ApolloServerPluginUsageReportingDisabled } from "apollo-server-core";
import { extendType, asNexusMethod, scalarType,list,  intArg, nonNull, objectType, stringArg } from "nexus";  
import { NexusGenObjects } from "../../nexus-typegen";  

export const Board = objectType({
    name: "Board", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        
        t.nonNull.list.nonNull.field("users", {    
            type: "User",
            async resolve(parent, args, context) {   
                return await context.prisma.board  
                    .findUnique({ where: { id: parent.id || undefined} })
                    .users();
            },
        }); 
        t.nonNull.list.nonNull.field('lists', {
            type: 'List',
            async resolve (parent, args, context) {
                return await context.prisma.board
                    .findUnique({
                        where: { id: parent.id || undefined},
                    })
                    .lists();
            },
        });
    },
});
export const BoardQuery = extendType({
    type:"Query",
    definition(t){
        //get boards of user
        t.nonNull.list.nonNull.field("getBoardsOfUser", {
            type:"Board",
            async resolve(parent, args, context) {    
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot get cards without logging in.");
                }

                return await context.prisma.board
                    .findMany({
                        where: {users:{
                            some:{
                                id:userId
                            },
                        },
                    },
                    });
                 
                },   
        });
        //get all boards
        t.nonNull.list.nonNull.field("getAllBoards", {   
            type: "Board",
            async resolve(parent, args, context, info) {    
                return await context.prisma.board.findMany();
            },
        });
    }
})

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
                const {  userId } = context;
                
                if (!userId) { 
                    throw new Error("Cannot create without logging in.");
                }

                const newBoard = context.prisma.board.create({
                    data: {
                        title,
                        users: { connect: { id: userId } },
                    },
                });

                return await newBoard;
            },
        });

        // assign user to a board by id
        t.field('assignUserstoBoard', {
            type: 'Board',
            args: {
                id: nonNull(intArg()),
                userId: nonNull(intArg()),
             
            },
            async resolve(parent, args, context) {
                const {  userId } = args;
                return await context.prisma.board.update({
                    where: {id: args.id},
                    data: {
                        users: { connect: { id: userId } },
                    },
                });
            }
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