const axios = require('axios');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull
} = require('graphql');

const HeroType = new GraphQLObjectType({
    name: "Hero",
    fields: () => (
        { 
            id: { type: GraphQLString },
            humanName: { type: GraphQLString }, 
            heroName: { type: GraphQLString }, 
            powers: { type: GraphQLList(GraphQLString) },
        }
    )
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hero: {
            type: HeroType,
            args:{
                id:{type: GraphQLString}
            }, 
            resolve(parentValue, args){
                // code to get data from the data source
                return axios.get('http://localhost:3000/heroes/' + args.id)
                    .then(res => res.data);
            }
        },
        heroes: {
            type: new GraphQLList(HeroType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/heroes')
                    .then(res => res.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation', 
    fields: { 
        addHero: { 
            type: HeroType, 
            args: {
                heroName: {type: new GraphQLNonNull(GraphQLString)},
                humanName: {type: new GraphQLNonNull(GraphQLString)},
                powers: {type: new GraphQLNonNull(GraphQLList(GraphQLString))}
            }, 
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/heroes', {
                    heroName: args.heroName, 
                    humanName: args.humanName, 
                    powers: args.powers
                })
                .then(res => res.data);
            }
        }, 
        deleteHero: { 
            type: HeroType, 
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            }, 
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/heroes/' + args.id)
                .then(res => res.data);
            }
        }, 
        editHero: { 
            type: HeroType, 
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                heroName: {type: GraphQLString},
                humanName: {type: GraphQLString},
                powers: {type: GraphQLList(GraphQLString)}
            }, 
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/heroes/' + args.id, args)
                .then(res => res.data);
            }
        }, 
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery, 
    mutation
});