import APIClient from "./ApiClient";

const client = new APIClient("users");

export const ResubmitServices = (formData, token) => {
  return client.put(formData, `resubmit-documents/${token}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
