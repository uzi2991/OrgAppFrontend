import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import Home from "../../pages/Home";

test("Home snapshot", () => {
    const homeSnapshot = renderer.create(
        <Home />
    ).toJSON();

    expect(homeSnapshot).toMatchSnapshot();
})

