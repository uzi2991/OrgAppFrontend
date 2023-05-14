import React from 'react';

const hashName = (str) => {
  let res = 0;
  for (let i = 0; i < str.length; i++) {
    res += str.charCodeAt(i);
  }

  return res + 1;
};

const colors = ['red', 'yellow', 'blue'];

const getNameColor = (name) => {
  return colors[hashName(name) % colors.length];
};

const ProfilePic = ({ user, large }) => (
  <div
    className={`member member--${getNameColor(user.first_name)}${
      large ? ' member--large' : ''
    }`}
  >
    {user.first_name.substring(0, 1).toUpperCase()}
  </div>
);

ProfilePic.defaultProps = {
  large: false,
};

export default ProfilePic;
