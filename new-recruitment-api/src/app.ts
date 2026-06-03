import express from "express";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";
import { CandidatesController } from "./candidates.controller";

export const setupApp = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
    const app = express();

    app.use(express.json());

    app.use(new CandidatesController(db).router);

    return app;
}