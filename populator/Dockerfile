FROM mongo:2.6

MAINTAINER Sébastien Martin <seb.martin.94@gmail.com>

RUN apt-get update \
	&& apt-get install -y python

ENV XLRD_VERSION 0.9.3

# Installation du package xlrd pour Python. Permet de lire les fichiers Excel
# Note: curl est installé dans l'image mongo et donc utilisable ici. cf
RUN curl -SL "https://pypi.python.org/packages/source/x/xlrd/xlrd-$XLRD_VERSION.tar.gz" -o xlrd-$XLRD_VERSION.tar.gz \
	&& tar xzf xlrd-$XLRD_VERSION.tar.gz \
	&& cd xlrd-$XLRD_VERSION \
	&& python setup.py install

ADD src /usr/src/naf/src

CMD ["/usr/src/naf/src/bootstrap.sh", "/usr/src/naf/src/xls2json.py", "/usr/src/naf/naf.json"]

