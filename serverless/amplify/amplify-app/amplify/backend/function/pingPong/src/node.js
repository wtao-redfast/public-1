import gql from "graphql-tag";
import { print } from "graphql";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";

const createNode = gql`
    mutation CreateNode(
        $input: CreateNodeInput!
        $condition: ModelNodeConditionInput
    ) {
        createNode(input: $input, condition: $condition) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
`;

const postNode = async (name, description) => {
    const body = {
        query: print(createNode),
        variables: {
            input: {
                id: uuid(),
                name: name,
                description: description,
            },
        },
    };

    await fetch(
        "https://gbatf32l25bc7ptbtyk2xfjnsu.appsync-api.us-west-2.amazonaws.com/graphql",
        {
            method: "post",
            headers: {
                "x-api-key": "da2-olu2w3u4jragjmc7ogtvh367ci",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );
};

export default postNode;
