import { useState, useContext } from "react";
import { createFoodServices } from "../services/foodServices";
import { AppContext } from "../../../../context/ContextApp";

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const createPost = async (data) => {
    setLoading(true);
    try {
      const res = await createFoodServices(data);
      showToast("Post created successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "creation failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading };
};
