# Use Node 22 to satisfy Vite 7 requirements
# --- Stage 1: Base setup ---
FROM node:22-alpine as base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

# --- Stage 2: Development target (For instant reload) ---
FROM base as dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# --- Stage 3: Production Build step ---
FROM base as build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# --- Stage 4: Production Serve with Nginx ---
FROM nginx:alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT=80
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
CMD ["nginx", "-g", "daemon off;"]