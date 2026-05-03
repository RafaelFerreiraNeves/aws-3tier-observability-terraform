FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY app.js .
CMD ["node", "app.js"]
