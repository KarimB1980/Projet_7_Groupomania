const Post = require('../models/Post');
// utilisation de File System de NodeJS
const fs = require('fs');

// Afficher tous les posts
exports.getAllPost = (req, res, next) => {
  Post.find()
  .then((post) => {res.status(200).json(post)})
  .catch((error) => {res.status(400).json({ error })});
};

// Afficher un post
exports.getOnePost = (req, res, next) => {
  Post.findOne({_id: req.params.id})
  .then((post) => {res.status(200).json(post)})
  .catch((error) => {res.status(404).json({ error })});
};

// Créer un post
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  const post = new Post({
    ...postObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0
  });
  post.save()
  .then(() => {res.status(201).json({message: 'La post a été créée.'})})
  .catch((error) => {res.status(400).json({ error })});
};

// Modifier un post
exports.modifyPost = (req, res, next) => {
  if (req.file) {
    // Si modification de l'image, suppression de l'ancienne image dans le dossier /images
    Post.findOne({ _id: req.params.id })
      .then(post => {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          // Mise à jour suite à suppression de l'image
          const postObject = {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          }
          Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La post a été modifiée.' }))
            .catch(error => res.status(400).json({ error }));
        })
      })
      .catch(error => res.status(500).json({ error }));
    } 
    else 
    {
      // si absence de modification d'image
      const postObject = { ...req.body };
      Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La post a été modifiée.' }))
        .catch(error => res.status(400).json({ error }));
    }
};

// Supprimer un post
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      const filename = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'La post a été supprimée.'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Like et dislike d'un post
exports.likePost = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const postId = req.params.id;
  Post.findOne({ _id: postId })
    .then(post => {
      // nouvelles valeurs à modifier
      const newValues = {
        usersLiked: post.usersLiked,
        usersDisliked: post.usersDisliked,
        likes: 0,
        dislikes: 0
      }
      // Trois cas:
      switch (like) {
        case 1:  // Post liked
          newValues.usersLiked.push(userId);
          break;
        case -1:  // Post disliked
          newValues.usersDisliked.push(userId);
          break;
        case 0:  // Annulation du like/dislike
          if (newValues.usersLiked.includes(userId)) {
            // Annulation du like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // Annulation du dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      };
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la post
      Post.updateOne({ _id: postId }, newValues )
        .then(() => res.status(200).json({ message: 'La post a été notée.' }))
        .catch(error => res.status(400).json({ error }))  
  })
  .catch(error => res.status(500).json({ error }));
}