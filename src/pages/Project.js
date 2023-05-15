import React, { useState, useContext, useEffect, useRef } from 'react';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';
import HomeBoard from '../components/boards/HomeBoard';
import ProfilePic from '../components/boards/ProfilePic';
import globalContext from '../context/globalContext';
import useAxiosGet from '../hooks/useAxiosGet';
import useBlurSetState from '../hooks/useBlurSetState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { authAxios } from '../static/js/util';
import { backendUrl } from '../static/js/const';
import { useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import InviteMembersModal from '../components/modals/InviteMembersModal';
import Error404 from './Error404';

const defaultImageUrl =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80';

const Project = (props) => {
  const { id } = props.match.params;
  const { authUser } = useContext(globalContext);
  const history = useHistory();

  const [isEditing, setIsEditing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  useBlurSetState('.label-modal', isInviting, setIsInviting);

  const {
    data: project,
    loading,
    setData: setProject,
  } = useAxiosGet(`/project/${id}/`);

  useDocumentTitle(project ? `${project.title} | Trello` : '');

  if (!project && loading) return null;
  if (!project && !loading) return <Error404 />; // No project with given id

  const isAdmin = authUser._id === project.createdBy;

  const handleDeleteProject = async (e) => {
    try {
      await authAxios.delete(`${backendUrl}/project/${id}/`);
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="team">
      <div className="team__header">
        <div className="team__header-content">
          <div className="team__header-top">
            <img src={project.image || defaultImageUrl} alt="Team" />
            {!isEditing ? (
              <div className="team__profile">
                <p>{project.title}</p>
                {isAdmin && (
                  <>
                    <button
                      className="btn btn--secondary btn--medium"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="fal fa-pen"></i> Edit Project Profile
                    </button>
                    <button
                      className="btn btn--secondary btn--medium"
                      onClick={handleDeleteProject}
                    >
                      <i className="fal fa-trash"></i> Delete Project
                    </button>
                  </>
                )}
              </div>
            ) : (
              <EditForm
                project={project}
                setProject={setProject}
                setIsEditing={setIsEditing}
              />
            )}
          </div>
        </div>
      </div>
      <div className="team__body">
        <div className="team__members">
          <div className="team__members-header">
            <p>Team Members ({project.members.length})</p>
            {isAdmin && (
              <button
                className="btn btn--medium"
                onClick={() => setIsInviting(true)}
              >
                <i className="fal fa-user-plus"></i> Invite Team Members
              </button>
            )}
          </div>
          <ul className="team__members-list">
            {project.members.map((member) => (
              <Member
                key={uuidv4()}
                user={member}
                authUser={authUser}
                isAdmin={isAdmin}
                project={project}
                setProject={setProject}
              />
            ))}
          </ul>
        </div>
      </div>
      {isAdmin && isInviting && (
        <InviteMembersModal
          project={project}
          setProject={setProject}
          setShowModal={setIsInviting}
        />
      )}
    </div>
  );
};

const EditForm = ({ project, setProject, setIsEditing }) => {
  const { register, setValue, handleSubmit, errors, watch } = useForm();
  const titleValue = watch('title', '');

  useEffect(() => {
    setValue('title', project.title);
    setValue('description', project.description);
  }, [project]);

  const onSubmit = async (data) => {
    try {
      const { data: resData } = await authAxios.post(
        `${backendUrl}/project/${project._id}/`,
        data,
      );
      setProject(resData);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="team__edit-form" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="title">Title</label>
      <input name="title" ref={register({ required: true })} type="text" />

      <label htmlFor="description">Project Description</label>
      <textarea name="description" ref={register}></textarea>

      {titleValue.trim() !== '' ? (
        <button className="btn btn--medium" type="submit">
          Save
        </button>
      ) : (
        <button className="btn btn--medium btn--disabled" disabled>
          Save
        </button>
      )}
      <button
        className="btn btn--secondary btn--medium"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </form>
  );
};

const Member = ({ user, authUser, setProject, isAdmin, project }) => {
  const history = useHistory();

  const removeMember = async () => {
    try {
      await authAxios.post(backendUrl + `/project/${project._id}/remove`, {
        userId: user._id,
      });
      if (authUser._id === user._id) {
        history.push('/');
        return;
      }
      setProject((project) => {
        const updatedMembers = project.members.filter(
          (member) => member._id !== user._id,
        );
        return { ...project, members: updatedMembers };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="team__member">
      <ProfilePic user={user} large={true} />
      <div className="team__member-info">
        <p className="team__member-name">
          {user.first_name + ' ' + user.last_name}
        </p>
        <p className="team__member-username">{user.email}</p>
      </div>
      <div className="team__member-buttons">
        {(authUser._id === user._id || isAdmin) &&
          user._id !== project.createdBy && (
            <button
              className="btn btn--secondary btn--small"
              onClick={removeMember}
            >
              <i className="fal fa-times"></i>
              {authUser._id === user._id ? 'Leave' : 'Remove'}
            </button>
          )}
      </div>
    </li>
  );
};

export default Project;
