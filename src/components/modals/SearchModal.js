import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { modalBlurHandler } from '../../static/js/util';
import useAxiosGet from '../../hooks/useAxiosGet';

import Card from '../boards/Card';
import SearchedBoard from '../boards/SearchedBoard';

const getSearchSuggestionsPosition = (searchElem) => {
  if (!searchElem) return null;
  return {
    top:
      searchElem.getBoundingClientRect().y +
      searchElem.getBoundingClientRect().height +
      10 +
      'px',
    left: searchElem.getBoundingClientRect().x + 'px',
  };
};

const SearchModal = ({ backendQuery, searchElem, setShowModal }) => {
  const { data: cards } = useAxiosGet(`/task/?q=${backendQuery}`);
  const { data: projects } = useAxiosGet(`/project/?q=${backendQuery}`);

  useEffect(modalBlurHandler(setShowModal), []);

  return (
    <div
      className="search-suggestions"
      style={getSearchSuggestionsPosition(searchElem.current)}
    >
      {/* <p className="search-suggestions__title">Cards</p>
      <ul className="search-suggestions__cards">
        {[].map((card) => (
          <Card card={card} />
        ))}
      </ul> */}

      <p className="search-suggestions__title">Projects</p>
      <ul className="search-suggestions__boards">
        {(projects || []).map((board) => (
          <SearchedBoard
            board={board}
            setShowModal={setShowModal}
            key={uuidv4()}
          />
        ))}
      </ul>
    </div>
  );
};

export default SearchModal;
