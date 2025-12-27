# GearGuard Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **API Health Check**
   Visit `http://localhost:5000/api/health` to verify the server is running.

## Project Structure

- `config/` - Configuration files (database, environment)
- `controllers/` - Route controllers (business logic)
- `models/` - MongoDB Mongoose models
- `routes/` - Express routes
- `middleware/` - Custom middleware (auth, validation, error handling)
- `validations/` - Request validation schemas
- `services/` - Business logic services
- `utils/` - Utility functions
- `tests/` - Test files

## API Documentation

See the main project README or `../API_DOCUMENTATION.md` for complete API reference.

