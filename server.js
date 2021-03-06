const { ApolloServer } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const courses = require('./courses');

const typeDefs = `

    type Course {
        id: ID!
        title: String!
        views: Int
    }

    type Alert {
        message: String
    }

    input CourseInput {
        title: String!
        views: Int
    }


    type Query {
        getCourses(page: Int, limit: Int = 1): [Course]
        getCourse(id: ID!): Course

    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(id: ID!, input: CourseInput): Course
        deleteCourse(id: ID!): Alert
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
        },
        getCourse(obj, { id }) {
            console.log(id);
            //when function return true, return value, when match find id
            return courses.find((course) => id == course.id);
        }

    },
    Mutation: {
        addCourse(obj, { input }) {
            const id = String(courses.length + 1);
            const course = { id, ...input }; //spread operator, extract properties and combine with first obj
            courses.push(course);
            return course;
        },
        addCourse(obj, { input }) {
            //receive
            //const { title, views } = input;
            const id = String(courses.length + 1);
            const course = { id, ...input }; //spread operator, extract properties and combine with first obj
            courses.push(course);
            return course;

        },
        updateCourse(obj, { id, input }) {
            //send function, execute for each element in array, send element as argument 
            //return true, position, when they are the same id, receive the item´s position to update 
            const courseIndex = courses.findIndex((course) => id === course.id);
            const course = courses[courseIndex];
            //save in a new variable, and construct new obj with value of element, and additional values they modify
            const newCourse = Object.assign(course, input);
            course[courseIndex] = newCourse;

            return newCourse;
        },
        deleteCourse(obj, { id }) {
            //find element
            //function, if it returns false, the new array, no contains the element
            courses = courses.filter((course) => course.id != id);
            return {
                message: `The course with id ${id} it was removed`
            }

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