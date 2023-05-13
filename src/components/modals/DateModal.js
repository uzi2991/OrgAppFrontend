import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { authAxios } from '../../static/js/util';
import { backendUrl } from '../../static/js/const';

const DateModal = ({ card, setShowDateModal, date, setDate }) => {
  const handleSubmit = async (e) => {
    try {
      await authAxios.post(`${backendUrl}/task/${card._id}`, {
        due_date: date,
      });
      setShowDateModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="due-date-modal">
      <button
        className="due-date-modal__exit"
        onClick={() => setShowDateModal(false)}
      >
        <i className="fal fa-times"></i>
      </button>

      <div className="due-date-modal__body">
        <ReactDatePicker
          className="due-date-modal__picker"
          selected={new Date(date)}
          onChange={(date) => {
            setDate(date.toString());
            card.due_date = date.toString();
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select due date"
        />

        <button className="btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default DateModal;
