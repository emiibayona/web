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

  return { uploadImage };
};

export default useFile;
