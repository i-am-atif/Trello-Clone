import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";  

export const List = objectType({
    name: "List", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        
        t.nonNull.list.nonNull.field('cards', {
            type: 'Card',
            async resolve (parent, args, context) {
                return await context.prisma.list
                    .findUnique({
                        where: { id: parent.id },
                    })
                    .cards();
            },
        });

        t.list.field('insideBoard', {
            type: 'Board',
            async resolve (parent, args, context) {
                return await context.prisma.list
                    .findUnique({
                        where: { id: parent.id || undefined },
                    })
                    .insideBoard();
            },
        });
    },
});


export const ListQuery = extendType({  
    type: "Query",
    definition(t) {
        //get lists of board
        t.nonNull.list.nonNull.field("getAllListsOfBoard", {
            type: "List",
            args: {
                boardId: nonNull(intArg())
            },
            async resolve(parent, args, context) {   

                return await context.prisma.list
                    .findMany({
                        where: {insideBoardId :args.boardId}
                    });
                },   
        });
        
        //get all lists
        t.nonNull.list.nonNull.field("getAllLists", {   
            type: "List",
            async resolve(parent, args, context, info) {    
                return await context.prisma.list.findMany();
            },
        });

        // get list by id
        t.field("getListById",{
            type: "List",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context, info) {    
                return await context.prisma.list.findUnique({
                    where: {id: args.id}
                });
            },

        })

    },
});

export const ListMutation = extendType({ 
    type: "Mutation",    
    definition(t) {
        t.list.nonNull.field("createList", {  
            type: "Board",  
            args: {   
                title: nonNull(stringArg()),
                boardId: nonNull(intArg()),
            },
            
            async resolve(parent, args, context) {    
                const { userId } = context;
                const { title, boardId } = args;
                
                await context.prisma.list.create({
                    

                    data: {
                        title,
                        insideBoard: { connect : { id: boardId}}
                    },
                });

                return await context.prisma.board
                    .findMany({
                        where: {createdByUserId :userId}
                    });
            },
        });
        
        //update list
        t.list.field('updateListDetails', {
            type: 'Board',
            args: {
                id: nonNull(intArg()),
                title: nonNull(stringArg()),
            },
            async resolve(parent, args, context) {
                const { userId } = context;
                await context.prisma.list.update({
                    where: {id: args.id},
                    data: {
                          title: args.title,
                    }
                })
                return await context.prisma.board
                    .findMany({
                        where: {createdByUserId :userId}
                    });
                
   
            }
        });
        // delete a list by id
        t.list.field('deleteListById', {
            type: 'Board',
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context) {
                const { userId } = context;

                await context.prisma.list.delete({
                    where: {id: args.id}
                })

                return await context.prisma.board
                    .findMany({
                        where: {createdByUserId :userId}
                    });
            }
        });

    },
});

