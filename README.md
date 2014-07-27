# Système NAF

Le système NAF est un système composé de conteneurs Docker et permettant d'exposer différentes
versions de la Nomenclature d'Activités Françaises (NAF) maintenue par l'INSEE ([www.insee.fr](http://www.insee.fr)).

Ce système est contrôlé à l'aide d'un `Makefile`.

## Prérequis

Le système NAF est composée de conteneurs Docker instances de différentes images. Docker étant construit au dessus des
[Linux Containers](https://linuxcontainers.org), le système NAF peut être exécuter uniquement sur Linux.
Afin de pouvoir être exécuter également sur une machine non Linux, deux méthodes sont proposées pour exécuter le système :
dans une [Vagrant Box](http://www.vagrantup.com/) ou directement sous Linux. Dans les deux cas, vous devez installer `make`.

### Vagrant VirtualBox



> `vagrant plugin install vagrant-vbguest`, `vagrant up; vagrant ssh`, `cd /vagrant`


### Linux Natif

## Exécution

### 1 - Construire les images Docker

Durant la première étape, l'image "mongo" est pompée depuis le dépôt de Docker et trois images Docker sont construites.

1. La première image construite est taguée anfh/naf-populator. Cette image basée sur mongo permet de peupler une base de données mongo avec les données de la NAF.
2. La seconde image construite est taguée anfh/naf-api. Cette image basée sur node permet d'exposer les données NAF d'une base de données mongo au travers d'une API REST. Cette interface est implantée à l'aide de express et de mongodb.
3. La troisième image construite est taguée anfh/naf-ui. Cette image basée sur nginx permet d'exposer à la fois l'interfce utiisateur (serveur web) et le serveur d'API (serveur proxy).


> `make build`


### 2 - Démarrer les conteneurs Docker ###

Durant la seconde étape, les images tirées et construites sont exécutées pour instancier des conteneurs "démonisés". Quatre conteneurs sont ainsi instanciés.

1. naf-dbms est une instance de l'image mongo
2. naf2003-api est une instance de l'image anfh/naf-api utilisée pour exposer les données de la NAF 2003
3. naf2008-api est une instance de l'image anfh/naf-api utilisée pour exposer les données de la NAF 2008
4. naf-ui est une instance de anfh/naf-ui


> `make run`


### 3 - Peupler les bases de données ###

Durant la troisème 

> `make populate`


