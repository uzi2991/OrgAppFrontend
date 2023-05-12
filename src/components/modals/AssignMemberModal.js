import React from 'react';
import { useState } from 'react';
import { authAxios } from '../../static/js/util';
import { backendUrl } from '../../static/js/const';
import { updateCard } from '../../static/js/board';
import { useContext } from 'react';
import globalContext from '../../context/globalContext';

const AssignMemberModel = ({ setShowAssignMemberModal, card }) => {
  const [member, setMember] = useState('');
  const { project, setProject } = useContext(globalContext);

  const handleAssign = async (e) => {
    try {
      const { data: updatedCard } = await authAxios.post(
        `${backendUrl}/task/${card._id}/assign`,
        {
          user: member,
        },
      );

      updateCard(project, setProject)(card.list, updatedCard);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="assign-member-modal">
      <button
        className="assign-member-modal__exit"
        onClick={() => setShowAssignMemberModal(false)}
      >
        <i className="fal fa-times"></i>
      </button>

      <div className="assign-member-modal__body">
        <h1>Assign members</h1>
        <div className="assign-member-modal__form">
          <input
            type="text"
            className="assign-member-modal__input"
            name="members"
            value={member}
            placeholder="e.g. vikhyat@trello.com"
            onChange={(e) => setMember(e.target.value)}
          />

          {member.trim() !== '' ? (
            <button className="btn" onClick={handleAssign}>
              Assign
            </button>
          ) : (
            <button className="btn btn--disabled" disabled>
              Assign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignMemberModel;
