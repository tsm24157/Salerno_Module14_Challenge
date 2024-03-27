const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            include: [{ model: User }]
        });
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [{ model: User, model: Comment }]
        });

        if (!commentData) {
            res.status(404).json({ message: 'there is no comment with that id'});
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req,res) => {
    const { body, postId } = req.body;
    const userId = req.session.userId;

    try {
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({ message: 'user not found' });
        }

        const commentData = await Comment.create({
            body,
            postId,
            userId
        });

        res.status(201).json(commentData);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedcomment = await Comment.destroy({
            where: {
                id: req.params.id
            },
        });

        if (!deletedcomment) {
            req.status(404).json({ message: 'no comment with that id' });
            return;
        }
        res.status(200).json({ message: 'comment successfully deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;