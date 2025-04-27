# Name of the Docker container
DOCKER_IMAGE=node:22-slim
VIS_DOCKER_IMAGE_NAME_PREFIX=ghcr.io/local-connectivity-lab
VIS_DOCKER_IMAGE_NAME=ccn-coverage-vis
include .env

# The current directory (mapped to the container)
CURRENT_DIR=$(shell pwd)

.PHONY: clean
clean:
	@echo "Clean"
	rm -rf build
	docker volume rm ccn-coverage-vis_certs
	docker rmi $(docker images --filter=reference='ccn-coverage-vis*' -q)

.PHONY: build
build:
	@echo "Create docker container for $(VIS_DOCKER_IMAGE_NAME)"

	docker build -t $(VIS_DOCKER_IMAGE_NAME_PREFIX)/$(VIS_DOCKER_IMAGE_NAME) -f vis.dockerfile .

# The target for development
.PHONY: dev
dev:
	docker run --rm -it \
		-v $(CURRENT_DIR):/app \
		-w /app \
		-p $(EXPOSED_PORT):$(EXPOSED_PORT) \
		$(DOCKER_IMAGE) /bin/bash
