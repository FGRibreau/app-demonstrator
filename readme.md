### (Proof of Concept) App Demonstrator

App Demonstrator est un petit Proof of Concept (réalisé entre 00h et 2h du matin le 28 Juillet 2011) pour le concours [MonNuage](http://blog.monnuage.fr/2011/07/26/jeu-concours-application-iphone-monnuage/).

### Utilisation
HTML:
	
	<div class="container">
	  <div class="iPhone">
	  </div>

	  <div><span id="text"></span></div>
	</div>

	<section id="myApp">
	  <article>
	    <figure id="001">
	      <img src="screens/screenshot_accueil.png"/>
	    </figure>
	    <div>
	      <p>Page d'accueil de l'application</p>
	    </div>
	  </article>

	  <article>
	  	<figure id="end">
	      <img src="screens/this_is_the_end.png"/>
	    </figure>
	    
	    <div>
	      <h1>Fin !</h1>
	    </div>
	  </article>

	  ...
	 </section>


JavaScript:
	
	// Le .load permet d'attendre que toutes les images (screenshots) soient chargées
	$(window).load(function(){

	  var s = new Scene($('.iPhone'), $('#text'), $('#myApp'), './screens/');

	  s.add('001', {
	    timeout: [1000, {goto:s.goto('end'),transition:'fadeOut', duration:100}]
	  }).add('end', {

	  }).start();
	
	});

### [Demo](http://fgribreau.com/monnuage/)

### Liste d'améliorations possibles:
 * Commenter le code + Tests
 * Refactorer le constructeur de `Scene` en `Scene($container [, option])`, créer les éléments au besoin
 * Transférer l'id de la `Frame` directement sur l'`<article>`
 * Parser les articles de la page pour ajouter les frames (utiliser HTML5 data-*) (plus besoin de JS)
 * Créer un UI pour ajouter, éditer les "zooms" sur les éléments
 * Refactorer `next()`, extraire le `zoomer` de `Frame`
 * Plus de transitions disponibles entre chaque `Frame`
 * Etc...