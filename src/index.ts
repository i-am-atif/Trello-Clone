import { ApolloServer } from "apollo-server";

import { context } from "./context";
import {ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefaultOptions} from "apollo-server-core"
import { schema } from "./schema";
export const server = new ApolloServer({
    schema,
    context,  
    introspection:true,
    plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
    ? ApolloServerPluginLandingPageLocalDefault()
    : ApolloServerPluginLandingPageLocalDefault(),
    ],  
});

const port = {port:process.env.PORT || 5000};

server.listen(port).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
