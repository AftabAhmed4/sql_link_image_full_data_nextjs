'use client';

import React, { useState, ChangeEvent, FormEvent, DragEvent } from 'react';
import { MdOutlineUploadFile } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Image from 'next/image';

// import upload from '@/public/upload.png'; // adjust the path to your image

interface FormDataState {
  Name: string;
  Description: string;
  ImageUrl: string;
}

const BusinessForm = () => {
  const [formData, setFormData] = useState<FormDataState>({
    Name: '',
    Description: '',
    ImageUrl: '',
  });




  //Image Operations

  const [uploading, setUploading] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);

  const MAX_FILE_SIZE_MB = 5;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setUploading(true);
    const imgFormData = new FormData();
    imgFormData.append('image', file);

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: imgFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, ImageUrl: result.url }));
      } else {
        alert(`Failed To Upload Due To ${result.detail}`);
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      alert(error.message || 'Something went wrong');
    }
    setUploading(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDeleteImage = async () => {
    if (!formData.ImageUrl) {
      alert('No image to delete!');
      return;
    }

    try {
      const response = await fetch(`/api/uploads`, {
        method: 'DELETE',
        body: JSON.stringify({ fileName: formData.ImageUrl }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.error || "Somethong Wrong.")
        return
      }

      alert('Image Deleted');
      setFormData((prev) => ({ ...prev, ImageUrl: '' }));


    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Image not deleted');
    }
  };


  //Image Operations









  // Data with Image POST
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/data', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: formData.Name, Description: formData.Description, ImageUrl: formData.ImageUrl })
      });


      const data = await response.json()

      if (!response.ok) {
        alert(data.error)
        return
      }

      alert("Empoyee Added!")


      setFormData({
        Name: '',
        Description: '',
        ImageUrl: '',
      })



    } catch (error) {
      console.error(error)
    }
  }



  return (
    <div className="justify-center items-center flex h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business description"
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div
          className={`bg-white p-4 rounded-lg relative border mt-5 ${dragging ? 'border-[#9069EA] bg-gray-100' : 'border-gray-300'
            }`}
        >
          {/* Top Right Buttons */}
          <div className="absolute top-4 right-4 flex gap-4">
            {/* Upload Button */}
            <div className="relative group flex flex-col items-center">
              <div
                className={`p-2 rounded-lg ${formData.ImageUrl
                  ? 'bg-[#A2A1A8] opacity-50 cursor-not-allowed'
                  : 'bg-[#9069EA] cursor-pointer'
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() =>
                  !formData.ImageUrl &&
                  (document.getElementById('fileInput') as HTMLInputElement).click()
                }
              >
                <MdOutlineUploadFile size={24} className="text-white" />
              </div>
              <span className="absolute top-full mt-1 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded-md z-30 whitespace-nowrap">
                Upload Image
              </span>
            </div>

            {/* Delete Button */}
            <div className="relative group flex flex-col items-center">
              <div
                className={`p-2 rounded-lg ${formData.ImageUrl
                  ? 'bg-[#E1045F] cursor-pointer'
                  : 'bg-[#A2A1A8] opacity-50 cursor-not-allowed'
                  }`}
                onClick={formData.ImageUrl ? handleDeleteImage : undefined}
              >
                <RiDeleteBin6Line size={24} className="text-white" />
              </div>
              <span className="absolute top-full mt-1 scale-0 group-hover:scale-100 transition-all duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded-md z-30 whitespace-nowrap">
                Delete Image
              </span>
            </div>
          </div>

          {/* Upload Box */}
          <div
            className="p-6 flex justify-start items-left text-left"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() =>
              !formData.ImageUrl &&
              (document.getElementById('fileInput') as HTMLInputElement).click()
            }
          >
            {formData.ImageUrl ? (
              <Image
                src={formData.ImageUrl}
                alt="Uploaded"
                className="max-h-40 object-cover rounded-md"
                width={200}
                height={200}
              />
            ) : (
              <div>
                <span className="cursor-pointer flex flex-col justify-center items-center">
                  {/* <Image src={} alt="upload image" className="max-w-40 h-auto" /> */}
                </span>
                <p className="text-gray-600 text-sm cursor-pointer text-center">
                  {uploading ? 'Uploading...' : 'Click or Drag & Drop an Image Here'}
                </p>
              </div>
            )}
          </div>

          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* Image Preview */}
        {/* {formData.ImageUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
            <Image
              src={formData.ImageUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain border rounded"
              width={200}
              height={200}
            />
          </div>
        )} */}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BusinessForm;
