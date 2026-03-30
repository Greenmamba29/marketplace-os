# Makefile for Marketplace OS

.PHONY: dev-all install-all infra-up infra-down build-all

# List of all frontend applications
APPS = hub mrodirect cheemos buildsource medsupplyos voltsource lithiumbuy foodops packsource agroops labsource rigsource careops govsource surplusos netsource securesource uniformos workspaceos ingredientos barrelhub

# Infrastructure
infra-up:
	docker-compose -f infrastructure/docker-compose.yml up -d

infra-down:
	docker-compose -f infrastructure/docker-compose.yml down

# Dependency Installation
install-all:
	@for app in $(APPS); do \
		if [ -d "apps/$$app/frontend" ]; then \
			echo "Installing dependencies for $$app (frontend)..."; \
			cd apps/$$app/frontend && npm install && cd -; \
		elif [ -d "apps/$$app" ]; then \
			echo "Installing dependencies for $$app..."; \
			cd apps/$$app && npm install && cd -; \
		fi; \
	done

# Development Mode
dev-all:
	@echo "Starting all frontends in background..."
	@for app in $(APPS); do \
		if [ -d "apps/$$app/frontend" ]; then \
			echo "Starting $$app..."; \
			(cd apps/$$app/frontend && npm run dev &); \
		elif [ -d "apps/$$app" ]; then \
			echo "Starting $$app..."; \
			(cd apps/$$app && npm run dev &); \
		fi; \
	done

# Build All Frontends
build-all:
	@for app in $(APPS); do \
		if [ -d "apps/$$app/frontend" ]; then \
			echo "Building $$app..."; \
			cd apps/$$app/frontend && npm run build && cd -; \
		elif [ -d "apps/$$app" ]; then \
			echo "Building $$app..."; \
			cd apps/$$app && npm run build && cd -; \
		fi; \
	done

# Per-app development (example: make dev-cheemos)
dev-%:
	@if [ -d "apps/$*/frontend" ]; then \
		cd apps/$*/frontend && npm run dev; \
	elif [ -d "apps/$*" ]; then \
		cd apps/$* && npm run dev; \
	else \
		echo "App $* not found"; \
	fi
