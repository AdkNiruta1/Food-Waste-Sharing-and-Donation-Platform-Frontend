import APIClient from "../../../services/ApiClient";

const client = new APIClient("contact");

export const contactService = (data) => {
  return client.post(data);
}
