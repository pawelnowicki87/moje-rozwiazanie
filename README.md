## Prerequisites

To get started with this project, ensure you have the following tools installed and properly set up:

**Ensure you have the following installed:**
- Docker
- Node.js (LTS version recommended)


### 1. **Docker**
- Docker is required to run the **Legacy API** (JavaScript-based application) in a containerized environment.
- The project includes both a `Dockerfile` and `docker-compose.yml` to streamline the setup and execution of the **External API**.
  - **`docker-compose`** will automatically build and launch the service, accessible on **port 4040**.

### 2. **Node.js**
- The **Legacy API** uses Node.js (specifically for the Express server in `src/server.js`).
- The **New Application** (built with TypeScript) also requires Node.js for running TypeScript files and managing dependencies.

### 3. **Environment Setup**
- **For Legacy API**: 
  - Start the service in a containerized environment by running (in the root directory):
    ```bash
    docker-compose up -d
    ```
  - This will bring up the Legacy API on **port 4040**.

- **For New Application**:
  - Install the necessary dependencies by running:
    ```bash
    npm install
    ```
  - To run the application, use either of the following commands depending on your needs:
    - For development mode:
      ```bash
      npm dev
      ```
    - To start the application:
      ```bash
      npm start
      ```

## Project Structure Overview

- **`new-recruitment-api/`**: This folder contains the **New Recruitment API** that is still under development.
- **`legacy-api/`**: This folder holds the **Legacy API**, which is the older API that is being replaced.
