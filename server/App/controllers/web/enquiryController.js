const enquiryModel = require("../../models/enquiry.model");

const buildResponseError = (res, err, message = "Something went wrong") => {
  console.error(message, err);
  return res.status(500).send({ status: 0, message, error: err?.message || err });
};

const enquiryInsert = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const enquiry = new enquiryModel({ name, email, phone, message });
    await enquiry.save();
    res.send({ status: 1, message: "Enquiry saved successfully", enquiry });
  } catch (err) {
    buildResponseError(res, err, "Error while saving enquiry");
  }
};

const enquiryList = async (_req, res) => {
  try {
    const enquiry = await enquiryModel.find().sort({ createdAt: -1 });
    res.send({ status: 1, enquiryList: enquiry });
  } catch (err) {
    buildResponseError(res, err, "Error while fetching enquiries");
  }
};

const enquiryDelete = async (req, res) => {
  try {
    const enId = req.params.id;
    if (!enId) {
      return res.status(400).send({ status: 0, message: "Enquiry id is required" });
    }
    const deleteResult = await enquiryModel.deleteOne({ _id: enId });
    res.send({ status: 1, message: "Enquiry deleted successfully", deleteResult });
  } catch (err) {
    buildResponseError(res, err, "Error while deleting enquiry");
  }
};

const enquirysingleRow = async (req, res) => {
  try {
    const enId = req.params.id;
    if (!enId) {
      return res.status(400).send({ status: 0, message: "Enquiry id is required" });
    }
    const enquiry = await enquiryModel.findOne({ _id: enId });
    if (!enquiry) {
      return res.status(404).send({ status: 0, message: "Enquiry not found" });
    }
    res.send({ status: 1, enquiry });
  } catch (err) {
    buildResponseError(res, err, "Error while fetching enquiry");
  }
};

const enquiryupdate = async (req, res) => {
  try {
    const enquiryId = req.params.id;
    if (!enquiryId) {
      return res.status(400).send({ status: 0, message: "Enquiry id is required" });
    }
    const { name, email, phone, message } = req.body;
    const updateObj = { name, email, phone, message };
    const updateRes = await enquiryModel.findByIdAndUpdate(enquiryId, updateObj, {
      new: true,
      runValidators: true,
    });
    if (!updateRes) {
      return res.status(404).send({ status: 0, message: "Enquiry not found" });
    }
    res.send({ status: 1, message: "Enquiry updated successfully", enquiry: updateRes });
  } catch (err) {
    buildResponseError(res, err, "Error while updating enquiry");
  }
};

module.exports = {
  enquiryInsert,
  enquiryList,
  enquiryDelete,
  enquirysingleRow,
  enquiryupdate,
};