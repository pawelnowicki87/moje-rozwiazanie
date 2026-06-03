# API Documentation

## Candidate Management API

This API allows you to add Candidate in a database. The main endpoint for adding a new candidate is `/candidates`.

# API Documentation

## Candidate Management API

This API allows you to add candidates to a database. The main endpoint for adding a new candidate is `/candidates`.

### Endpoint: `POST /candidates`

### Authentication

To interact with this API, you must include a valid API key in the request header. The API key should be provided in the `x-api-key` header.

- **API Key**: Your API key is required to authenticate and authorize the request.
- **Location**: Include the API key in the request headers:

  ```text
  x-api-key: <your-api-key>
  ```

If the API key is invalid or missing, the server will respond with a 403 Forbidden error


#### Example Request

This endpoint expects a JSON object in the request body containing the following fields:

| Field              | Type    | Description                                            | Required | Example               |
|--------------------|---------|--------------------------------------------------------|----------|-----------------------|
| `firstName`        | string  | The candidate's first name.                            | Yes      | `"John"`              |
| `lastName`         | string  | The candidate's last name.                             | Yes      | `"Doe"`               |
| `email`            | string  | The candidate's email address.                         | Yes      | `"john.doe@example.com"` |


```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
}
```

#### Example Response

##### Success (201)

If the candidate is successfully added to the database, the response will return a `201` status code along with a success message and the candidate's details.

##### Response Body:

```json
{
  "message": "Candidate added successfully",
  "candidate": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2025-02-03T10:00:00Z"
  }
}
```

##### Validation Errors (400)

If the provided data does not meet the validation criteria, the response will return a `400` status code along with an error message detailing the validation issues.

##### Response Body:

```json
{
  "message": "Validation failed",
  "errors": [
    "First name is required",
    "Email is required",
    "Invalid email format"
  ]
}
```

##### Conflict (409)

If the candidate already exists in the database (based on the email), the response will return a `409` status code indicating a conflict.

##### Response Body:

```json
{
  "message": "Candidate with this email already exists."
}
```

##### Service Unavailable (504)

In rare cases, a random error may be triggered to simulate service unavailability. This can happen approximately 10% of the time.

##### Response Body:

```json
{
  "message": "Service unavailable"
}
```

##### Forbidden (403)

Thrown when LEGACY_API_KEY is not provided or is incorrect.

##### Response Body:

```json
{
  "message": "Forbidden: Invalid API Key."
}
```