import User from '../models/User.js';

/* READ */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map(friendId => User.findById(id))
    );

    const formattedFriends = friends.map(friend => {
      return {
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        picturePath: friend.picturePath,
        occupation: friend.occupation,
        location: friend.location,
      };
    });

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */

export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendID } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendID);

    if (user.friends.includes(friendID)) {
      user.friends = user.friends.filter(id => id !== friendID);
      friend.friends = friend.friends.filter(id => id !== id);
    } else {
      user.friends.push(friendID);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map(friendId => User.findById(id))
    );

    const formattedFriends = friends.map(friend => {
      return {
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        picturePath: friend.picturePath,
        occupation: friend.occupation,
        location: friend.location,
      };
    });

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
