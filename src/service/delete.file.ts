import cloudinary from "../utils/cloudinary";
import { getPublicId } from "./getId.service";

export const deleteImage = async (imageurl: string) => {
  const public_id = getPublicId(imageurl);

  const result = await cloudinary.uploader.destroy(public_id, {
    invalidate: true,
  });

  return result;
};
