import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import Project from "../../pages/Project";

test("Project snapshot", () => {
    const mockMatchParams = {
        id: '123',
    };

    const mockLocationSearch = '?tab=info';

    const props = {
        match: {
            params: mockMatchParams,
        },
        location: {
            search: mockLocationSearch,
        },
    };
    const projectSnapshot = renderer.create(
        <Project {...props} />
    ).toJSON();

    expect(projectSnapshot).toMatchSnapshot();
})

