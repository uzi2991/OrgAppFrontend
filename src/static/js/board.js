import { authAxios } from './util';
import { backendUrl } from './const';

// All board state manipulating functions in this file
// So other files don't get bloated
export const onDragEnd = (board, setBoard) => (result) => {
  // Must update state synchromously so hit endpoint after setState
  // A bit optimistic but a must
  if (result.type === 'list') {
    onDragEndList(board, setBoard, result);
    onDragEndListBackend(board, setBoard, result);
  } else if (result.type === 'item') {
    onDragEndItem(board, setBoard, result);
    onDragEndItemBackend(board, setBoard, result);
  }
};

const getNewOrder = (sourceIndex, destinationIndex, arr) => {
  let newOrder;
  if (destinationIndex === 0) {
    if (arr.length) newOrder = arr[0].order / 2;
    else newOrder = 65535;
  } else if (destinationIndex < arr.length - 1) {
    const isAdjacent = Math.abs(sourceIndex - destinationIndex) == 1;
    const neighbourOneOrder = parseFloat(
      isAdjacent
        ? arr[destinationIndex - 1].order
        : arr[destinationIndex + 1].order,
    );
    const neighbourTwoOrder = parseFloat(arr[destinationIndex].order);
    newOrder = (neighbourOneOrder + neighbourTwoOrder) / 2;
  } else if (destinationIndex >= arr.length - 1)
    newOrder = parseFloat(arr[arr.length - 1].order) + 65535;
  return newOrder.toFixed(15);
};

const onDragEndItem = (board, setBoard, result) => {
  const { source, destination, draggableId } = result;
  if (!destination) return; // Dropped outside of list
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return; // Position didn't change

  const sourceList = board.lists.find(
    (list) => list._id.toString() === source.droppableId,
  );
  const item = sourceList.items.find(
    (item) => item._id.toString() === draggableId,
  );
  const destinationList = board.lists.find(
    (list) => list._id.toString() === destination.droppableId,
  );

  const newItems = [...sourceList.items];
  let newItems2;
  if (source.droppableId === destination.droppableId) {
    newItems2 = newItems;
  } else {
    newItems2 = [...destinationList.items];
  }
  newItems.splice(source.index, 1);
  newItems2.splice(destination.index, 0, item);

  const newList = {
    ...sourceList,
    items: newItems,
  };

  const newList2 = {
    ...destinationList,
    items: newItems2,
  };

  const newLists = board.lists.map((list) => {
    if (list._id === newList._id) return newList;
    else if (list._id === newList2._id) return newList2;
    return list;
  });

  const newBoard = {
    ...board,
    lists: newLists,
  };

  setBoard(newBoard);
};

const onDragEndItemBackend = async (board, setBoard, result) => {
  const { source, destination, draggableId } = result;
  if (!destination) return; // Dropped outside of list
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return; // Position didn't change

  const sourceList = board.lists.find(
    (list) => list._id.toString() === source.droppableId,
  );
  const item = sourceList.items.find(
    (item) => item._id.toString() === draggableId,
  );
  const destinationList = board.lists.find(
    (list) => list._id.toString() === destination.droppableId,
  );

  const newOrder = getNewOrder(
    source.index,
    destination.index,
    destinationList.items,
  );
};

const onDragEndList = (board, setBoard, result) => {
  const { source, destination, draggableId } = result;
  if (!destination) return; // Dropped outside of board
  if (source.index === destination.index) return; // Position didn't change, no need to compare droppableIds as only one droppable

  const list = board.lists.find(
    (list) => 'list' + list._id.toString() === draggableId,
  );

  const newLists = [...board.lists];
  newLists.splice(source.index, 1);
  newLists.splice(destination.index, 0, list);

  const newBoard = {
    ...board,
    lists: newLists,
  };

  setBoard(newBoard);
};

const onDragEndListBackend = async (board, setBoard, result) => {
  const { source, destination, draggableId } = result;
  if (!destination) return; // Dropped outside of board
  if (source.index === destination.index) return; // Position didn't change, no need to compare droppableIds as only one droppable
  const list = board.lists.find(
    (list) => 'list' + list._id.toString() === draggableId,
  );

  const newOrder = getNewOrder(source.index, destination.index, board.lists);
};

export const addList = (board, setBoard) => (list) => {
  const newLists = [...board.lists, list];
  const newBoard = {
    ...board,
    lists: newLists,
  };

  setBoard(newBoard);
};

export const deleteList = (project, setProject) => (list) => {
  const newLists = project.lists.filter((item) => item._id !== list._id);
  const newProject = {
    ...project,
    lists: newLists,
  };

  setProject(newProject);
};

export const updateList = (_, setBoard) => (updatedList) => {
  setBoard((board) => {
    const newLists = board.lists.map((list) =>
      list._id === updatedList._id ? updatedList : list,
    );
    const newBoard = {
      ...board,
      lists: newLists,
    };
    return newBoard;
  });
};

export const addCard = (project, setProject) => (listId, newCard) => {
  const newLists = project.lists.map((list) =>
    list._id === listId ? { ...list, items: [...list.items, newCard] } : list,
  );

  const newProject = {
    ...project,
    lists: newLists,
  };

  setProject(newProject);
};

export const updateCard = (_, setProject) => (listId, updatedCard) => {
  setProject((project) => {
    const targetList = project.lists.find((list) => list._id === listId);
    const newItems = targetList.items.map((item) =>
      item._id === updatedCard._id ? updatedCard : item,
    );
    const newList = {
      ...targetList,
      items: newItems,
    };
    const newLists = project.lists.map((list) =>
      list._id === newList._id ? newList : list,
    );
    const newProject = {
      ...project,
      lists: newLists,
    };
    return newProject;
  });
};

export const deleteCard = (_, setProject) => (listId, deletedCard) => {
  setProject((project) => {
    const targetList = project.lists.find((list) => list._id === listId);
    const newItems = targetList.items.filter(
      (item) => item._id !== deletedCard._id,
    );
    const newList = {
      ...targetList,
      items: newItems,
    };
    const newLists = project.lists.map((list) =>
      list._id === newList._id ? newList : list,
    );
    const newProject = {
      ...project,
      lists: newLists,
    };
    return newProject;
  });
};

