IFT3225-TP2: Rapport
Travail par Maxime Ton
Matricule: 20143044

URL:
https://www-ens.iro.umontreal.ca/~tonmaxim/index.xhtml (Forbidden à distance, mais les fichiers sont sur le diro).

https://bischaa.github.io/IFT3225-TP2/ (Lien fonctionnel)
https://github.com/Bischaa/IFT3225-TP2 (Répertoire contenant les fichiers)

Notes: 
1. Puisque je n'ai pas réussi à obtenir un lien fonctionnel à partir des serveurs du DIRO, j'ai pris la 
décision de l'upload utilisant Github Pages. J'ai donc envoyé tous les fichiers directement dans un zip sur 
Studium pour être sûr que tous les fichiers nécéssaires vous atteigne.

2. La fonction initiale que je voulais utiliser pour render la table contenant le jeu en n x n ne marchait pas, donc
j'ai pris la décision d'utiliser un render plus simple pour map la table, mais elle n'est que fonctionnelle en 4x4.

3. L'initialisation et l'update ne marchaient pas dans le constructeur, alors j'ai dû utiliser la fonction React
componentWillMount, qui est dépréciée (componentDidMount ne marchait pas dans mon cas, probablement dû au fait
que je dois exécuter mes fonctions avant le render).

4. Lorsqu'on commence un nouveau jeu (avec la touche "n" sur le clavier), les couleurs s'update mals, pas de solution.