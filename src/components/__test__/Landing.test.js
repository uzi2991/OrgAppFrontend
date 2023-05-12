import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter as Router } from 'react-router-dom';
import "@testing-library/jest-dom";
import Landing from "../../pages/Landing";

test("Landing snapshot", () => {
    const landingSnapshot = renderer.create(
        <Router>
            <Landing />
        </Router>

    ).toJSON();

    expect(landingSnapshot).toMatchSnapshot();
})

