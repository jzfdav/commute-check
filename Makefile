.PHONY: start stop test lint build help clean

PID_FILE := .app.pid
LOG_FILE := app.log

help:
	@echo "Available targets:"
	@echo "  make start   - Start the development server (background, auto-port)"
	@echo "  make stop    - Stop the development server"
	@echo "  make test    - Run unit tests"
	@echo "  make lint    - Run code linting"
	@echo "  make build   - Build the production bundle"
	@echo "  make clean   - Remove temp files"

start:
	@if [ -f $(PID_FILE) ]; then \
		echo "App is already running (PID: $$(cat $(PID_FILE))). Run 'make stop' first."; \
	else \
		echo "Starting app..."; \
		pnpm run dev > $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE); \
		echo "App started with PID $$(cat $(PID_FILE)). Waiting for initialization..."; \
		sleep 3; \
		if grep -q "Local:" $(LOG_FILE); then \
			grep "Local:" $(LOG_FILE); \
		else \
			echo "App started but URL not found yet. Check $(LOG_FILE)."; \
		fi \
	fi

stop:
	@if [ -f $(PID_FILE) ]; then \
		PID=$$(cat $(PID_FILE)); \
		echo "Stopping app (PID: $$PID)..."; \
		kill $$PID 2>/dev/null || true; \
		rm $(PID_FILE); \
		echo "App stopped."; \
	else \
		echo "No running app found (no $(PID_FILE))."; \
	fi

test:
	npx vitest run

lint:
	npx biome check .

build:
	pnpm run build

clean:
	@rm -f $(PID_FILE) $(LOG_FILE)
	@echo "Cleaned up."
