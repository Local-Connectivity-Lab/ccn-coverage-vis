#!/bin/bash

# Set variables
PRIMARY_DOMAIN="ccn-coverage-vis"
CERT_DIR="/certs"  # Use absolute path
DAYS_VALID=365

# Add all domains that might be used to access your service
DOMAINS=(
  "$PRIMARY_DOMAIN"
  "localhost"
  "127.0.0.1"
)

# Create directory for certificates if it doesn't exist
mkdir -p $CERT_DIR

echo "Generating self-signed certificates..."

# Generate private key
openssl genrsa -out $CERT_DIR/private-key.pem 2048

# Create config file for SAN support
cat > $CERT_DIR/openssl.cnf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = $PRIMARY_DOMAIN

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
EOF

# Add all domains to the config file
for i in "${!DOMAINS[@]}"; do
  echo "DNS.$((i+1)) = ${DOMAINS[$i]}" >> $CERT_DIR/openssl.cnf
done

# Generate a CSR with the config
openssl req -new -key $CERT_DIR/private-key.pem -out $CERT_DIR/csr.pem -config $CERT_DIR/openssl.cnf

# Generate the self-signed certificate
openssl x509 -req -days $DAYS_VALID -in $CERT_DIR/csr.pem -signkey $CERT_DIR/private-key.pem -out $CERT_DIR/certificate.pem -extensions v3_req -extfile $CERT_DIR/openssl.cnf

# Create a full chain file
cat $CERT_DIR/certificate.pem > $CERT_DIR/fullchain.pem

# Set proper permissions (readable by all)
chmod 644 $CERT_DIR/private-key.pem
chmod 644 $CERT_DIR/certificate.pem
chmod 644 $CERT_DIR/fullchain.pem

# Try to generate PKCS12 file but don't fail if it doesn't work
openssl pkcs12 -export -out $CERT_DIR/certificate.pfx -inkey $CERT_DIR/private-key.pem -in $CERT_DIR/certificate.pem -passout pass: || echo "PKCS12 export failed, but continuing"

# Verify file creation and permissions
echo "Certificates generated successfully in $CERT_DIR directory!"
echo "Files generated with permissions:"
ls -la $CERT_DIR/

# Verify certificate content
echo "Verifying certificate:"
openssl x509 -in $CERT_DIR/certificate.pem -text -noout | head -n 15

# Verify private key
echo "Verifying private key:"
openssl rsa -in $CERT_DIR/private-key.pem -check -noout || echo "Private key verification failed"