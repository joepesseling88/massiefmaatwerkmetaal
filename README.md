## Running the Project with Docker

This project includes a Docker setup for serving the JavaScript static files using Nginx. Below are the instructions and details specific to this setup:

### Requirements
- **Node.js 20 (alpine)** is used in the build stage (for extensibility, no dependencies are currently installed).
- **Nginx (alpine)** is used to serve the static JS files.

### Environment Variables
- No environment variables are required by default. If you need to use a `.env` file for future configuration, uncomment the `env_file` line in the `docker-compose.yml`.

### Build and Run Instructions
1. Ensure Docker and Docker Compose are installed on your system.
2. From the project root, run:
   ```sh
   docker compose up --build
   ```
   This will build the image from the `./js` directory and start the Nginx server to serve the JS files.

### Special Configuration
- The Dockerfile creates a non-root user (`appuser`) for running the Nginx server, enhancing security.
- Only the `main.js` file from the `./js` directory is served via Nginx at `/js/main.js`.
- No volumes or additional services are configured, as this is a static file server.

### Ports
- The service exposes **port 80** (`localhost:80`), serving the static JS file via Nginx.

---

*Update this section if you add more services or environment variables in the future.*