import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";
import axios from "axios";
import { HeroList } from "./HeroList";
import "@testing-library/jest-dom";

// Mock the axios library
jest.mock("axios");

const heroesMockData = {
  data: {
    results: [
      { id: "1", name: "Luke Skywalker", films: ["1"], starships: ["1"] },
      { id: "2", name: "Darth Vader", films: ["2"], starships: [] },
    ],
    next: null,
  },
};

describe("HeroList Component", () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  test("renders header and info text", () => {
    render(<HeroList />);
    expect(screen.getByText(/Star Wars/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Click on a hero to see more detailed information about them./i
      )
    ).toBeInTheDocument();
  });

  test("fetches and displays heroes", async () => {
    axios.get.mockResolvedValue(heroesMockData);

    render(<HeroList />);

    // Check if heroes are displayed
    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Darth Vader")).toBeInTheDocument();
  });

  test("displays an error message if fetching heroes fails", async () => {
    axios.get.mockRejectedValue(new Error("Failed to fetch heroes"));

    render(<HeroList />);

    // Check if error message is displayed
    expect(
      await screen.findByText("Failed to fetch heroes. Please try again later.")
    ).toBeInTheDocument();
  });
});
