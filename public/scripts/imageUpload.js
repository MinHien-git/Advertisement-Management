let files = [];

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const uploadImage = async (event) => {
  const file = event.target.files;
  files = [];
  for (let i = 0; i < 2; ++i) {
    const base64 = await convertBase64(file[i]);
    files.push(base64);
  }
  console.log(files);
};
