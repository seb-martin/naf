#!/usr/bin/env bash

#python xls2json.py naf.json
python $1 $2

mongoimport --host dbhost --db $DB_NAME --collection niv1 --jsonArray --file niv1.json
mongoimport --host dbhost --db $DB_NAME --collection niv2 --jsonArray --file niv2.json
mongoimport --host dbhost --db $DB_NAME --collection niv3 --jsonArray --file niv3.json
mongoimport --host dbhost --db $DB_NAME --collection niv4 --jsonArray --file niv4.json
mongoimport --host dbhost --db $DB_NAME --collection niv5 --jsonArray --file niv5.json
mongoimport --host dbhost --db $DB_NAME --collection niveaux --jsonArray --file niveaux.json
