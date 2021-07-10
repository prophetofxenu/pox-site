FROM alpine:latest
ENV SRC="/poxsitebuild"

RUN apk update
RUN apk upgrade
RUN apk add bash
RUN apk add entr
RUN apk add nodejs
RUN apk add npm

COPY ./entrypoint.sh .
COPY ./relaunch.sh .

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
