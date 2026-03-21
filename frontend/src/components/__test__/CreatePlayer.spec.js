/*import {render,fireEvent,screen } from '@testing-library/react';
import CreatePlayer from '../pages/CreatePlayer';

test('renders CreatePlayer component',() =>{
    render(<CreatePlayer/>);
    const nameInput = screen.getByTestId('name-input');
    const ageInput = screen.getByTestId('age-input');
    const positionInput = screen.getByTestId('position-input');
    const submitButton = screen.getByTestId('submit-button');
    const backButton = screen.getByTestId('back-button');
    const heightInput = screen.getByTestId('height-input');
    const weightInput = screen.getByTestId('weight-input');
    const preferredFootInput = screen.getByTestId('preferredFoot-input');
    const currentTeamInput = screen.getByTestId('currentTeam-input');
    const profileImageInput = screen.getByTestId('profileImage-input');
    const emailInput = screen.getByTestId('email-input');
    const playeridInput = screen.getByTestId('playerId-input');

    //interact with elements
    fireEvent.click(submitButton);
    fireEvent.click(backButton);
    
    
    expect(nameInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();
    expect(positionInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(heightInput).toBeInTheDocument();
    expect(weightInput).toBeInTheDocument();
    expect(preferredFootInput).toBeInTheDocument();
    expect(currentTeamInput).toBeInTheDocument();
    expect(profileImageInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(playeridInput).toBeInTheDocument();
})*/


/*import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreatePlayer from "../pages/CreatePlayer";

test("renders CreatePlayer component", () => {
  render(
    <BrowserRouter>
      <CreatePlayer />
    </BrowserRouter>
  );

  const nameInput = screen.getByTestId("name-input");

  expect(nameInput).toBeInTheDocument();
});*/



import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreatePlayer from "../pages/CreatePlayer";


// ✅ Test 1: Check all elements render
test("renders all CreatePlayer inputs", () => {
  render(
    <BrowserRouter>
      <CreatePlayer />
    </BrowserRouter>
  );

  expect(screen.getByTestId("playerId-input")).toBeInTheDocument();
  expect(screen.getByTestId("email-input")).toBeInTheDocument();
  expect(screen.getByTestId("profileImage-input")).toBeInTheDocument();
  expect(screen.getByTestId("name-input")).toBeInTheDocument();
  expect(screen.getByTestId("position-input")).toBeInTheDocument();
  expect(screen.getByTestId("age-input")).toBeInTheDocument();
  expect(screen.getByTestId("weight-input")).toBeInTheDocument();
  expect(screen.getByTestId("height-input")).toBeInTheDocument();
  expect(screen.getByTestId("preferredFoot-input")).toBeInTheDocument();
  expect(screen.getByTestId("currentTeam-input")).toBeInTheDocument();
  expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  expect(screen.getByTestId("back-button")).toBeInTheDocument();
});


// ✅ Test 2: Check user input works
test("user can type in inputs", () => {
  render(
    <BrowserRouter>
      <CreatePlayer />
    </BrowserRouter>
  );

  const nameInput = screen.getByTestId("name-input");
  const ageInput = screen.getByTestId("age-input");

  fireEvent.change(nameInput, { target: { value: "Messi" } });
  fireEvent.change(ageInput, { target: { value: "36" } });

  expect(nameInput.value).toBe("Messi");
  expect(ageInput.value).toBe("36"); // number conversion
});


// ✅ Test 3: Button interaction
test("buttons are clickable", () => {
  render(
    <BrowserRouter>
      <CreatePlayer />
    </BrowserRouter>
  );

  const submitButton = screen.getByTestId("submit-button");
  const backButton = screen.getByTestId("back-button");

  fireEvent.click(submitButton);
  fireEvent.click(backButton);

  expect(submitButton).toBeInTheDocument();
  expect(backButton).toBeInTheDocument();
});