# Imagem base
FROM node:18-alpine

# Diretório da aplicação
WORKDIR /app

# Copia apenas dependências primeiro (melhor cache)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando de start
CMD ["npm", "start"]