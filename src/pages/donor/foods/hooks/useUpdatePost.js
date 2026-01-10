import { useState, useContext } from "react";
import { editFoodServices } from "../services/foodServices";
import { AppContext } from "../../../../context/ContextApp";

export const useUpdatePost = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useContext(AppContext);

  const updatePost = async (data, id) => {
    setLoading(true);
    try {
      const res = await editFoodServices(data, id);
      showToast("Post updated successfully", "success");
      return res;
    } catch (err) {
      showToast(err.message || "creation failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePost, loading };
};
