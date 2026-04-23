FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY ./package.json ./package.json
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./packages ./packages
COPY ./apps/ws-backend/package.json ./apps/ws-backend/package.json
RUN pnpm i
COPY ./apps/ws-backend ./apps/ws-backend
RUN pnpm run dev:generate
RUN cd apps/ws-backend && npx tsc -b && cd ../..
EXPOSE 8080
CMD ["pnpm","run","start:ws"]
