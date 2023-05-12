import React, { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useBlurSetState from '../hooks/useBlurSetState';
import useAxiosGet from '../hooks/useAxiosGet';
import { addList, onDragEnd } from '../static/js/board';
import List from '../components/boards/List';
import { authAxios, handleBackgroundBrightness } from '../static/js/util';
import { backendUrl } from '../static/js/const';
import Error404 from './Error404';
import globalContext from '../context/globalContext';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const getBoardStyle = (project) => {
  if (project.image || project.image_url)
    return {
      backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25) ), url(${project.image || project.image_url
        })`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    };
  else if (project.color)
    return {
      backgroundColor: `#${project.color}`,
    };
};

const Board = (props) => {
  const { id } = props.match.params;
  const [addingList, setAddingList] = useState(false);
  const {
    data: project,
    setData: setProject,
    loading,
  } = useAxiosGet(`/project/${id}/`);

  const { setBoardContext } = useContext(globalContext);
  useEffect(() => {
    if (project) {
      setBoardContext(project, setProject);
    }
  }, [project]);

  useDocumentTitle(project ? `${project.title} | Trello` : '');
  useBlurSetState('.board__create-list-form', addingList, setAddingList);
  const [editingTitle, setEditingTitle] = useState(false);
  useBlurSetState('.board__title-edit', editingTitle, setEditingTitle);

  const [isBackgroundDark, setIsBackgroundDark] = useState(false);
  useEffect(handleBackgroundBrightness(project, setIsBackgroundDark), [
    project,
  ]);

  if (!project && loading) return null;
  if (!project && !loading) return <Error404 />;
  return (
    <div className="board" style={getBoardStyle(project)}>
      <div className="board__menu">
        {!editingTitle ? (
          <p
            className="board__title"
            onClick={() => setEditingTitle(true)}
            style={isBackgroundDark ? { color: 'white' } : null}
          >
            {project.title}
          </p>
        ) : (
          <EditBoard
            setEditingTitle={setEditingTitle}
            project={project}
            setProject={setProject}
          />
        )}

        <Link to={`/project/${project._id}/info`} className="btn board__info">
          <i className="far fa-info"></i> Project Info
        </Link>
      </div>

      {/* <p className="board__subtitle">{project.owner.title}</p> */}
      <DragDropContext onDragEnd={onDragEnd(project, setProject)}>
        <Droppable
          droppableId={'board' + project._id.toString()}
          direction="horizontal"
          type="list"
        >
          {(provided) => (
            <div
              className="board__lists"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {project.lists.map((list, index) => (
                <List list={list} index={index} key={list._id} />
              ))}
              {provided.placeholder}
              {addingList ? (
                <CreateList
                  project={project}
                  setProject={setProject}
                  setAddingList={setAddingList}
                />
              ) : (
                <button
                  className="btn board__create-list"
                  onClick={() => setAddingList(true)}
                  style={project.lists.length === 0 ? { marginLeft: 0 } : null}
                >
                  <i className="fal fa-plus"></i>
                  Add {project.lists.length === 0 ? 'a' : 'another'} list
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const CreateList = ({ project, setProject, setAddingList }) => {
  const [title, setTitle] = useState('');

  const onAddList = async (e) => {
    e.preventDefault();
    const { data } = await authAxios.post(`${backendUrl}/list/`, {
      project: project._id,
      title,
    });
    console.log(data);
    addList(project, setProject)(data);
    setAddingList(false);
  };

  return (
    <form className="board__create-list-form" onSubmit={onAddList}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        name="title"
        placeholder="Enter list title"
      />
      {title.trim() !== '' ? (
        <button type="submit" className="btn btn--small">
          Add List
        </button>
      ) : (
        <button type="submit" className="btn btn--small btn--disabled" disabled>
          Add List
        </button>
      )}
    </form>
  );
};

const EditBoard = ({ project, setProject, setEditingTitle }) => {
  const [title, setTitle] = useState(project.title);

  const onEditTitle = async (e) => {
    e.preventDefault();
    console.log('Submit');
    if (title.trim() === '') return;
    const { data } = await authAxios.post(
      `${backendUrl}/project/${project._id}/`,
      {
        title,
      },
    );

    setProject(data);
    setEditingTitle(false);
  };

  return (
    <form onSubmit={onEditTitle}>
      <input
        className="board__title-edit"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        name="title"
        placeholder="Enter board title"
      />
    </form>
  );
};

export default Board;
