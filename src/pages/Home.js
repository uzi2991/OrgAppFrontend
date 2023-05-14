import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import AddBoardModal from '../components/modals/AddBoardModal';
import HomeSidebar from '../components/sidebars/HomeSidebar';
import HomeBoard from '../components/boards/HomeBoard';
import CreateTeamModal from '../components/modals/CreateTeamModal';
import useAxiosGet from '../hooks/useAxiosGet';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { filterBoards } from '../static/js/board';

const Home = () => {
  useDocumentTitle('Projects | Trello');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const {
    data: projects,
    addItem: addProject,
    replaceItem: replaceProject,
  } = useAxiosGet('/project/');

  if (!projects) {
    return null;
  }

  return (
    <>
      <div className="home-wrapper">
        <HomeSidebar
          setShowTeamModal={setShowTeamModal}
          projects={projects || []}
        />
        <div className="home">
          
          {(projects || []).length !== 0 && (
            <>
              <div className="home__section">
                <p className="home__title">
                  <i className="fal fa-clock"></i> Recently Viewed
                </p>
              </div>
              <div className="home__boards">
                {projects.map((project) => (
                  <HomeBoard
                    project={project}
                    replaceProject={replaceProject}
                    key={uuidv4()}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
      {showTeamModal && (
        <CreateTeamModal
          setShowModal={setShowTeamModal}
          addProject={addProject}
        />
      )}
    </>
  );
};

export default Home;
