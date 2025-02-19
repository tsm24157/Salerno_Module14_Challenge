const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/post', withAuth, async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.userId, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.post('/', withAuth, async (req,res) => {
    const { title, body } = req.body;
    const userId = req.session.userId;

    try {
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ message: 'user not found' });
        }

        const postData = await Post.create({
            title,
            body,
            userId,
        });

        res.status(201).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update route
router.put('/:id', withAuth, async (req, res) => {
    try {
        const { title, body } = req.body; 
        const { id } = req.params; 
        const userId = req.session.userId; 

        const [affectedRows] = await Post.update({ title, body }, {
            where: {
                id, 
                userId 
            }
        });

        if (affectedRows > 0) {
            res.status(200).json({ message: 'Post updated successfully' });
        } else {
            res.status(404).json({ message: 'Post not found or user not authorized' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.id
            },
        });

        if (!deletedPost) {
            req.status(404).json({ message: 'no post with that id' });
            return;
        }
        res.status(200).json({ message: 'post successfully deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;