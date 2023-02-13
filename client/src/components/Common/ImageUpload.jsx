import React, { useCallback, useMemo, useRef } from "react";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { NotifyInfo } from "../../toastify";
const sideClasses =
  "h-14 w-14 cursor-pointer primary-self-text flex justify-center items-center overflow-hidden border-[#00684a60] ";

const ImageUpload = ({
  keyName = "someKeyId",
  onChangeImage,
  url,
  folder,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [progress, setProgress] = React.useState(0);
  const classes = useMemo(() => {
    if (sideClasses) {
      return sideClasses + " " + className;
    }
    return sideClasses;
  }, [className]);

  const onClickImage = useCallback(() => {
    inputRef?.current?.click();
  }, []);

  const onFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      let allowedExtensions = /(jpg|jpeg|png)$/i;
      const isValid = allowedExtensions.exec(file.type);
      if (!isValid) {
        NotifyInfo("Please upload image file (jpg or png)");
        e.target.value = null;
        return;
      }
      // check file size 300kb
      if (file.size > 300 * 1024) {
        NotifyInfo("Please upload image file less than 300kb");
        return;
      }
      const uploadTask = uploadBytesResumable(
        ref(storage, `${folder}/${file.name}`),
        file
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.floor(progress));
        },
        (error) => {
          e.target.value = null;
          setProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (onChangeImage) {
              onChangeImage(downloadURL);
            }
            e.target.value = null;
            setProgress(0);
          });
        }
      );
    },
    [onChangeImage]
  );

  return (
    <>
      <input
        ref={inputRef}
        id={keyName}
        className="hidden"
        type="file"
        onChange={onFileChange}
      />

      <div className={classes} onClick={onClickImage}>
        {progress !== 0 ? (
          <div
            className={
              url
                ? `flex justify-center items-center flex-col border-dashed border-2 border-[#00684a60] rounded-lg h-full w-full`
                : `flex justify-center items-center flex-col`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 100 100"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <span className="ml-2 text-xs">{progress}%</span>
          </div>
        ) : url ? (
          <img
            className={"object-cover h-14 w-14 "}
            src={url}
            alt="upload_image"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
