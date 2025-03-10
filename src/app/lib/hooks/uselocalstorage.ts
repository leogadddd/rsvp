import { FormDataBase, FormDataWithSleepover } from "@/app/form";

const useLocalStorage = () => {
  const DEFAULT_STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY;
  if (!DEFAULT_STORAGE_KEY)
    throw new Error("ENV VAR NOT FOUND: NEXT_PUBLIC_STORAGE_KEY not found!");

  const saveToLocalStorage = (
    data: FormDataBase | FormDataWithSleepover,
    isSubmitted: boolean = false,
    customKey?: string
  ) => {
    const key = customKey || DEFAULT_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_submitted`, isSubmitted ? "true" : "false");
  };

  const loadFromLocalStorage = (
    customKey?: string
  ): {
    data: FormDataBase | FormDataWithSleepover | null;
    isSubmitted: boolean;
  } => {
    const key = customKey || DEFAULT_STORAGE_KEY;
    try {
      const savedData = localStorage.getItem(key);
      const submissionStatus = localStorage.getItem(`${key}_submitted`);
      return {
        data: savedData ? JSON.parse(savedData) : null,
        isSubmitted: submissionStatus === "true",
      };
    } catch (err) {
      console.error("Error loading saved data:", err);
      return { data: null, isSubmitted: false };
    }
  };

  const clearLocalStorage = (customKey?: string) => {
    const key = customKey || DEFAULT_STORAGE_KEY;
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_submitted`);
  };

  return { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage };
};

export default useLocalStorage;
