CREATE TABLE CandidateJobOffer (
    candidate_id INTEGER NOT NULL,
    job_offer_id INTEGER NOT NULL,
    PRIMARY KEY (candidate_id, job_offer_id),
    FOREIGN KEY (candidate_id) REFERENCES Candidate(id),
    FOREIGN KEY (job_offer_id) REFERENCES JobOffer(id)
);