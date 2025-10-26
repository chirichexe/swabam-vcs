PROJECT_NAME=swabam-vcs
DOCKER_COMPOSE=docker compose
FRONTEND=swabam-vcs-frontend
BACKEND=swabam-vcs-backend

# === Comandi principali ===

.PHONY: up down build rebuild logs ps prune update restart

up:
	@echo "🚀 Avvio dei container in background..."
	$(DOCKER_COMPOSE) up -d

down:
	@echo "🛑 Arresto e rimozione dei container..."
	$(DOCKER_COMPOSE) down

build:
	@echo "🔨 Build delle immagini Docker..."
	$(DOCKER_COMPOSE) build

rebuild:
	@echo "♻️  Rebuild completo (immagini + cache pulita)..."
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d

logs:
	@echo "📜 Mostrando i log dei container..."
	$(DOCKER_COMPOSE) logs -f

ps:
	@echo "📦 Container attivi:"
	$(DOCKER_COMPOSE) ps

prune:
	@echo "🧹 Pulizia immagini, volumi e cache non usati..."
	docker system prune -af --volumes

restart:
	@echo "🔁 Riavvio dell'ambiente..."
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d

# === Aggiornamento del codice ===

update:
	@echo "🔁 Ricarico aggiornamenti di codice..."
	@echo "📦 Ricostruisco solo il servizio modificato..."
	@read -p "Quale servizio vuoi aggiornare? (frontend/backend): " service; \
	if [ $$service = "frontend" ]; then \
		docker compose build $(FRONTEND); \
		docker compose up -d $(FRONTEND); \
	elif [ $$service = "backend" ]; then \
		docker compose build $(BACKEND); \
		docker compose up -d $(BACKEND); \
	else \
		echo "❌ Servizio non valido. Usa 'frontend' o 'backend'."; \
	fi

