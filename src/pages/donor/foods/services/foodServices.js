import APIClient from "../../../../services/ApiClient";

const client = new APIClient("food-donations");

export const createFoodServices = (formData) => {
  const data = new FormData();

  // Append all fields
  for (const key in formData) {
    if (key === "geoLocation") {
      // append lat and lng separately
      data.append("lat", formData.geoLocation.lat);
      data.append("lng", formData.geoLocation.lng);
    } else if (key === "photo" && formData.photo) {
      data.append("photo", formData.photo); // file
    } else {
      data.append(key, formData[key]);
    }
  }

  return client.post(data, '', {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
