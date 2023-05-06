import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const HomeSidebar = ({ setShowTeamModal, projects }) => {
  return (
    <div className="home-menu">
      <div className="home-menu__section">
        <p className="home-menu__title">Projects</p>
        <a className="btn btn--transparent btn--small">
          <button onClick={() => setShowTeamModal(true)}>
            <i className="fal fa-plus"></i>
          </button>
        </a>
      </div>
      <ul>
        <li>
          {projects.map((project) => (
            <Link
              to={`/project/${project._id}`}
              className="btn btn--transparent btn--small"
              key={uuidv4()}
            >
              <i className="fal fa-users"></i> {project.title}
            </Link>
          ))}
        </li>
      </ul>
    </div>
  );
};

export default HomeSidebar;
