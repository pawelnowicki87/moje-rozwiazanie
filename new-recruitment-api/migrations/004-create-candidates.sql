CREATE TABLE Candidate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    experience_years INTEGER,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'nowy',
    consent_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);