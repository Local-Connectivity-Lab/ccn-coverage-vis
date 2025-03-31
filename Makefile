# Name of the Docker container
DOCKER_IMAGE=node:22-slim
include .env

# The current directory (mapped to the container)
CURRENT_DIR=$(shell pwd)

.PHONY: clean
clean:
	@echo "Clean"
	rm -rf build

.PHONY: build
build:
	@echo "Create docker container"
	docker build -t ccn-coverage-vis .

# The target for development
.PHONY: dev
dev:
	docker run --rm -it \
		-v $(CURRENT_DIR):/app \
		-w /app \
		-p $(EXPOSED_PORT):$(EXPOSED_PORT) \
		$(DOCKER_IMAGE) /bin/bash
