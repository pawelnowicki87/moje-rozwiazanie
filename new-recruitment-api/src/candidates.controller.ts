import { Request, Response, Router } from "express";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

const LEGACY_API_URL = process.env.LEGACY_API_URL ?? 'http://localhost:4040';
const LEGACY_API_KEY = process.env.LEGACY_API_KEY ?? '0194ec39-4437-7c7f-b720-7cd7b2c8d7f4';
const MAX_RETRIES = 3;

interface CandidateBody {
    firstName: string;
    lastName: string;
    email: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validateCandidate = (body: Partial<CandidateBody>): string[] => {
    const errors: string[] = [];
    if (!body.firstName) errors.push('First name is required');
    if (!body.lastName) errors.push('Last name is required');
    if (!body.email) errors.push('Email is required');
    if (body.email && !/\S+@\S+\.\S+/.test(body.email)) errors.push('Invalid email format');
    return errors;
};

export class CandidatesController {
    readonly router = Router();
    private db: Database<sqlite3.Database, sqlite3.Statement>;

    constructor(db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db;
        this.router.get('/candidates', this.getAll.bind(this));
        this.router.post('/candidates', this.create.bind(this));
    }

    async getAll(_req: Request, res: Response) {
        const candidates = await this.db.all('SELECT * FROM Candidate');
        res.json(candidates);
    }

    async create(req: Request, res: Response) {
        const body = req.body as Partial<CandidateBody>;

        const errors = validateCandidate(body);
        if (errors.length > 0) {
            res.status(400).json({ message: 'Validation failed', errors });
            return;
        }

        const { firstName, lastName, email } = body as CandidateBody;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            if (attempt > 0) {
                await sleep(200 * attempt);
            }

            try {
                const legacyRes = await fetch(`${LEGACY_API_URL}/candidates`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': LEGACY_API_KEY,
                    },
                    body: JSON.stringify({ firstName, lastName, email }),
                });

                if (legacyRes.status === 504) {
                    continue;
                }

                if (legacyRes.status === 409) {
                    res.status(409).json({ message: 'Candidate with this email already exists.' });
                    return;
                }

                if (legacyRes.status === 400) {
                    const data = await legacyRes.json();
                    res.status(400).json(data);
                    return;
                }

                if (legacyRes.status === 201) {
                    await this.db.run(
                        'INSERT INTO Candidate (first_name, last_name, email) VALUES (?, ?, ?)',
                        [firstName, lastName, email]
                    );

                    const candidate = await this.db.get(
                        'SELECT * FROM Candidate WHERE email = ?',
                        [email]
                    );

                    res.status(201).json({ message: 'Candidate added successfully', candidate });
                    return;
                }
            } catch {
                continue;
            }
        }

        res.status(504).json({ message: 'Service unavailable' });
    }
}