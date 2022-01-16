import { extendType, asNexusMethod, scalarType,  intArg, nonNull, objectType, stringArg } from "nexus";  
import { NexusGenObjects } from "../../nexus-typegen";  

export const Card = objectType({
    name: "Card", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        t.string("description");
        t.list.field('insideList', {
            type: 'List',
            async resolve (parent, args, context)  {
                return await context.prisma.card
                    .findUnique({
                        where: { id: parent.id || undefined },
                    })
                    .insideList();
            },
        });
        

    },
});


export const CardQuery = extendType({  
    type: "Query",
    definition(t) {
        //get cards of list
        t.nonNull.list.nonNull.field("getAllCardsOfList", {
            type: "Card",
            args: {
                insideListId: nonNull(intArg())
            },
            async resolve(parent, args, context) {    
                return await context.prisma.card
                    .findMany({
                        where: {insideListId :args.insideListId}
                    });
                },   
        });
        //get cards of list
        t.nonNull.list.nonNull.field("getAllCardsOfList", {
            type:"Card",
            args: {
                listId: nonNull(intArg())
            },
            async resolve(parent, args, context) {    
                return await context.prisma.card
                    .findMany({
                        where: {insideListId :args.listId}
                    });
                 
                },   
        });
        
        //get all cards
        t.nonNull.list.nonNull.field("getAllCards", {   
            type: "Card",
            async resolve(parent, args, context, info) {    
                return await context.prisma.card.findMany();
            },
        });
        // get card by id
        t.field("getCardById",{
            type: "Card",
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context, info) {    
                return await context.prisma.card.findUnique({
                    where: {id: args.id}
                });
            },

        })

    },
});

export const CardMutation = extendType({ 
    type: "Mutation",    
    definition(t) {
        t.list.nonNull.field("createCardofList", {  
            type: "Board",  
            args: {   
                title: nonNull(stringArg()),
                description: stringArg(),
                listId: nonNull(intArg()),
            },
            
            async resolve(parent, args, context) {    
                const { userId } = context;
                const { title,  listId, description } = args;
                if (!userId) { 
                    throw new Error("Cannot create without logging in.");
                }
                await context.prisma.card.create({
                    data: {
                        title,
                        description,
                        insideList: { connect: { id : listId }},
                    },
                });

                return await context.prisma.board
                    .findMany({
                    });
            },
        });

        
        // update a card details
        t.list.field('updateCardDetails', {
            type: 'Board',
            args: {
                id: nonNull(intArg()),
                title: (stringArg()),
                //label: (stringArg()),
                description: (stringArg()),
                //deadline: (stringArg()),
            },
            async resolve(parent, args, context) {
               
                const { userId } = context;
                await context.prisma.card.update({
                    where: {id: args.id},
                    data: {
                 //       label: args.label,          this will be used in future
                      description: args.description,
                 //       deadline: args.deadline,
                          title: args.title,
                    }
                })
                return await context.prisma.board
                    .findMany({
                        // where: {createdByUserId :userId}
                    });
            }
        });

        // drag and drop card
        t.list.field('dragCard', {
            type: 'Board',
            args: {
                id: nonNull(intArg()),
                //label: (stringArg()),
                //description: (stringArg()),
                //deadline: (stringArg()),
                listId: nonNull(intArg()),
            },
            async resolve(parent, args, context) {
               
                const { userId } = context;
                await context.prisma.card.update({
                    where: {id: args.id},
                    data: {
                 //       label: args.label,          this will be used in future
                 //       description: args.description,
                 //       deadline: args.deadline,
                          insideList: { connect: { id : args.listId }},
                    }
                })
                return await context.prisma.board
                    .findMany({
                        // where: {createdByUserId :userId}
                    });
            }
        });

        // delete a card by id
        t.list.field('deleteCardById', {
            type: 'Board',
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context) {
                const { userId } = context;
                await context.prisma.card.delete({
                    where: {id: args.id}
                })
                return await context.prisma.board
                    .findMany({
                        // where: {createdByUserId :userId}
                    });
            }
        });

    },
});





