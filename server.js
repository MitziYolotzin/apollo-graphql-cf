const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const courses = require('./courses');

const typeDefs = `

    type Course {
        id: ID!
        title: String!
        views: Int
    }

    type Query {
        getCourses(page: Int, limit: Int = 1): [Course]
    }

`;

const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: {
        Query: {
            getCourses(obj, { page, limit }) {
                if (page !== undefined) {
                    return courses.slice(page * limit, (page + 1) * limit);
                    //init in 0
                    //return courses.slice((page-1) * limit, (page) * limit);
                }
                return courses;

            }
        }
    }

})

const server = new ApolloServer({
    schema: schema
});

server.listen().then(({ url }) => {
    console.log(`Server on ${url}`);
});