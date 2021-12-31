import { extendType, asNexusMethod, scalarType,  intArg, nonNull, objectType, stringArg } from "nexus";  
import { NexusGenObjects } from "../../nexus-typegen";  

export const Card = objectType({
    name: "Card", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title"); 
        t.nonNull.string("label"); 
        t.nonNull.string("description"); 
        t.nonNull.string("deadline");
        t.field("createdBy", {   
            type: "User",
            async resolve(parent, args, context) {  
                return await context.prisma.card
                    .findUnique({ where: { id: parent.id } })
                    .createdBy();
            },
        });
        t.field('list', {
            type: 'List',
            resolve: (parent, args, context) => {
                return context.db.card
                    .findUnique({
                        where: { id: parent.id || undefined },
                    })
                    .list();
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
        //get cards of user
        t.nonNull.list.nonNull.field("getAllCardsOfUser", {
            type:"Card",
            async resolve(parent, args, context) {    
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot get cards without logging in.");
                }

                return await context.prisma.card
                    .findMany({
                        where: {createdById :userId}
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
        t.nonNull.field("createCard", {  
            type: "Card",  
            args: {   
                title: nonNull(stringArg()),
                label: nonNull(stringArg()),
                description: nonNull(stringArg()),
                deadline: nonNull(stringArg()),
            },
            
            async resolve(parent, args, context) {    
                
                const { title, label, description, deadline } = args;
                const { userId } = context;

                if (!userId) { 
                    throw new Error("Cannot create without logging in.");
                }

                const newCard = context.prisma.card.create({
                    data: {
                        title,
                        label,
                        description,
                        deadline,
                        createdBy: { connect: { id: userId } }, 
                    },
                });

                return await newCard;
            },
        });


        // update a card by id
        t.field('updateCardById', {
            type: 'Card',
            args: {
                id: nonNull(intArg()),
                title: (stringArg()),
                label: (stringArg()),
                description: (stringArg()),
                deadline: (stringArg()),
            },
            async resolve(parent, args, context) {
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot update without logging in.");
                }

                return await context.prisma.card.update({
                    where: {id: args.id},
                    data: {
                        label: args.label,
                        title: args.title,
                        description: args.description,
                        deadline: args.deadline,
                    }
                })
            }
        });
        // delete a card by id
        t.field('deleteCardById', {
            type: 'Card',
            args: {
                id: nonNull(intArg())
            },
            async resolve(parent, args, context) {
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot delete without logging in.");
                }

                return await context.prisma.card.delete({
                    where: {id: args.id}
                })
            }
        });

    },
});