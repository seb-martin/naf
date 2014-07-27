IMG_TAG=mongo
CONTAINER_NAME=naf-dbms
DATA_VOLUME=

build:
	@echo "$@ $(IMG_TAG)"
	@docker pull $(IMG_TAG)

# Démarrage de la base de données MongoDB
# Monter le volume avec la variable DATA_VOLUME n'est pas toujours fonctionnel.
# MongoDB requiert un système de fichier supportant fsynch() sur les répertoires,
# et les répertoires partagés VirtualBox ne supportent pas cette opération.
# Voir http://docs.mongodb.org/manual/administration/production-notes/#kernel-and-file-systems
run:
ifneq ("$(wildcard $(DATA_VOLUME))","")
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG) volume '$(DATA_VOLUME)'"
	@docker run --name $(CONTAINER_NAME) -v $(DATA_VOLUME):/data/db -d $(IMG_TAG) mongod --smallfiles
else
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG)"
	@docker run --name $(CONTAINER_NAME) -d $(IMG_TAG) mongod --smallfiles
endif

stop:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG)"
	@docker kill $(CONTAINER_NAME)
	@docker rm $(CONTAINER_NAME)

clean:
	@echo "$@ $(IMG_TAG)"
	@docker rmi $(IMG_TAG)
