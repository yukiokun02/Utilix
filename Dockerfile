# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY drizzle.config.ts ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY client/ ./client/
COPY server/ ./server/
COPY shared/ ./shared/

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S utilitix -u 1001

# Copy built application
COPY --from=builder --chown=utilitix:nodejs /app/dist ./dist
COPY --from=builder --chown=utilitix:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=utilitix:nodejs /app/package.json ./

# Create logs directory
RUN mkdir -p logs && chown utilitix:nodejs logs

# Switch to non-root user
USER utilitix

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server/index.js"]