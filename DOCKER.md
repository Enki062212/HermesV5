# Hermes + Exponify - Docker Build & Deployment Guide

## Quick Start

### Development (with live reload)
```bash
docker-compose up hermes-frontend
```
Access at: http://localhost:5173

### Production Build
```bash
# Build production image
docker-compose up hermes-production

# Or build manually
docker build --target production -t hermes-prod .
docker run -p 80:80 hermes-prod
```

## Solving Vite React Babel Issues

### Problem 1: Babel Plugin Conflicts
**Symptom:** `Error: Cannot find module '@babel/plugin-transform-react-jsx'`

**Docker Solution:**
- Uses Node 20 Alpine with locked dependency versions
- `npm ci` instead of `npm install` for reproducible builds
- Isolated environment prevents global package conflicts

### Problem 2: SWC vs Babel Issues
**Symptom:** `Error: @vitejs/plugin-react-swc failed to load`

**Fix in vite.config.js:**
```javascript
export default defineConfig({
  plugins: [react()], // Uses Babel by default
  // Or force SWC:
  // plugins: [react({ jsxRuntime: 'automatic' })]
})
```

**Docker ensures:**
- Consistent Node version (20.x)
- No OS-specific binary issues (SWC has native bindings)

### Problem 3: Windows Path Issues
**Symptom:** Build fails on Windows but works on Mac/Linux

**Docker Solution:**
- Linux container standardizes path handling
- No backslash vs forward slash issues
- Consistent file watching

## Build Commands

```bash
# Development with hot reload
docker-compose up --build

# Production build
docker build --target production -t hermes:v1.0 .

# Push to registry
docker tag hermes:v1.0 your-registry/hermes:v1.0
docker push your-registry/hermes:v1.0

# Run production locally
docker run -d -p 80:80 --name hermes hermes:v1.0
```

## Environment Variables

Create `.env` file:
```
VITE_BACKEND_URL=http://api.yoursite.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-key
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs hermes-frontend

# Rebuild without cache
docker-compose build --no-cache
```

### Port already in use
```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module not found errors
```bash
# Clear volumes and rebuild
docker-compose down -v
docker-compose up --build
```
