#!/bin/bash

if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [[ "$ID" == "ubuntu" || "$ID" == "debian" ]]; then
        set -e

        apt update
        apt install -y python3 pkg-config build-essential libcairo2-dev libpango1.0-dev
        npm ci
        
        echo "Script execution completed successfully."
    else
        echo "This script is designed to run only on Ubuntu."
        echo "Current OS: $PRETTY_NAME"
        exit 1
    fi
else
    echo "Cannot determine the operating system."
    exit 1
fi
