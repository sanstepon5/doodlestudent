# Auteurs
Stepan Tyurin, Yvan Douis - M1 Informatique IL

2024-2025

# Projet Doodle
Ceci est une fork de lu projet Doodle d'Olivier Barais qui permet initialisialer de planifier des réunions avec un calendrier
et générer des salons de discussions. Le front de l'application est dévéloppé en Angular et le back en Java avec Quarkus.

Dans le cadre d'un TP de Web Engineering, notre objectif était d'ajouter des fonctionnalitées à un projet existant
(dans notre cas le projet Doodle).

# Fonctionnalitées ajoutées:
- La possibilité d'importer un calendrier existant à partir d'un fichier (grâce à ical.js)
- La possibilité d'ajouter une description à chaque horaire de la réunion séparement et la visualiser

# Lancer le projet
Télécharger le projet:
```
git clone git@github.com:sanstepon5/doodlestudent.git
cd doodlestudent
```

Pour démarrer le front:
```
cd front
npm install
npm run start
```
Ensuite ouvrir la page http://localhost:4200/ dans un navigateur.


Pour démarrer le backend:
```
cd api
docker-compose up --detach
./mvnw compile quarkus:dev
```

Une méthode alternative si le compile ne marche pas est d'essayer d'ouvrir le dossier api avec IntelliJ Idea. Il doit
reconnaitre un configuration de run tlcdemoApp, il suffit de la lancer.

Plus de détails peuvent être retrouvés dans les README des dossiers correspondants

