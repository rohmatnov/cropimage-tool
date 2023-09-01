import React, { FC, useRef, useState } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";
import Toast, { notify } from "../components/Toast";
import { db } from "../db";

const IndexPage: FC<PageProps> = () => {
  const allowedTypes = ["image/png", "image/jpeg"];
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const browse = () => {
    fileRef?.current?.click();
  };

  const onDragEnter = (e: any) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };

  const onDragLeave = (e: any) => {
    e.preventDefault();
    setIsDrag(false);
  };

  const onDrop = (e: any) => {
    e.preventDefault();
    setIsDrag(false);

    let files = e.dataTransfer.files;
    upload(files);
  };

  const onChangeFile = (e: any) => {
    let files = e.target.files;
    upload(files);
    e.target.value = "";
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
          .then(() => navigate("/edit"))
          .catch((e) => notify(`Failed: ${e.toString()}`));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <main className="bg-slate-100 -mx-6">
        <div
          className="px-6 py-8 flex justify-center items-center text-center min-h-[calc(100vh-4rem)]"
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="pointer-events-none max-w-sm w-full">
            <div className="mb-2">
              <h1 className="text-3xl font-semibold">
                <span className="text-slate-950">Pixel</span>
                <span className="text-emerald-600">image</span>
              </h1>
              <p className="text-lg mb-1">Crop gambar sederhana</p>
            </div>
            <button
              className="my-4 border-2 border-slate-400 border-dashed w-full rounded-lg py-6 focus:outline-none bg-transparent group hover:border-emerald-600 duration-200 transition-colors"
              onClick={browse}
            >
              <span
                className={`px-4 py-1.5 bg-slate-300 text-slate-700 group-hover:text-white font-medium rounded-full text-sm group-hover:bg-slate-950 active:ring active:ring-emerald-200 duration-200 transition-colors inline-block ${
                  isDrag ? "pointer-events-none" : "pointer-events-auto"
                }`}
                onDragEnter={onDragEnter}
              >
                Pilih gambar
              </span>
              <p className="text-sm text-slate-600 mt-3">
                File berupa .jpg atau .png
              </p>
            </button>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              ref={fileRef}
              className="hidden"
              onChange={onChangeFile}
            />
          </div>
        </div>
      </main>
      <Toast />
      {isDrag ? <DragOverlay /> : null}
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>Image Editor</title>
    <body className="font-sans" />
  </>
);

const DragOverlay = () => (
  <div className="fixed bg-white/80 backdrop-blur top-0 left-0 bottom-0 right-0 flex justify-center items-stretch w-full text-slate-900 pointer-events-none z-20 p-8">
    <div className="text-3xl bg-transparent w-full flex items-center justify-center border-2 border-dashed border-emerald-600 rounded-lg text-emerald-600">
      Drop gambar kesini!
    </div>
  </div>
);
