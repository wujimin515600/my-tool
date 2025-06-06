import { create, type StateCreator } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';

interface MapItem {
    type: string;
    features: unknown;
}
export interface MapState {
    map: MapItem | null;
    setMap: (map: MapItem) => void;
    getData: () => void;
}

type MapStatePersist = (config: StateCreator<MapState>, options: PersistOptions<MapState>) => StateCreator<MapState>;

export const useMapStore = create<MapState>()(
  persist<MapState, [], [], MapStatePersist>(
    (set) => ({
        map: null,
        setMap: (map: MapItem) => set({ map }),
        getData: () => {
            fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json').then(res => res.json()).then(data => {
                console.log(data);
                set({ map: data });
            }).catch(err => {
                console.error('获取地图数据失败', err);
            })
        },
    }),
    { name: 'mapStore' } // 持久化存储
  )
);

// export const usePreviewStore = create(
//   persist(
//     (set) => ({
//       previewImage: '',
//       setPreviewImage: (image: string = '') => {
//         set({ previewImage: image });
//       }
//     }),
//     { name: 'previewStore' } // 持久化存储
//   )
// );

// export const useMapStore = create<MapStore>(persist((set) => ({}), { name: 'mapStore' });