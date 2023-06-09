import React from 'react';

export default React.createContext({
  authUser: null,
  checkedAuth: false, // Whether your auth has been checked or not
  // The below two are to reduce prop drilling to List and Card
  project: null, // The board we are currently viewing, via useAxiosGet in Board.js.
  setProject: null, // The setter returned by useAxioGet in Board.js
});
