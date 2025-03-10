import { FormData } from "@/app/form";

const useLocalStorage = () => {
  const STORAGE_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY;

  if (!STORAGE_KEY)
    throw new Error("ENV VAR NOT FOUND: NEXT_PUBLIC_STORAGE_KEY not found!");

  const saveToLocalStorage = (data: FormData, isSubmitted: boolean = false) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(
      `${STORAGE_KEY}_submitted`,
      isSubmitted ? "true" : "false"
    );
  };

  const loadFromLocalStorage = (): {
    data: FormData | null;
    isSubmitted: boolean;
  } => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const submissionStatus = localStorage.getItem(`${STORAGE_KEY}_submitted`);

      return {
        data: savedData ? JSON.parse(savedData) : null,
        isSubmitted: submissionStatus === "true",
      };
    } catch (err) {
      console.error("Error loading saved data:", err);
      return { data: null, isSubmitted: false };
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_submitted`);
  };

  return { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage };
};

export default useLocalStorage;
