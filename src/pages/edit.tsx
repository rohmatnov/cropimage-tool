import type { PageProps, HeadFC } from "gatsby";
import React, { FC, useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { navigate } from "gatsby";
import { db } from "../db";
import { Cropper, ReactCropperElement } from "react-cropper";
import { base64StringToBlob } from "blob-util";
import CropBox from "../components/edit/CropBoxGroup";
import ImageGroup from "../components/edit/ImageGroup";
import Toast, { notify } from "../components/Toast";

type Option = {
  left: number;
  top: number;
  height: number;
  width: number;
};

const EditPage: FC<PageProps> = () => {
  const allowedTypes = ["image/png", "image/jpeg"];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [src, setSrc] = useState<string>("");
  const [fileName, setFileName] = useState<string>("download.png");
  const [option, setOption] = useState<Option | null>(null);

  const [tab, setTab] = useState<string>("cropbox");

  const cropperRef = useRef<ReactCropperElement>(null);

  const uploadRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string>();
  const previewRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    setIsLoading(true);
    db.table("photos")
      .limit(1)
      .first()
      .then((row) => {
        const photo = row?.photo;
        const [type, base64] = photo.split(",");

        const img = base64StringToBlob(base64, type.split(";")[0]);
        const source = URL.createObjectURL(img);
        setSrc(source);
        setIsLoading(false);
        setFileName(row?.info?.name);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  useEffect(() => {
    previewRef.current?.click();
  }, [preview]);

  const onCrop = (e: any) => {
    let data = e.detail;

    setOption({
      left: Math.abs(Math.round(data.x)),
      top: Math.abs(Math.round(data.y)),
      height: Math.abs(Math.round(data.height)),
      width: Math.abs(Math.round(data.width)),
    });
  };

  const handleCropInput = (option: any) => {
    let data: any = {};
    let canvasData = cropperRef.current?.cropper.getCanvasData();
    let ratio = (canvasData?.width || 0) / (canvasData?.naturalWidth || 0);
    data[option.type] = option.number * ratio || 0;

    cropperRef.current?.cropper.setCropBoxData(data);
  };

  const upload = (files: any) => {
    if (files && files.length) {
      let file = files[0];

      if (!allowedTypes.includes(file.type)) {
        notify("Format file tidak didukung.");
        return;
      }

      let reader = new FileReader();

      reader.onload = (e) => {
        db.table("photos")
          .put({
            id: 1,
            photo: e.target?.result,
            info: { type: file.type, name: file.name },
          })
          .then((e) => {
            setIsLoading(true);
            db.table("photos")
              .limit(1)
              .first()
              .then((row) => {
                const photo = row?.photo;
                const [type, base64] = photo.split(",");

                const img = base64StringToBlob(base64, type.split(";")[0]);
                const source = URL.createObjectURL(img);
                setSrc(source);
                setIsLoading(false);
              })
              .catch(() => {
                navigate("/");
              });
          })
          .catch((e) => notify(`Failed: ${e.toString()}`));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e: any) => {
    let files = e.target.files;
    upload(files);
    e.target.value = "";
  };

  const handleCropAspectRatio = (aspectRatio: number) => {
    cropperRef.current?.cropper.setAspectRatio(aspectRatio);
  };

  const handleRotate = (num: number) => {
    cropperRef.current?.cropper.rotateTo(num);
  };

  const handleFlip = ({ type, num }: { type: string; num: number }) => {
    if (type == "x") {
      cropperRef.current?.cropper.scaleX(num);
      return;
    }

    cropperRef.current?.cropper.scaleY(num);
  };

  const save = () => {
    setPreview(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <main className="bg-slate-100 -mx-6">
          <div className="lg:flex lg:flex-wrap">
            <div className="flex-1 px-6 py-8 lg:max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="shadow-md shadow-slate-950/40 mx-auto max-w-3xl w-full">
                {src ? (
                  <Cropper
                    src={src}
                    className="shadow-md shadow-slate-950/40 mx-auto max-w-full"
                    crop={onCrop}
                    ref={cropperRef}
                    zoomOnWheel={false}
                    zoomOnTouch={false}
                    zoomable={false}
                    restore={true}
                    viewMode={0}
                    scaleX={1}
                    scaleY={1}
                    highlight={false}
                  />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
            <div className="lg:w-60 w-full bg-white border-l border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="lg:min-h-[calc(100vh-4rem)] flex flex-wrap flex-col justify-between">
                <div>
                  <div className="text-sm flex flex-wrap justify-between items-center px-1 border-b border-dashed border-slate-200 ">
                    <div className="flex-wrap flex px-1 -mx-1">
                      <div className="-mx-1 px-1">
                        <button
                          className={`px-3 py-2.5 ${
                            tab == "cropbox"
                              ? "font-semibold text-slate-950"
                              : "text-slate-600"
                          }`}
                          onClick={() =>
                            tab != "cropbox" ? setTab("cropbox") : null
                          }
                        >
                          Cropbox
                        </button>
                      </div>
                      <div className="-mx-1 px-1">
                        <button
                          className={`px-3 py-2.5 ${
                            tab == "image"
                              ? "font-semibold text-slate-950"
                              : "text-slate-600"
                          }`}
                          onClick={() =>
                            tab != "image" ? setTab("image") : null
                          }
                        >
                          Gambar
                        </button>
                      </div>
                    </div>

                    <div className="-mx-1 px-1 py-1 mr-2">
                      <button
                        className="w-8 h-7 flex flex-wrap items-center justify-center border border-slate-300 bg-white rounded-md relative group"
                        onClick={() => uploadRef.current?.click()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                        </svg>
                        <span className="absolute top-8 text-xs bg-slate-950 px-2 py-1 text-white rounded-lg after:content-[''] after:w-2 after:h-2 after:absolute after:-top-1 after:bg-slate-950 after:-translate-x-1/2 after:rotate-45 after:left-1/2 hidden group-hover:block">
                          Upload
                        </span>
                      </button>
                      <input
                        type="file"
                        ref={uploadRef}
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </div>
                  </div>

                  {tab == "cropbox" ? (
                    <div className="border-b">
                      <CropBox
                        option={option}
                        cropInput={handleCropInput}
                        cropAspectRatio={handleCropAspectRatio}
                      />
                    </div>
                  ) : null}

                  {tab == "image" ? (
                    <div className="border-b">
                      <ImageGroup rotate={handleRotate} flip={handleFlip} />
                    </div>
                  ) : null}
                </div>

                <div>
                  <a
                    href={preview}
                    download={fileName}
                    className="hidden"
                    ref={previewRef}
                  ></a>
                </div>

                <div className="p-4">
                  <button
                    className="bg-emerald-600 w-full py-2 text-white hover:bg-emerald-700 focus:outline-none active:ring active:ring-emerald-600/50"
                    onClick={save}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      <Toast />
    </Layout>
  );
};

export default EditPage;

export const Head: HeadFC = () => (
  <>
    <title>Image Editor</title>
    <body className="font-sans" />
  </>
);

const Loading = () => (
  <main className="flex flex-wrap items-center justify-center min-h-screen">
    <div className="text-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-12 w-12 text-emerald-500 inline-block mx-auto mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p>Memuat data...</p>
    </div>
  </main>
);
