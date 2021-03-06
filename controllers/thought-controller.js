const {
    Thought,
    User
} = require('../models');

const thoughtController = {

    //create new thought
    createThought({
        body
    }, res) {
        Thought.create(body)
            .then((dbThoughtData) => {
                return User.findOneAndUpdate({
                    _id: body.userId
                }, {
                    $push: {
                        thoughts: dbThoughtData._id
                    }
                }, {
                    new: true
                });
            })
            .then((dbUserData) => {
                console.log(dbUserData);
                if (!dbUserData) {
                    return res.status(404).json({
                        message: 'No thoughts found with this id!'
                    });
                }
                res.json({
                    message: 'Thought succesfully created!'
                });
            })
            .catch(err => res.json(err));
    },

    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // get a thought by its id
    getThoughtById({
        params
    }, res) {
        Thought.findOne({
                _id: params.id
            })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // update thought by id
    updateThought({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.id
            }, body, {
                new: true,
                runValidators: true
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: 'No thought found with this id!'
                    });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // delete thought by id
    deleteThought({params}, res) {
        Thoughts.findOneAndDelete(
            {_id: params.id})
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({message: 'No thought found with this id'});
                }
                res.json(deletedThought);
            })
            .catch((err) => res.status(400).json(err));
    },

    // add reaction
      addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbData => {
                if (!dbData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbData);
            })
            .catch(err => res.json(err));
    },

    // delete reaction by thought id
    removeReaction({
        params
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $pull: {
                    reactions: {
                        reactionId: params.reactionId
                    }
                }
            }, {
                new: true
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;