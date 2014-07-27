IMG_TAG=sebmartin/naf-populator
CONTAINER_NAME= # Variable inutilisée, docker run avec l'option --rm supprime automatiquement le container après son exécution
LINKED_DBMS_CONTAINER_NAME=naf-dbms

STAGE=dev

CONFIG_PATH=
DB_NAME=

build: 
	@echo "$@ $(IMG_TAG)"
	@docker build -t $(IMG_TAG) .

run:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG) Stage: $(STAGE), Config: $(CONFIG_PATH), DB: $(DB_NAME)"


ifeq ("$(wildcard $(CONFIG_PATH))", "")
	@echo "Fichier de configuration (naf.json) non spécifié ou inexistant"
	@echo "Précisez le fichier de configuration à utiliser en définissant la variable d'environnement CONFIG_PATH avec le chemin absolu vers le fichier"
	@exit 1
endif

ifeq ("$(DB_NAME)", "")
	@echo "Nom de la base de données non spécifié"
	@echo "Précisez le nom de la base de données à utiliser en définissant la variable d'environnement DB_NAME"
	@exit 2
endif

ifeq ("$(STAGE)", "prod")
	@docker run -t --rm --env DB_NAME=$(DB_NAME) -v ${CONFIG_PATH}:/usr/src/naf/naf.json:ro --link $(LINKED_DBMS_CONTAINER_NAME):dbhost $(IMG_TAG)
else
	@docker run -t --rm --env DB_NAME=$(DB_NAME) -v `pwd`/src:/usr/src/naf/src:ro  -v ${CONFIG_PATH}:/usr/src/naf/naf.json:ro --link $(LINKED_DBMS_CONTAINER_NAME):dbhost $(IMG_TAG)
endif

clean:
	@echo "$@ $(IMG_TAG)"
	@docker rmi $(IMG_TAG)
