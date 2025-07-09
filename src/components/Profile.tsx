import React, { useState } from 'react';

const functionalDepartments = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'IT',
  'Support',
];

const Profile = () => {
  const [form, setForm] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    departments: '',
    designation: '',
    dateOfJoining: '',
    dateOfLeaving: '',
    workLocation: '',
    fullAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCancel = () => {
    setForm({
      fullName: '',
      employeeId: '',
      email: '',
      phone: '',
      departments: '',
      designation: '',
      dateOfJoining: '',
      dateOfLeaving: '',
      workLocation: '',
      fullAddress: '',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    alert('Profile saved!');
  };

  return (
    <div className="max-w-8xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-lg text-white p-2 font-bold bg-blue-900 rounded-t-md mb-4">Employee Details</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3 flex gap-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="FullName">Full Name</label>
            <input
              type="text"
              id="FullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="EmployeeId">Employee ID</label>
            <input
              type="text"
              id="EmployeeId"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="mb-3 flex gap-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="Phone">Phone</label>
            <input
              type="tel"
              id="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="mb-3 flex gap-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="Departments">Functional Departments</label>
            <select
              id="Departments"
              name="departments"
              value={form.departments}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>Select Department</option>
              {functionalDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="Designation">Designation</label>
            <input
              type="text"
              id="Designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="mb-3 flex gap-x-4">
            <div className="flex-1">
          <label className="block text-sm font-medium mb-1" htmlFor="DateOfJoining">Date of Joining</label>
          <input
            type="date"
            id="DateOfJoining"
            name="dateOfJoining"
            value={form.dateOfJoining}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1" htmlFor="DateOfLeaving">Date of Leaving</label>
          <input
            type="date"
            id="DateOfLeaving"
            name="dateOfLeaving"
            value={form.dateOfLeaving}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" htmlFor="WorkLocation">Work Location</label>
          <input
            type="text"
            id="WorkLocation"
            name="workLocation"
            value={form.workLocation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="FullAddress">Full Address</label>
          <textarea
            id="FullAddress"
            name="fullAddress"
            value={form.fullAddress}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;