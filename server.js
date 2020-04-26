const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const courses = require('./courses');

const typeDefs = `

    type Course {
        id: ID!
        title: String!
        views: Int
    }

    input CourseInput {
        title: String!
        views: Int
    }

    type Query {
        getCourses(page: Int, limit: Int = 1): [Course]
    }

    type Mutation {
        addCourse(input: CourseInput): Course
    }

`;

const resolvers = {

    Query: {
        getCourses(obj, { page, limit }) {
            if (page !== undefined) {
                return courses.slice(page * limit, (page + 1) * limit);
                //init in 0
                //return courses.slice((page-1) * limit, (page) * limit);
            }
            return courses;
        }
    },
    Mutation: {
        addCourse(obj, { input }) {
            const id = String(courses.length + 1);
            const course = { id, ...input }; //spread operator, extract properties and combine with first obj
            courses.push(course);
            return course;
        }
    }

}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers

});

const server = new ApolloServer({
    schema: schema
});

server.listen().then(({ url }) => {
    console.log(`Server on ${url}`);
});