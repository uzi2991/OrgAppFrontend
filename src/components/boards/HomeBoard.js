import React from "react";
import ProfilePic from "./ProfilePic";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

import { authAxios } from "../../static/js/util";
import { backendUrl } from "../../static/js/const";

const HomeBoard = ({ project, replaceProject }) => {
    // const toggleFavorite = async (e) => {
    //     e.preventDefault(); // Prevent anchor link wrapped around board from redirecting us
    //     await authAxios.post(`${backendUrl}/boards/star/`, {
    //         board: board.id,
    //     });
    //     replaceBoard({
    //         ...board,
    //         is_starred: !board.is_starred,
    //     });
    // };

    return (
        <Link to={`/project/${project._id}`} className="board-preview">
            {/* <button
                className={`board-preview__star${
                    board.is_starred ? " board-preview__star--starred" : ""
                }`}
                onClick={toggleFavorite}
            >
                {!board.is_starred ? (
                    <i className="fal fa-star"></i>
                ) : (
                    <i className="fas fa-star"></i>
                )}
            </button> */}
            {/* {project.color ? (
                <div
                    className="board-preview__color"
                    style={{ backgroundColor: `#${project.color}` }}
                ></div>
            ) : (
                <div className="board-preview__image">
                    <img src={board.image || board.image_url} />
                </div>
            )} */}
            <p
                className="board-preview__title"
                style={{ marginBottom: project.members ? "1em" : 0 }}
            >
                {project.title}
            </p>
            {/* {project.members && <Members members={project.members} />} */}
        </Link>
    );
};

const Members = ({ members }) => {
    return (
        <div className="board-preview__members">
            {members.slice(0, 3).map((member) => (
                <ProfilePic user={member} key={uuidv4()} />
            ))}
            {members.length > 3 && (
                <p>{`+${members.length - 3} other${
                    members.length - 3 === 1 ? "" : "s"
                }`}</p>
            )}
        </div>
    );
};

export default HomeBoard;
