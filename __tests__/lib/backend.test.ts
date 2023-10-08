/**
 * @jest-environment jsdom
 */
import fetch from "jest-fetch-mock";
import { add, edit, get, remove } from "../../lib/backend";

const mockDBase = [
  {
    name: "Shirts",
    manufacturer: "Polo",
    stockLevel: 50,
  },
];
const successResponseObj = { success: true };

describe("DBase", () => {
  afterAll(() => {
    fetch.resetMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
  });
  it("Checking `get` collects dbase/stock.json", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockDBase));

    const fetchedDbase = await get();

    expect(JSON.stringify(fetchedDbase)).toMatch(JSON.stringify(mockDBase));
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://localhost:3000/api/dbase");
    expect(fetch.mock.calls[0][1]?.method).toEqual("GET");
  });

  it("Checking `add` pushes into dbase/stock.json", async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponseObj));

    const fetchedDbase = await add({
      name: "test",
      manufacturer: "test",
      stockLevel: 0,
    });

    expect(JSON.stringify(fetchedDbase)).toMatch(
      JSON.stringify(successResponseObj)
    );
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://localhost:3000/api/dbase");
    expect(fetch.mock.calls[0][1]?.method).toEqual("PUT");
  });

  it("Checking `edit` replaces entry in dbase/stock.json", async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponseObj));

    const fetchedDbase = await edit(0, {
      name: "test",
      manufacturer: "test",
      stockLevel: 0,
    });

    expect(JSON.stringify(fetchedDbase)).toMatch(
      JSON.stringify(successResponseObj)
    );
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://localhost:3000/api/dbase");
    expect(fetch.mock.calls[0][1]?.method).toEqual("PUT");
  });

  it("Checking `remove` removes entry from dbase/stock.json", async () => {
    fetch.mockResponseOnce(JSON.stringify(successResponseObj));

    const fetchedDbase = await remove(0);

    expect(JSON.stringify(fetchedDbase)).toMatch(
      JSON.stringify(successResponseObj)
    );
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://localhost:3000/api/dbase");
    expect(fetch.mock.calls[0][1]?.method).toEqual("DELETE");
  });
});
