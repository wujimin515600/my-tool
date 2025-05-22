import { create } from 'zustand';

export interface TextStore {
  text: string;
  loading: boolean;
//   setText: (text: string) => void;
//   setLoading: (loading: boolean) => void;
}

export const useTextStore = create<TextStore>(() => ({
  text: '',
  loading: false,
    // setText: (text: string) => set(() => ({ text })),
    // setLoading: (loading: boolean) => set(() => ({ loading })),
}))

export const setText = (text: string) => {
  useTextStore.setState({text})
}

export const setLoading = (loading: boolean) => {
  useTextStore.setState({loading})
}