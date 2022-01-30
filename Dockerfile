FROM node:17-stretch

RUN apt-get update -y
RUN apt-get install openssh-server -y
WORKDIR /nodesite/
COPY ./nodesite/ .
RUN npm i

CMD [ "npm","start" ]