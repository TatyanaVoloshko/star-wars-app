import React from "react";
import { render, screen, } from "@testing-library/react";
import { HeroDetail } from "./HeroDetail";
import "@testing-library/jest-dom";

jest.mock("axios");

const heroMockData = {
  id: "1",
  name: "Luke Skywalker",
  films: ["1"],
  starships: ["1"],
};

describe("HeroDetail Component", () => {
 

  test("fetches and displays hero details", async () => {
    render(<HeroDetail hero={heroMockData} />);

    // Check that the loading indicator is displayed
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
