import { Application } from "express";
import request from "supertest";
import { setupApp } from "../app";
import { setupDb } from "../db";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('POST /candidates', () => {
    let app: Application;

    beforeAll(async () => {
        const db = await setupDb();
        app = await setupApp(db);
    });

    beforeEach(() => {
        mockFetch.mockReset();
    });

    it('should create a new candidate successfully', async () => {
        mockFetch.mockResolvedValueOnce({ status: 201 });

        const res = await request(app)
            .post('/candidates')
            .send({ firstName: 'Jan', lastName: 'Kowalski', email: 'jan@test.com' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Candidate added successfully');
        expect(res.body.candidate.email).toBe('jan@test.com');
    });

    it('should return 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/candidates')
            .send({ firstName: 'Jan' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toContain('Last name is required');
        expect(res.body.errors).toContain('Email is required');
    });

    it('should return 400 for invalid email format', async () => {
        const res = await request(app)
            .post('/candidates')
            .send({ firstName: 'Jan', lastName: 'Kowalski', email: 'not-an-email' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toContain('Invalid email format');
    });

    it('should return 409 when candidate already exists', async () => {
        mockFetch.mockResolvedValueOnce({ status: 409 });

        const res = await request(app)
            .post('/candidates')
            .send({ firstName: 'Anna', lastName: 'Nowak', email: 'anna@test.com' });

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Candidate with this email already exists.');
    });

    it('should retry on 504 and succeed on second attempt', async () => {
        mockFetch
            .mockResolvedValueOnce({ status: 504 })
            .mockResolvedValueOnce({ status: 201 });

        const res = await request(app)
            .post('/candidates')
            .send({ firstName: 'Piotr', lastName: 'Zając', email: 'piotr@test.com' });

        expect(res.status).toBe(201);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should return 504 after exhausting all retries', async () => {
        mockFetch.mockResolvedValue({ status: 504 });

        const res = await request(app)
            .post('/candidates')
            .send({ firstName: 'Maria', lastName: 'Wiśniewska', email: 'maria@test.com' });

        expect(res.status).toBe(504);
        expect(mockFetch).toHaveBeenCalledTimes(3);
    }, 10000);
});

describe('GET /candidates', () => {
    let app: Application;

    beforeAll(async () => {
        const db = await setupDb();
        app = await setupApp(db);
    });

    it('should return candidates list', async () => {
        const res = await request(app).get('/candidates');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});