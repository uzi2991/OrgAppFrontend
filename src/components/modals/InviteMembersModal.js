import React, { useState } from 'react';
import { backendUrl } from '../../static/js/const';
import { authAxios } from '../../static/js/util';

const getInviteMembersPosition = () => {
  const inviteElem = document.querySelector('.team__members-header button');
  if (!inviteElem) return null;
  return {
    top:
      inviteElem.getBoundingClientRect().y +
      inviteElem.getBoundingClientRect().height +
      10 +
      'px',
    left: inviteElem.getBoundingClientRect().x + 'px',
  };
};

const InviteMembersModal = ({ project, setProject, setShowModal }) => {
  const [members, setMembers] = useState('');

  const handleInvite = async () => {
    const invitedMembers =
      members !== ''
        ? members.split(',').map((user) => user.trim()) // usernames and emails
        : [];

    try {
      const { data: newMembers } = await authAxios.post(
        backendUrl + `/project/${project._id}/invite/`,
        {
          users: invitedMembers,
        },
      );

      setProject((project) => {
        const updatedMembers = [...project.members, ...newMembers];
        return { ...project, members: updatedMembers };
      });
    } catch (error) {
      console.log(error);
    }
    setShowModal(false);
  };

  return (
    <div
      className="label-modal label-modal--shadow"
      style={getInviteMembersPosition()}
    >
      <div className="label-modal__header">
        <p>Add Members</p>
        <button onClick={() => setShowModal(false)}>
          <i className="fal fa-times"></i>
        </button>
      </div>
      <div className="label-modal__content">
        <p className="label-modal__invite-header">
          <i className="fal fa-user"></i>
          Enter Email Address
        </p>
        <input
          className="label-modal__input"
          type="text"
          name="members"
          placeholder="e.g. vikhyat@trello.com"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
        />
        {members.trim() !== '' ? (
          <button className="btn" onClick={handleInvite}>
            Invite to Project
          </button>
        ) : (
          <button className="btn btn--disabled" disabled>
            Invite to Project
          </button>
        )}
      </div>
    </div>
  );
};

export default InviteMembersModal;
