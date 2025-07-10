FROM node:22-alpine

# Create Directory
WORKDIR /app

# Install dependencies first (use cache)
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose default Next.js port
#EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev" ,"--", "-H", "0.0.0.0"]