FROM ubuntu:latest

WORKDIR /

RUN apt-get update && apt-get install -y openssl

COPY scripts/generate-certs.sh .

RUN chmod +x generate-certs.sh
CMD ["./generate-certs.sh"]