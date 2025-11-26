import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { EnquiryList } from "./enquiry/EnquiryList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8020/api/website/enquiry";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  _id: "",
};

function Enquiry() {
  const [formData, setFormData] = useState(initialFormState);
  const [enquiryList, setEnquiryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/view`);
      if (data?.status) {
        setEnquiryList(data.enquiryList ?? []);
      } else {
        toast.error(data?.message || "Failed to load enquiries");
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
      toast.error("Could not load enquiries");
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const getValue = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialFormState);

  const saveEnquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { _id, ...payload } = formData;
    try {
      if (_id) {
        await axios.put(`${API_BASE}/update/${_id}`, payload);
        toast.success("Enquiry updated successfully");
      } else {
        await axios.post(`${API_BASE}/insert`, payload);
        toast.success("Enquiry saved successfully");
      }
      resetForm();
      await fetchEnquiries();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-[40px] text-center font-bold py-6">User Enquiry</h1>

      <div className="grid grid-cols-[30%_auto] gap-10">
        <div className="bg-gray-200 p-4">
          <h2 className="text-[20px] font-bold">Enquiry Form</h2>

          <form onSubmit={saveEnquiry}>
            <div className="py-3">
              <Label htmlFor="name">Your Name</Label>
              <TextInput
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={getValue}
                placeholder="Enter Your Name"
                required
              />
            </div>

            <div className="py-3">
              <Label htmlFor="email">Your Email</Label>
              <TextInput
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={getValue}
                placeholder="Enter Your Email"
                required
              />
            </div>

            <div className="py-3">
              <Label htmlFor="phone">Your Phone</Label>
              <TextInput
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={getValue}
                placeholder="Enter Your Phone"
                required
              />
            </div>

            <div className="py-3">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={getValue}
                placeholder="Enter Your Message..."
                required
              />
            </div>

            <Button className="py-3 w-full" type="submit" disabled={loading}>
              {loading ? "Saving..." : formData._id ? "Update" : "Save"}
            </Button>
          </form>
        </div>

        <EnquiryList
          data={enquiryList}
          refreshEnquiries={fetchEnquiries}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}

export default Enquiry;
