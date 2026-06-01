# TBLINC Management Makefile

# Variables
BACKEND_DIR = src/deployment/backend
FRONTEND_DIR = src/deployment/frontend
BACKEND_PID_FILE = .backend.pid
FRONTEND_PID_FILE = .frontend.pid
BACKEND_LOG = backend.log
FRONTEND_LOG = frontend.log

.PHONY: all start stop restart pkill log pid clean

all: start

# Start both services in background
start:
	@echo "🚀 Starting TBLINC Services..."
	@if [ -f $(BACKEND_PID_FILE) ]; then \
		echo "⚠️ Backend is already running (PID: $$(cat $(BACKEND_PID_FILE)))"; \
	else \
		nohup poetry run python $(BACKEND_DIR)/manage.py runserver 0.0.0.0:8000 > $(BACKEND_LOG) 2>&1 & echo $$! > $(BACKEND_PID_FILE); \
		echo "✅ Backend started on port 8000"; \
	fi
	@if [ -f $(FRONTEND_PID_FILE) ]; then \
		echo "⚠️ Frontend is already running (PID: $$(cat $(FRONTEND_PID_FILE)))"; \
	else \
		nohup npm run dev --prefix $(FRONTEND_DIR) -- --host 0.0.0.0 > $(FRONTEND_LOG) 2>&1 & echo $$! > $(FRONTEND_PID_FILE); \
		echo "✅ Frontend started"; \
	fi

# Stop both services
stop:
	@echo "🛑 Stopping TBLINC Services..."
	@if [ -f $(BACKEND_PID_FILE) ]; then \
		PID=$$(cat $(BACKEND_PID_FILE)); \
		kill $$PID || true; \
		rm $(BACKEND_PID_FILE); \
		echo "Stopped Backend (PID: $$PID)"; \
	else \
		echo "Backend is not running"; \
	fi
	@if [ -f $(FRONTEND_PID_FILE) ]; then \
		PID=$$(cat $(FRONTEND_PID_FILE)); \
		kill $$PID || true; \
		rm $(FRONTEND_PID_FILE); \
		echo "Stopped Frontend (PID: $$PID)"; \
	else \
		echo "Frontend is not running"; \
	fi

# Restart services
restart: stop start

# Emergency kill all related processes
pkill:
	@echo "🧨 Killing all TBLINC-related processes..."
	@pkill -f "manage.py runserver" || true
	@pkill -f "vite" || true
	@rm -f $(BACKEND_PID_FILE) $(FRONTEND_PID_FILE)
	@echo "Done."

# Show logs
log:
	@echo "📋 Showing combined logs (Ctrl+C to stop)..."
	@tail -f $(BACKEND_LOG) $(FRONTEND_LOG)

# Show PIDs
pid:
	@echo "🆔 Service PIDs:"
	@if [ -f $(BACKEND_PID_FILE) ]; then echo "Backend: $$(cat $(BACKEND_PID_FILE))"; else echo "Backend: NOT RUNNING"; fi
	@if [ -f $(FRONTEND_PID_FILE) ]; then echo "Frontend: $$(cat $(FRONTEND_PID_FILE))"; else echo "Frontend: NOT RUNNING"; fi

# Clean logs and PIDs
clean:
	@rm -f $(BACKEND_LOG) $(FRONTEND_LOG) $(BACKEND_PID_FILE) $(FRONTEND_PID_FILE)
	@echo "🧹 Cleaned logs and PID files."
