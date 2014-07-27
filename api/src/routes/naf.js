(function(){

	var express = require('express');
	var router = express.Router();


	var defaultPage = 1;
	var defaultNbPerPage = 20;


    /**
     * Utilise le paramètre de requête q pour créer un objet query
     *
     * @param req
     * @returns {{}}
     */
	var query = function(req){
		try{
			var q = req.query.q;
			var query = {};
			if(q){
				var qRegex = new RegExp(q, 'i');

				var orArray = req.endpoint['champs'].map(function(field){
					var obj = {};
					obj[field['nom']] = qRegex;
					return obj;
				});


				query = {$or:orArray};
			}

			return query;

		} catch(err){
			console.dir(err);
			throw err;
		}

	};

	/**
	Extrait de la requête req le nombre d'articles par page à utiliser
	*/
	var limit = function(req){
		try{
			return req.query.npp ? parseInt(req.query.npp) : defaultNbPerPage;
		} catch(err){
			console.dir(err);
			throw err;
		}
		
	};

	var skip = function(req){
		try{
			var page = req.query.p && req.query.p > 1 ? parseInt(req.query.p) : defaultPage;
			// Si limit est déjà évalué, on le récupère.
			var limite = req.limite || limit(req);
			return page > 0 ? ((page - 1) * limite) : 0
		} catch(err){
			console.dir(err);
			throw err;
		}
	};


    router.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        next();
    });


    router.param('niveau',  function (req, res, next, niveau){
		req.collection = req.db.collection(niveau);
		req.endpoint = req.meta['endpoints'][niveau];
		next();
	});

	router.param('code', function(req, res, next, code){
        code = code.toUpperCase();
        if(code.indexOf('.') === -1) {
            code = ''.concat(code.slice(0, 2), '.', code.slice(2));
        }
        req.code = code;
		next();
	});


	router.get('/:niveau/:code', function(req, res, next) {

		var q = {};
		q[req.endpoint['champsRef']] = req.code;
		req.collection.findOne(q, {fields:{"_id":0}}, function(err, article){
			if(err) next(err);

			if(!article) {
                var message = 'Article /:niveau/:code non trouvé'
                    .replace(':niveau', req['endpoint']['ref'])
                    .replace(':code', req['code']);

                err = {
                    status: 404,
                    message: message
                };

				next(err);
			} else {
                res.json(article);
            }

		})
	});


	router.use('/:niveau', function(req, res, next){
		req.requete = query(req);
		req.limite = limit(req);
		req.passe = skip(req);
		next();
	});

	router.get('/:niveau', function (req, res, next){
        console.dir(req.requete);
		req.collection.find(req.requete, {"_id":0}).skip(req.passe).limit(req.limite).toArray(function(err, articles){
			if(err) next(err);
			res.json(articles);
		})
	});


	router.get('/', function(req, res, next){
		res.json(req.meta);
	});

	/// catch 404 and forwarding to error handler
/*
	router.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});
*/

	// production error handler
	// no stacktraces leaked to user
	router.use(function(err, req, res, next) {
        console.dir(err);
	    res.status(err.status || 500);
	    res.json(err);
	});


	module.exports = router;


}())


