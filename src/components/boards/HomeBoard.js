import React from 'react';
import ProfilePic from './ProfilePic';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

import { authAxios } from '../../static/js/util';
import { backendUrl } from '../../static/js/const';

const HomeBoard = ({ project, replaceProject }) => {
  return (
    <Link to={`/project/${project._id}`} className="board-preview">
      <p
        className="board-preview__title"
        style={{ marginBottom: project.members ? '1em' : 0 }}
      >
        {project.title}
      </p>
      {/* {project.members && <Members members={project.members} />} */}
    </Link>
  );
};

const Members = ({ members }) => {
  return (
    <div className="board-preview__members">
      {members.slice(0, 3).map((member) => (
        <ProfilePic user={member} key={uuidv4()} />
      ))}
      {members.length > 3 && (
        <p>{`+${members.length - 3} other${
          members.length - 3 === 1 ? '' : 's'
        }`}</p>
      )}
    </div>
  );
};

export default HomeBoard;
