const express = require("express");
const {
  enquiryInsert,
  enquiryList,
  enquiryDelete,
  enquirysingleRow,
  enquiryupdate,
} = require("../../controllers/web/enquiryController");

const enquiryRouter = express.Router();

enquiryRouter.post("/insert", enquiryInsert);
enquiryRouter.get("/view", enquiryList);
enquiryRouter.delete("/delete/:id", enquiryDelete);
enquiryRouter.get("/single/:id", enquirysingleRow);
enquiryRouter.put("/update/:id", enquiryupdate);

module.exports = enquiryRouter;