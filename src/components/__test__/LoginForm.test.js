import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import LoginForm from "../auth/LoginForm";

test("LoginForm snapshot", () => {
    const loginFormSnapshot = renderer.create(
        <LoginForm />
    ).toJSON();

    expect(loginFormSnapshot).toMatchSnapshot();
})

