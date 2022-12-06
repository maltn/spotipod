import create from "zustand";

interface InternetState {
  status: boolean,
  setStatus: (val: boolean) => void
}

const useInternetState = create<InternetState>((set) => ({
  status: false,
  setStatus: (val) => set({ status: val }),
}));

export default useInternetState