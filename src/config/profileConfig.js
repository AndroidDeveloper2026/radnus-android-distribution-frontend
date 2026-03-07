export const profileConfig = {
  Distributor: {
    imageKey: "images.profile",
    fields: [
      { label: "Business Name", key: "businessName" },
      { label: "Owner Name", key: "name" },
      { label: "Mobile", key: "mobile", editable: false },
      { label: "GST Number", key: "gst" },
      { label: "Address", key: "address" },
    ],
  },

  FSE: {
    imageKey: "photo",
    fields: [
      { label: "Name", key: "name" },
      { label: "Phone", key: "phone", editable: false },
      { label: "Email", key: "email" },
      { label: "DOB", key: "dob" },
      { label: "Address", key: "address" },
    ],
  },

  Retailer: {
    imageKey: "shopPhoto",
    fields: [
      { label: "Shop Name", key: "shopName" },
      { label: "Owner Name", key: "ownerName" },
      { label: "Mobile", key: "mobile", editable: false },
      { label: "GPS Location", key: "gps" },
    ],
  },
};