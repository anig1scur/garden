import axios from 'axios';
import { BoxItem } from '@/common/types';

export const fetchGarden = async (
  id: string,
  setBoxes: React.Dispatch<React.SetStateAction<BoxItem[]>>,
  setGardenId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.get<{ boxes: BoxItem[] }>(`https://api.piggy.lol/gardens/${ id }`);
    setBoxes(response.data.boxes);
    setGardenId(id);
  } catch (error) {
    console.error('Failed to fetch garden:', error);
  }
};

export const saveGarden = async (gardenId: string | null, boxes: BoxItem[]): Promise<string | null> => {
  try {
    if (gardenId) {
      await axios.put(`https://api.piggy.lol/gardens/${ gardenId }`, { boxes });
      return gardenId;
    } else {
      const response = await axios.post<{ id: string }>('https://api.piggy.lol/gardens', { boxes });
      return response.data.id;
    }
  } catch (error) {
    console.error('Failed to save garden:', error);
    return null;
  }
};
