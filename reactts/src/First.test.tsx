import First from "./First";
import { render, screen } from "@testing-library/react";
// import { describe, it, expect } from "vitest";

describe("First Component", () => {
    it("renders the First component", () => {
        render(<First />);
        const heading = screen.getByRole("heading", { name: /first component/i });
        expect(heading).toBeInTheDocument();
    });
});
// Compare this snippet from test/jest.setup.ts:   
