# Projet_7_Groupomania
 Réseau social d'entreprise

Installation :

1) Commencez par cloner ce repertoire Github

2) Accédez au site web de MongoDB et inscrivez-vous pour obtenir un compte gratuit. 
Une fois que vous avez accès à votre tableau de bord, créez un cluster puis configurez-le avec l'option AWS et uniquement les options gratuites afin de pouvoir développer gratuitement.

3) Dans le dossier backend :
- créez un fichier .env puis dans ce fichier tapez :
MONGODB_PATH = 'mongodb+srv://nom:mot_de_passe@cluster0.jukug.mongodb.net/?retryWrites=true&w=majority'
- Remplacer tout ce qui ce trouve à droite de "MONGODB_PATH =" par vos identifiants de connexion que vous avez obtenus lors de la création de votre cluster à l'étape 2)
- enregistrez votre fichier .env
- ouvrez un terminal puis tapez "npm install"
- tapez la commande "npm audit fix" pour corriger les vulnérabilités s'il y en a
- lancez le serveur en tapant la commande "nodemon server", le message "Connexion à MongoDB réussie !" devrait s'afficher dans le terminal

4) Dans le dossier frontend :
- ouvrez un terminal puis tapez "npm install"
- tapez la commande "npm audit fix" pour corriger les vulnérabilités s'il y en a
- lancez le frontend en tapant la commande "npm start", le message "Compiled successfully" devrait s'afficher dans le terminal
- cliquez sur "http://localhost:4200/" pour ouvrir l'application dans votre navigateur


