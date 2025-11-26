import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Swal from "sweetalert2";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8020/api/website/enquiry";

export function EnquiryList({
  data = [],
  refreshEnquiries,
  setFormData = () => {},
}) {
  const deleteRow = async (delId) => {
    if (!delId) return;
    const result = await Swal.fire({
      title: "Delete this enquiry?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/delete/${delId}`);
      toast.success("Enquiry deleted successfully");
      await refreshEnquiries?.();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete enquiry");
    }
  };

  const editRow = async (editId) => {
    if (!editId) return;
    try {
      const { data } = await axios.get(`${API_BASE}/single/${editId}`);
      if (data?.enquiry) {
        setFormData((prev) => ({
          ...prev,
          ...data.enquiry,
          _id: data.enquiry._id,
        }));
      } else {
        toast.error("Enquiry not found");
      }
    } catch (err) {
      console.error("Fetch single error:", err);
      toast.error("Failed to fetch enquiry");
    }
  };

  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-[20px] font-bold mb-4">Enquiry List</h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Sr No</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Message</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>Edit</TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item._id || index} className="bg-white">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.message}</TableCell>

                  <TableCell>
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteRow(item._id)}
                    >
                      Delete
                    </button>
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => editRow(item._id)}
                    >
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default EnquiryList;

