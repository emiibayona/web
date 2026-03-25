import FileService from "@/services/FileService";

const useFile = () => {
  async function uploadImage(image) {
    try {
      const { url } = await FileService.uploadImage(image);
      return url;
    } catch (error) {
      console.error(error);
    }
  }

  async function getCardsImage(params) {
    try {
      return await FileService.getCardsImage(params);
    } catch (error) {
      console.error(error);
    }
  }
  return { uploadImage, getCardsImage };
};

export default useFile;
