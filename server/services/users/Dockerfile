#Base Image
FROM node:16.13

#path di container dimana berisi codingan kita(path bebas sesuai kesepakatan bersama)
WORKDIR /usr/local/users

#untuk set ENV dalam aplikasi kita
ENV PORT=4001

#copy deps yang ada di apps ke WORKDIR
COPY package.json package-lock.json /usr/local/users/

#install npm & menghapus cache
RUN npm install

RUN npm install -g nodemon

#copy semua file & folder ke WORKDIR
COPY ./ ./

#execute apps:production
CMD ["npm", "run", "start"] 