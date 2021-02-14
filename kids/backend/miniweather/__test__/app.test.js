//https://itnext.io/writing-tests-in-your-node-js-api-application-cfb5592df466

import supertest from "supertest";
import { app, server } from "../app.mjs";

describe("Test the APIs", () => {
    afterAll(async () => {
        await server.close();
    });

    it("tests search API", async () => {
        const response = await supertest(app).get(
            "/api/location/search/?query=shanghai"
        );
        expect(response.status).toBe(200);
        expect(response.body[0].title).toBe("san jose");
    });
});
