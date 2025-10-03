import { create } from 'zustand'

// Only allow these three values
type TagType = "video" | "picture" | "design"

interface CounterState {
  tag: TagType
  setTag: (tag: TagType) => void
}

const useStore = create<CounterState>((set) => ({
  tag: "video", // default value
  setTag: (tag) => set({ tag }),
}))

export default useStore
