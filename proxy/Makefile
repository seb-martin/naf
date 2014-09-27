IMG_TAG=sebmartin/naf-proxy
CONTAINER_NAME=naf-proxy
LINKED_NAF2003_API_CONTAINER_NAME=naf2003-api
LINKED_NAF2008_API_CONTAINER_NAME=naf2008-api
LINKED_UI_CONTAINER_NAME=naf-ui

NGINX_CONF=

HOST_PORT=80


build:
	@echo "$@ $(IMG_TAG)"
	@docker build -t $(IMG_TAG) .

run:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG)"

ifeq ("$(wildcard $(NGINX_CONF))", "")
	@echo "Fichier de configuration nginx (nginx.conf) non spécifié ou inexistant"
	@echo "Précisez le fichier de configuration à utiliser en définissant la variable d'environnement NGINX_CONF avec le chemin absolu vers le fichier"
	@exit 1
endif

	docker run --name $(CONTAINER_NAME) -v ${NGINX_CONF}:/etc/nginx.conf \
			--link $(LINKED_NAF2003_API_CONTAINER_NAME):api2003 \
			--link $(LINKED_NAF2008_API_CONTAINER_NAME):api2008 \
			--link $(LINKED_UI_CONTAINER_NAME):ui \
			-p $(HOST_PORT):80 \
			-d \
			$(IMG_TAG)

stop:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG)"
	@docker kill $(CONTAINER_NAME)
	@docker rm $(CONTAINER_NAME)

clean:
	@echo "$@ $(IMG_TAG)"
	@docker rmi $(IMG_TAG)
