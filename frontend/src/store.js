import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios";

export const useInterviewStore = create((set, get) => ({
  parsedResume: "",
  questions: [],
  answers: [],
  evaluation: null,
  currentIndex: 0,
  loading: "",

  uploadResume: async (file, company = "", role = "", numQuestions) => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      set({ loading: "Uploading resume..." });
      const res = await axiosInstance.post(
        "/api/interviews/uploadResume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set({ parsedResume: res.data.parsedResume });
      toast.success("Resume uploaded!");

      // Auto get questions
      set({ loading: "Generating questions..." });
      const qres = await axiosInstance.post("/api/interviews/getQuestions", {
        company,
        role,
        numQuestions,
      });
      set({ questions: qres.data.questions });
      toast.success("Questions generated!");
      set({ loading: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload or get questions");
      set({ loading: "" });
    }
  },

  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
    })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    })),

  submitAnswers: async () => {
    const { answers } = get();
    try {
      set({ loading: "Evaluating answers..." });
      const res = await axiosInstance.post("/api/interviews/submitAnswers", {
        answers,
      });

      // ✅ Correct: whole response is the evaluation JSON
      set({ evaluation: res.data });
      toast.success("Evaluation done!");
      set({ loading: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to evaluate.");
      set({ loading: "" });
    }
  },

  reset: () =>
    set({
      parsedResume: "",
      questions: [],
      answers: [],
      evaluation: null,
      currentIndex: 0,
      loading: "",
    }),
}));
