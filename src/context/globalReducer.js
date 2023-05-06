export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_BOARD_CONTEXT = "SET_BOARD_CONTEXT";

export const globalReducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, authUser: action.user, checkedAuth: true };
        case LOGOUT:
            return { ...state, authUser: null, checkedAuth: true };
        case SET_BOARD_CONTEXT:
            return { ...state, project: action.project, setProject: action.setProject };
        default:
            return state;
    }
};
