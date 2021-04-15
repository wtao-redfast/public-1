const gql = require('graphql-tag');
const graphql = require('graphql');
const fetch = require('node-fetch');
const uuid = require('uuid');
const aws_export = require('./aws-exports');

const createTodo = gql`
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

const postTodo = async (name, description) => {
    const body = {
        query: graphql.print(createTodo),
        variables: {
            input: {
                id: uuid.v4(),
                name: name,
                description: description,
                completed: true
            },
        },
    };

    await fetch(
        aws_export.aws_appsync_graphqlEndpoint,
        {
            method: "post",
            headers: {
                "x-api-key": aws_export.aws_appsync_apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );
};

module.exports = postTodo;