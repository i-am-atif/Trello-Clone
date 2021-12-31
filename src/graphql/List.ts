import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";  

export const List = objectType({
    name: "List", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        
        t.nonNull.list.nonNull.field('cards', {
            type: 'card',
            resolve: (parent, args, context) => {
                return context.db.list
                    .findUnique({
                        where: { id: parent.id },
                    })
                    .cards();
            },
        });

        t.list.field('boards', {
            type: 'Board',
            resolve: (parent, args, context) => {
                return context.db.list
                    .findUnique({
                        where: { id: parent.id || undefined },
                    })
                    .boards();
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
        t.nonNull.field("createList", {  
            type: "List",  
            args: {   
                title: nonNull(stringArg()),
            },
            
            async resolve(parent, args, context) {    
                
                const { title } = args;
                
                const newList = context.prisma.list.create({
                    data: {
                        title,
                    },
                });

                return await newList;
            },
        });

        // delete a list by id
        t.field('deleteListById', {
            type: 'List',
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context) {
                return await context.prisma.list.delete({
                    where: {id: args.id}
                })
            }
        });

    },
});

