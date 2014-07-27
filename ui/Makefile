IMG_TAG=sebmartin/naf-ui
CONTAINER_NAME=naf-ui

STAGE=dev

build:
	@echo "$@ $(IMG_TAG)"
	@docker build -t $(IMG_TAG) .

run:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG) Stage: $(STAGE)"

ifeq ("$(STAGE)", "prod")
	@docker run --name $(CONTAINER_NAME) -d $(IMG_TAG)
else
	@docker run --name $(CONTAINER_NAME) -v `pwd`/src:/usr/src/naf-ui -v `pwd`/src/app:/usr/src/naf-ui/dist -d $(IMG_TAG)
endif


stop:
	@echo "$@ $(CONTAINER_NAME):$(IMG_TAG)"
	@docker kill $(CONTAINER_NAME)
	@docker rm $(CONTAINER_NAME)

clean:
	@echo "$@ $(IMG_TAG)"
	@docker rmi $(IMG_TAG)

