import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import RegisterForm from "../auth/RegisterForm";

test("LoginForm snapshot", () => {
    const registerFormSnapshot = renderer.create(
        <RegisterForm />
    ).toJSON();

    expect(registerFormSnapshot).toMatchSnapshot();
})