import { expect } from 'chai';
import { graphql, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { getGraphQLQueryArgs, getMongoDbQueryResolver } from '../../src/queryResolver';

describe('GraphQL 17 integration', () => {
    it('accepts an application type and translates query arguments', async () => {
        const article = new GraphQLObjectType({
            name: 'Article',
            fields: {
                id: { type: GraphQLString },
                title: { type: GraphQLString }
            }
        });
        let received: any;
        const schema = new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'Query',
                fields: {
                    article: {
                        type: article,
                        args: getGraphQLQueryArgs(article),
                        resolve: getMongoDbQueryResolver(article, async (filter, projection, options) => {
                            received = { filter, projection, options };
                            return { id: 'article-1', title: 'One' };
                        })
                    }
                }
            })
        });

        const result = await graphql({
            schema,
            source: 'query { article(filter: { title: { EQ: "One" } }) { id title } }'
        });

        expect(result.errors).to.equal(undefined);
        expect(JSON.parse(JSON.stringify(result.data))).to.deep.equal({
            article: { id: 'article-1', title: 'One' }
        });
        expect(received.filter).to.deep.equal({ title: { $eq: 'One' } });
        expect(received.projection).to.deep.equal({ id: 1, title: 1 });
    });
});
