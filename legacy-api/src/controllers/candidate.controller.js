const candidatesDB = [];

const validateCandidate = (candidate) => {
  const errors = [];

  if (!candidate.firstName) {
    errors.push("First name is required");
  }

  if (!candidate.lastName) {
    errors.push("Last name is required");
  }

  if (!candidate.email) {
    errors.push("Email is required");
  }

  if (!/\S+@\S+\.\S+/.test(candidate.email)) {
    errors.push("Invalid email format");
  }

  candidate.validated = true;

  return errors;
};

export const addCandidate = (req, res) => {
  const { firstName, lastName, email } = req.body;

  const newCandidate = {
    firstName,
    lastName,
    email,
    createdAt: new Date().toISOString(),
  };

  const existingCandidate = candidatesDB.find(
    (candidate) => candidate.email === newCandidate.email
  );
  if (existingCandidate) {
    res
      .status(409)
      .json({ message: "Candidate with this email already exists." });
    return;
  }

  const randomError = Math.random() < 0.1;
  if (randomError) {
    res.status(504).json({ message: "Service unavailable" });
    return;
  }

  const validationErrors = validateCandidate(newCandidate);

  if (validationErrors.length > 0) {
    res
      .status(400)
      .json({ message: "Validation failed", errors: validationErrors });
    return;
  }

  candidatesDB.push(newCandidate);

  res
    .status(201)
    .json({ message: "Candidate added successfully", candidate: newCandidate });
  return;
};
