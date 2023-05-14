import React, { useState, useEffect, useRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';

import { modalBlurHandler, mergeRefs, authAxios } from '../../static/js/util';
import ProfilePic from './ProfilePic';
import EditCardModal from '../modals/EditCardModal';
import { backendUrl } from '../../static/js/const';
import { deleteCard, updateCard } from '../../static/js/board';
import globalContext from '../../context/globalContext';

const getCardStyle = (isDragging, isEditing, defaultStyle) => {
  if (isEditing) {
    return {
      cursor: 'auto',
    };
  }
  if (!isDragging)
    return {
      ...defaultStyle,
      cursor: 'pointer',
    };
  return {
    ...defaultStyle,
    transform: defaultStyle.transform + ' rotate(5deg)',
    cursor: 'grabbing',
  };
};

const Card = ({ card, list, provided, isDragging }) => {
  const { project, setProject } = useContext(globalContext);
  const [title, setTitle] = useState(card.title);

  const [showEditModal, setShowEditModal] = useState(false);

  const cardElem = useRef(null);

  const handleCardClick = (e) => {
    if (e.target.className.includes('pen')) return;
    setShowEditModal(true);
  };

  const getDueDateStyle = () => {
    if (card.done) {
      return 'due-date__done';
    } else if (new Date(card.due_date) <= new Date()) {
      return 'due-date__expire';
    }

    return '';
  };

  const { innerRef, draggableProps, dragHandleProps } = provided;

  const cardImage = card.image || card.image_url || card.color;
  return (
    <>
      <div
        className={`card${cardImage ? ' card--image' : ''}`}
        ref={mergeRefs(cardElem, innerRef)}
        onClick={handleCardClick}
        {...draggableProps}
        style={getCardStyle(isDragging, false, draggableProps.style)}
        {...dragHandleProps}
      >
        {cardImage &&
          (card.color ? (
            <div
              className="card__color"
              style={{ backgroundColor: `#${card.color}` }}
            ></div>
          ) : (
            <div className="card__image">
              <img src={cardImage} />
            </div>
          ))}
        <div>
          <p className="card__title">{card.title}</p>
          <div className="card-ex-info">
            {card.due_date && (
              <p className={getDueDateStyle()}>
                <i className="fal fa-calendar"></i>{' '}
                {moment(card.due_date).format('DD/MM/yyyy')}
              </p>
            )}
            {card.members.length !== 0 && <Members members={card.members} />}
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditCardModal
          card={card}
          setShowModal={setShowEditModal}
          list={list}
        />
      )}
    </>
  );
};

const Members = ({ members }) => (
  <div className="card__members card-ex-info__members">
    <div className="member member--add">
      <i className="fal fa-plus"></i>
    </div>
    {members.map((member) => (
      <ProfilePic user={member} key={uuidv4()} />
    ))}
  </div>
);

export default Card;
