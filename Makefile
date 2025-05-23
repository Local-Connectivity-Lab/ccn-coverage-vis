# Name of the Docker container
DOCKER_IMAGE=node:22-slim
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

.PHONY: build-test
build-test:
	@echo "Create test docker container for $(VIS_DOCKER_IMAGE_NAME)"

	docker build --build-arg NGINX_CONFIG="local-nginx.conf" -t $(VIS_DOCKER_IMAGE_NAME) -f vis.dockerfile .

# Validate semantic version format
validate-semver-%:
	@echo "Validating version format: $*"
	@if ! echo "$*" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$$' > /dev/null; then \
		echo "Error: Version must be in semantic version format (e.g., 1.2.3)"; \
		exit 1; \
	fi

.PHONY: build
build:
	@echo "Create docker container for $(VIS_DOCKER_IMAGE_NAME)"
	docker build -t $(VIS_DOCKER_IMAGE_NAME) -f vis.dockerfile .

# Build with specific version (e.g., make build-1.2.3)
build-%: validate-semver-%
	@echo "Create docker container for $(VIS_DOCKER_IMAGE_NAME) with version $*"
	docker build -t $(VIS_DOCKER_IMAGE_NAME):$* -f vis.dockerfile .


# The target for development
.PHONY: dev
dev:
	docker run --rm -it \
		-v $(CURRENT_DIR):/app \
		-w /app \
		-p $(EXPOSED_PORT):$(EXPOSED_PORT) \
		$(DOCKER_IMAGE) /bin/bash
