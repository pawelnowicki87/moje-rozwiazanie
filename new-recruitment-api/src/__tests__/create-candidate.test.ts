import { Application } from "express";
import { setupApp } from "../app";

describe('Create Candidate', () => {
    let app: Application;

    beforeAll(async () => {
        app = await setupApp();
    })

    it('should create a new candidate successfully', async () => {
    })
})
