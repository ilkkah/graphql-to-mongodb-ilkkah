import { GraphQLFieldsType } from './common';
type GraphQLLeafOperators = 'EQ' | 'GT' | 'GTE' | 'IN' | 'ALL' | 'LT' | 'LTE' | 'NE' | 'NEQ' | 'NEQ' | 'NIN' | 'REGEX' | 'OPTIONS' | 'NOT';
type MongoDbLeafOperators = '$eq' | '$gt' | '$gte' | '$in' | '$all' | '$lt' | '$lte' | '$ne' | '$neq' | '$nin' | '$regex' | '$options' | '$not';
export type MongoDbRootOperators = '$or' | '$and' | '$nor';
export type GraphQLFilter = {
    [key: string]: GraphQLFilter[] | GraphQLObjectFilter | GraphQLLeafFilter;
    OR?: GraphQLFilter[];
    AND?: GraphQLFilter[];
    NOR?: GraphQLFilter[];
};
type GraphQLObjectFilter = {
    [key: string]: GraphQLObjectFilter | GraphQLLeafFilter | ('exists' | 'not_exists') | any[];
    opr?: 'exists' | 'not_exists';
};
type GraphQLLeafFilterInner = {
    [key in GraphQLLeafOperators]?: any | any[];
};
type GraphQLLeafFilter = GraphQLLeafFilterInner & {
    NOT?: GraphQLLeafFilterInner;
    opr?: 'exists' | 'not_exists';
    value?: any;
    values?: any[];
};
export type MongoDbFilter = {
    [key: string]: MongoDbLeafFilter | {
        $elemMatch: MongoDbObjectFilter;
    } | {
        $exists?: boolean;
    } | MongoDbFilter[];
    $or?: MongoDbFilter[];
    $and?: MongoDbFilter[];
    $nor?: MongoDbFilter[];
};
type MongoDbObjectFilter = {
    [key: string]: MongoDbLeafFilter | {
        $elemMatch: MongoDbObjectFilter;
    } | {
        $exists?: boolean;
    } | boolean;
};
type MongoDbLeafFilter = {
    [key in MongoDbLeafOperators]?: any | any[];
} & {
    $not?: MongoDbLeafFilter | RegExp;
};
export declare const getMongoDbFilter: (graphQLType: GraphQLFieldsType, graphQLFilter?: GraphQLFilter) => MongoDbFilter;
export {};
