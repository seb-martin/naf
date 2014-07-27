IMG_TAG=sebmartin/naf-api
CONTAINER_NAME=naf-api
LINKED_DBMS_CONTAINER_NAME=naf-dbms

STAGE=dev

META_FILE=
DB_NAME=

build:
	@echo "$@ $(IMG_TAG)"
	@docker build -t $(IMG_TAG) .

run:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG) Stage: $(STAGE), Meta: $(META_FILE), DB: $(DB_NAME)"

ifeq ("$(wildcard $(META_FILE))", "")
	@echo "Fichier de méta informations (naf-meta.json) non spécifié ou inexistant"
	@echo "Précisez le fichier de méta informations à utiliser en définissant la variable d'environnement META_FILE avec le chemin absolu vers le fichier"
	@exit 1
endif

ifeq ("$(DB_NAME)", "")
	@echo "Nom de la base de données non spécifié"
	@echo "Précisez le nom de la base de données à utiliser en définissant la variable d'environnement DB_NAME"
	@exit 2
endif

ifeq ("$(STAGE)", "prod")
	@docker run --name $(CONTAINER_NAME) --env DB_NAME=$(DB_NAME) -v $(META_FILE):/usr/src/naf-api/naf-meta.json --link $(LINKED_DBMS_CONTAINER_NAME):dbhost -d $(IMG_TAG)
else
	@docker run --name $(CONTAINER_NAME) --env DB_NAME=$(DB_NAME) -v `pwd`/src/:/usr/src/naf-api -v $(META_FILE):/usr/src/naf-api/naf-meta.json --link $(LINKED_DBMS_CONTAINER_NAME):dbhost -d $(IMG_TAG)
endif


stop:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG)"
	@docker kill $(CONTAINER_NAME)
	@docker rm $(CONTAINER_NAME)

clean:
	@echo "$@ $(IMG_TAG)"
	@docker rmi $(IMG_TAG)
