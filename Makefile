
# Largement inspiré de https://github.com/lukaspustina/docker-demo/blob/master/Makefile

# Noms des conteneurs instanciés dans le système
DBMS_CONTAINER_NAME=naf-dbms
NAF2003_API_CONTAINER_NAME=naf2003-api
NAF2008_API_CONTAINER_NAME=naf2008-api
UI_CONTAINER_NAME=naf-ui
PROXY_CONTAINER_NAME=naf-proxy

# Noms des bases de données
NAF2003_DB_NAME=naf2003
NAF2008_DB_NAME=naf2008

# Fichiers de configuration des populators
NAF2003_POPULATOR_CONFIG_PATH=`pwd`/populator/conf/naf2003.json
NAF2008_POPULATOR_CONFIG_PATH=`pwd`/populator/conf/naf2008.json

# Fichiers de configuration des apis
NAF2003_META_FILE=`pwd`/api/conf/naf2003-meta.json
NAF2008_META_FILE=`pwd`/api/conf/naf2008-meta.json

# Fichiers de configuration du proxy
PROXY_NGINX_CONF=`pwd`/proxy/conf/nginx.conf
PROXY_HOST_PORT=80

all:
	@echo "make build    -- construit toutes les images docker"
	@echo "make run      -- demarre les containers et peuple les bases de données"
	@echo "make stop     -- stoppe les containers"
	@echo "make clean    -- supprime les images"



build:
	@echo "$@"
	@$(MAKE) -C dbms build
	@$(MAKE) -C populator build
	@$(MAKE) -C api build
	@$(MAKE) -C ui build
	@$(MAKE) -C proxy build
	
build-dbms:
	@echo "$@"
	@$(MAKE) -C dbms build
	
build-populator:
	@echo "$@"
	@$(MAKE) -C populator build
	
build-api:
	@echo "$@"
	@$(MAKE) -C api build
	
build-ui:
	@echo "$@"
	@$(MAKE) -C ui build
	
build-proxy:
	@echo "$@"
	@$(MAKE) -C proxy build
	




run: run-dbms run-api run-ui run-proxy run-populator

run-dbms:
	@echo "$@ ${DBMS_CONTAINER_NAME}"
	@$(MAKE) -C dbms CONTAINER_NAME=${DBMS_CONTAINER_NAME} run
	@sleep 3s

run-api: run-naf2003-api run-naf2008-api

run-naf2003-api:
	@echo "$@ ${NAF2003_API_CONTAINER_NAME}"
	@$(MAKE) -C api CONTAINER_NAME=${NAF2003_API_CONTAINER_NAME} LINKED_DBMS_CONTAINER_NAME=${DBMS_CONTAINER_NAME} DB_NAME=${NAF2003_DB_NAME} META_FILE=$(NAF2003_META_FILE) run

run-naf2008-api:
	@echo "$@ ${NAF2008_API_CONTAINER_NAME}"
	@$(MAKE) -C api CONTAINER_NAME=${NAF2008_API_CONTAINER_NAME} LINKED_DBMS_CONTAINER_NAME=${DBMS_CONTAINER_NAME} DB_NAME=${NAF2008_DB_NAME} META_FILE=$(NAF2008_META_FILE) run


run-ui:
	@echo "$@"
	@$(MAKE) -C ui run


run-proxy:
	@echo "$@"
	$(MAKE) -C proxy CONTAINER_NAME=${PROXY_CONTAINER_NAME} NGINX_CONF=${PROXY_NGINX_CONF} HOST_PORT=${PROXY_HOST_PORT} run


run-populator: run-naf2003-populator run-naf2008-populator

run-naf2003-populator:
	@echo "$@"
	@$(MAKE) -C populator LINKED_DBMS_CONTAINER_NAME=${DBMS_CONTAINER_NAME} CONFIG_PATH=${NAF2003_POPULATOR_CONFIG_PATH} DB_NAME=${NAF2003_DB_NAME} run
	
run-naf2008-populator:
	@echo "$@"
	@$(MAKE) -C populator LINKED_DBMS_CONTAINER_NAME=${DBMS_CONTAINER_NAME} CONFIG_PATH=${NAF2008_POPULATOR_CONFIG_PATH} DB_NAME=${NAF2008_DB_NAME} run
	

stop: stop-proxy stop-ui stop-api stop-dbms

stop-dbms:
	@echo "$@ ${DBMS_CONTAINER_NAME}"
	@$(MAKE) -C dbms CONTAINER_NAME=${DBMS_CONTAINER_NAME} stop

stop-api: stop-naf2003-api stop-naf2008-api

stop-naf2003-api:
	@echo "$@ ${NAF2003_API_CONTAINER_NAME}"
	@$(MAKE) -C api CONTAINER_NAME=${NAF2003_API_CONTAINER_NAME} stop

stop-naf2008-api:
	@echo "$@ ${NAF2008_API_CONTAINER_NAME}"
	@$(MAKE) -C api CONTAINER_NAME=${NAF2008_API_CONTAINER_NAME} stop

stop-ui:
	@echo "$@ ${UI_CONTAINER_NAME}"
	@$(MAKE) -C ui CONTAINER_NAME=${UI_CONTAINER_NAME} stop

stop-proxy:
	@echo "$@ ${PROXY_CONTAINER_NAME}"
	@$(MAKE) -C proxy CONTAINER_NAME=${PROXY_CONTAINER_NAME} stop


clean:
	@echo "$@"
	@$(MAKE) -C dbms clean
	@$(MAKE) -C populator clean
	@$(MAKE) -C api clean
	@$(MAKE) -C ui clean
	@$(MAKE) -C proxy clean


erase:
	@docker kill `docker ps -q`
	@docker rm `docker ps -q -a`

erase-all:
	@docker kill `docker ps -q`
	@docker rm `docker ps -q -a`
	@docker rmi `docker images -q`




