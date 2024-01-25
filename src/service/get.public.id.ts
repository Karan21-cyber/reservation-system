export const getPublicId = (imageurl: string) => {
  const imageSplit = imageurl.split("/");
  const publicId = imageSplit[imageSplit.length - 1].split(".")[0];
  return publicId;
};
