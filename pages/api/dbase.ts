import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

import { NextApiRequest, NextApiResponse } from "next/types";
import { StockItem, StockItems } from "../../@types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "../../public/dbase/", "stock.json");

const adapter = new JSONFile<StockItems>(file);
const db = new Low<StockItems>(adapter, []);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await db.read();
  let dbase = db.data;
  const { id, name, manufacturer, stockLevel }: StockItem & { id?: number } =
    req.body;
  const missingData = [];

  switch (req.method) {
    case "GET": // Get Data
      return res.status(200).json(dbase);
    case "PUT": // Put Data
      if (!name) missingData.push("name");
      if (!manufacturer) missingData.push("manufacturer");
      if (isNaN(stockLevel) || stockLevel < 0) missingData.push("stockLevel");

      if (missingData.length > 0) {
        return res.status(400).json({
          error: `Missing data: ${missingData.join(", ")}`,
        });
      }
      if (id !== undefined) {
        dbase[id] = { name, manufacturer, stockLevel };
      } else {
        dbase.push({ name, manufacturer, stockLevel });
      }
      await db.write();
      return res.status(200).json({});
    case "DELETE":
      if (id === undefined) {
        return res.status(400).json({
          error: `Missing data: id`,
        });
      }
      dbase = dbase.splice(id as number, 1);
      await db.write();
      return res.status(200).json({});
    default:
      return res.status(405).json({
        error: "Invalid request method",
      });
  }
};
