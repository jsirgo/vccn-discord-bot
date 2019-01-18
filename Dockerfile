FROM node:10.15.0-alpine
COPY . /vccn-discord-bot
WORKDIR /vccn-discord-bot
RUN npm install && npm run build && npm prune --production && rm -rf /vccn-discord-bot/src
CMD ["npm", "start"]