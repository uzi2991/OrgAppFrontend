import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Labels from '../boards/Labels';
import useAxiosGet from '../../hooks/useAxiosGet';
import useBlurSetState from '../../hooks/useBlurSetState';
import globalContext from '../../context/globalContext';
import { timeSince, modalBlurHandler, authAxios } from '../../static/js/util';
import { backendUrl } from '../../static/js/const';
import { updateCard } from '../../static/js/board';
import ProfilePic from '../boards/ProfilePic';
import AssignMemberModel from './AssignMemberModal';
import { deleteCard } from '../../static/js/board';
import DateModal from './DateModal';
import moment from 'moment/moment';

const EditCardModal = ({ card, list, setShowModal }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [showAssignMemberModal, setShowAssignMemberModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const { project, setProject } = useContext(globalContext);

  const [tempMembers, setTempMembers] = useState(card.members);
  const [tempDate, setTempDate] = useState(card.due_date);
  const [tempDone, setTempDone] = useState(card.done);

  useEffect(modalBlurHandler(setShowModal), []);
  useBlurSetState('.edit-modal__title-edit', editingTitle, setEditingTitle);
  useBlurSetState(
    '.edit-modal__form',
    editingDescription,
    setEditingDescription,
  );

  const handleDeleteCard = async (e) => {
    await authAxios.delete(`${backendUrl}/task/${card._id}`);
    deleteCard(project, setProject)(list._id, card);
  };

  const handleToggleDone = async (e) => {
    await authAxios.post(`${backendUrl}/task/${card._id}`, {
      done: !tempDone,
    });
    card.done = !tempDone;
    setTempDone(!tempDone);
  };

  const getDueDateStyle = () => {
    if (card.done) {
      return 'due-date__done';
    } else if (new Date(card.due_date) <= new Date() ) {
      return 'due-date__expire';
    }

    return '';
  };

  return (
    <div className="edit-modal">
      <button className="edit-modal__exit" onClick={() => setShowModal(false)}>
        <i className="fal fa-times"></i>
      </button>
      <div className="edit-modal__cols">
        <div className="edit-modal__left">
          {/* <Labels labels={card.labels} /> */}
          {!editingTitle ? (
            <p
              onClick={() => setEditingTitle(true)}
              className="edit-modal__title"
            >
              {card.title}
            </p>
          ) : (
            <EditCardTitle
              list={list}
              card={card}
              setEditingTitle={setEditingTitle}
            />
          )}
          <div className="edit-modal__subtitle">
            in list <span>{list.title}</span>
          </div>

          <div className="edit-modal__section-header">
            <div>
              <i className="fal fa-file-alt"></i> Description
            </div>
            {card.description !== '' && (
              <div>
                <button
                  className="btn btn--secondary btn--small"
                  onClick={() => setEditingDescription(true)}
                >
                  <i className="fal fa-pencil"></i> Edit
                </button>
              </div>
            )}
          </div>

          {card.description !== '' && !editingDescription && (
            <p className="edit-modal__description">{card.description}</p>
          )}

          {editingDescription ? (
            <EditCardDescription
              list={list}
              card={card}
              setEditingDescription={setEditingDescription}
            />
          ) : (
            card.description === '' && (
              <button
                className="btn btn--secondary btn--small btn--description"
                onClick={() => setEditingDescription(true)}
              >
                Add description
              </button>
            )
          )}
          {tempDate && (
            <p className={getDueDateStyle()}>
              <i className="fal fa-calendar"></i> Due date:{' '}
              {moment(tempDate).format('DD/MM/yyyy')}
              <input
                type="checkbox"
                checked={tempDone}
                onChange={handleToggleDone}
              />
            </p>
          )}
        </div>

        <div className="edit-modal__right">
          <div className="edit-modal__section-header">
            <div>Actions</div>
          </div>

          <ul className="edit-modal__actions">
            <li>
              <a
                className="btn btn--secondary btn--small"
                onClick={() => setShowAssignMemberModal(true)}
              >
                <i className="fal fa-user"></i> Assign Member
              </a>
            </li>
            <li>
              <a
                className="btn btn--secondary btn--small"
                onClick={() => setShowDateModal(true)}
              >
                <i className="fal fa-clock"></i> Change Due Date
              </a>
            </li>
            <a
              className="btn btn--secondary btn--small"
              onClick={handleDeleteCard}
            >
              <i className="fal fa-trash"></i> Delete
            </a>
            <li></li>
          </ul>

          <Members
            members={tempMembers}
            setMembers={setTempMembers}
            card={card}
            list={list}
          />
        </div>
      </div>

      {showAssignMemberModal && (
        <AssignMemberModel
          card={card}
          setMembers={setTempMembers}
          setShowAssignMemberModal={setShowAssignMemberModal}
          project={project}
          setProject={setProject}
        />
      )}

      {showDateModal && (
        <DateModal
          date={tempDate}
          setDate={setTempDate}
          card={card}
          setShowDateModal={setShowDateModal}
        />
      )}
    </div>
  );
};

const EditCardTitle = ({ list, card, setEditingTitle }) => {
  const { project, setProject } = useContext(globalContext);
  const [title, setTitle] = useState(card.title);

  useEffect(() => {
    const titleInput = document.querySelector('.edit-modal__title-edit');
    titleInput.focus();
    titleInput.select();
  }, []);

  const onEditTitle = async (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    const { data } = await authAxios.post(`${backendUrl}/task/${card._id}/`, {
      title,
    });
    setEditingTitle(false);
    updateCard(project, setProject)(list._id, data);
  };

  return (
    <form onSubmit={onEditTitle}>
      <input
        className="edit-modal__title-edit"
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
    </form>
  );
};

const EditCardDescription = ({ list, card, setEditingDescription }) => {
  const { project, setProject } = useContext(globalContext);
  const [description, setDescription] = useState(card.description);

  const onEditDesc = async (e) => {
    e.preventDefault();
    if (description.trim() === '') return;
    const { data } = await authAxios.post(`${backendUrl}/task/${card._id}/`, {
      title: card.title,
      description,
    });
    setEditingDescription(false);
    updateCard(project, setProject)(list._id, data);
  };

  return (
    <form className="edit-modal__form" onSubmit={onEditDesc}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add description..."
      ></textarea>
      {description.trim() !== '' && (
        <button type="submit" className="btn btn--small">
          Save
        </button>
      )}
    </form>
  );
};

const Members = ({ members, setMembers, card, list }) => {
  const handleDelete = (userId) => async (e) => {
    try {
      const { data } = await authAxios.post(
        `${backendUrl}/task/${card._id}/remove`,
        {
          user: userId,
        },
      );

      card.members = card.members.filter((member) => member._id !== userId);
      setMembers(card.members);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    members.length !== 0 && (
      <>
        <div className="edit-modal__section-header">
          <div>Members</div>
        </div>
        <ul className="edit-modal__members">
          {members.map((member) => (
            <li key={uuidv4()}>
              <ProfilePic user={member} />
              <p>{member.first_name + ' ' + member.last_name}</p>
              <button
                className="edit-modal__remove"
                onClick={handleDelete(member._id)}
              >
                <i className="far fa-times"></i>
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  );
};
export default EditCardModal;
