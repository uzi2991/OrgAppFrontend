import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from 'react-router-dom';
import "@testing-library/jest-dom";
import Error404 from "../../pages/Error404";

test("Error404 snapshot", () => {
    const errorSnapshot = renderer.create(
        <Router>
            <Error404 />
        </Router>

    ).toJSON();

    expect(errorSnapshot).toMatchSnapshot();
})

