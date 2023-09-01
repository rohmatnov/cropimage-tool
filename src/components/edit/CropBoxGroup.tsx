import React, { useEffect, useRef, useState, forwardRef } from "react";

type Attributes = {
  option: any;
  cropInput: any;
  cropAspectRatio: any;
};

export default ({
  option,
  cropInput,
  cropAspectRatio,
}: Attributes): JSX.Element => {
  const aspectRatioList = [
    [
      { ratio: "Free", value: 0 },
      { ratio: "1:1", value: 1 / 1 },
      { ratio: "3:2", value: 3 / 2 },
      { ratio: "4:3", value: 4 / 3 },
      { ratio: "5:4", value: 5 / 4 },
      { ratio: "16:9", value: 16 / 9 },
    ],
    [
      { ratio: "Free", value: 0 },
      { ratio: "1:1", value: 1 / 1 },
      { ratio: "2:3", value: 2 / 3 },
      { ratio: "3:4", value: 3 / 4 },
      { ratio: "4:5", value: 4 / 5 },
      { ratio: "9:16", value: 9 / 16 },
    ],
  ];

  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  const [index, setIndex] = useState<number>(0);

  const handleOrientation = (val: string) => {
    let box = val == "landscape";
    if (box == isLandscape) return;

    let lists = aspectRatioList[+box];
    let aspect = lists[index].value;

    setIsLandscape(box);
    cropAspectRatio(aspect == 0 ? NaN : aspect);
  };

  const handleAspectRatio = (aspect: number, index: number) => {
    cropAspectRatio(aspect == 0 ? NaN : aspect);
    setIndex(index);
  };

  const onValues = (e: any) => {
    cropInput(e);
  };

  return (
    <>
      <div className="text-sm px-4">
        <div className="-mx-4 px-4 py-2 border-b border-dashed border-slate-200 flex flex-wrap justify-between items-center">
          <div className="w-1/2">
            <CropBoxOrientation
              orientation={handleOrientation}
              isLandscape={isLandscape}
            />
          </div>
          <div className="w-1/2">
            <CropBoxAspectRatio
              rows={aspectRatioList[+isLandscape]}
              aspectRatio={handleAspectRatio}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between -mx-2 my-3">
          <div className="px-2 w-1/2">
            <CropBoxInput
              currentValue={option?.width}
              memo={onValues}
              type="width"
              caption="W"
            />
          </div>
          <div className="px-2 w-1/2">
            <CropBoxInput
              currentValue={option?.height}
              memo={onValues}
              type="height"
              caption="H"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between -mx-2 my-3">
          <div className="px-2 w-1/2">
            <CropBoxInput
              currentValue={option?.left}
              memo={onValues}
              type="left"
              caption="X"
            />
          </div>
          <div className="px-2 w-1/2">
            <CropBoxInput
              currentValue={option?.top}
              memo={onValues}
              type="top"
              caption="Y"
            />
          </div>
        </div>
      </div>
    </>
  );
};

type InputType = {
  currentValue?: number;
  type?: string;
  caption?: string;
  memo: any;
};

const CropBoxInput = ({
  currentValue,
  type,
  caption,
  memo,
}: InputType): JSX.Element => {
  const targetRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    targetRef.current!.value = currentValue?.toString() || "0";
  }, [currentValue]);

  const handleChange = (e: any) => {
    memo({ type, number: parseInt(e.target.value) });
  };

  return (
    <div className="relative">
      <input
        type="number"
        defaultValue={currentValue}
        onChange={handleChange}
        ref={targetRef}
        className="appearance-number-none peer order-1 w-24 border border-transparent py-1.5 pl-8 pr-0 hover:border-slate-300 hover:transition hover:duration-200 focus:border-emerald-600 focus:border-l-transparent focus:outline-1 focus:outline-emerald-600"
        id={`cropbox-${type}`}
      />
      <label
        className="pointer-events-none absolute left-2 top-px block px-1 py-1.5"
        htmlFor={`cropbox-${type}`}
      >
        {caption}
      </label>
    </div>
  );
};

type OrientationType = {
  orientation: any;
  isLandscape: boolean;
};

const CropBoxOrientation = ({
  orientation,
  isLandscape,
}: OrientationType): JSX.Element => {
  const handleClick = (e: any) => {
    let dataset = e.target.dataset;
    orientation(dataset.orientation);
  };
  return (
    <div className="flex flex-wrap">
      <button
        className={`h-8 w-8 flex flex-wrap items-center justify-center mr-1 ${
          !isLandscape ? "bg-slate-100" : null
        }`}
        onClick={handleClick}
        data-orientation="potrait"
      >
        <svg
          className="svg pointer-events-none"
          width="8"
          height="14"
          viewBox="0 0 8 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1H1v12h6V1zM1 0H0v14h8V0H1z"
            fillRule="evenodd"
            fillOpacity="1"
            fill="#000"
            stroke="none"
          ></path>
        </svg>
      </button>
      <button
        className={`h-8 w-8 flex flex-wrap items-center justify-center mr-1 ${
          isLandscape ? "bg-slate-100" : null
        }`}
        onClick={handleClick}
        data-orientation="landscape"
      >
        <svg
          className="svg pointer-events-none"
          width="14"
          height="8"
          viewBox="0 0 14 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1v6h12V1H1zM0 7v1h14V0H0v7z"
            fillRule="evenodd"
            fillOpacity="1"
            fill="#000"
            stroke="none"
          ></path>
        </svg>
      </button>
    </div>
  );
};

type AspectRatioType = {
  rows: Array<any>;
  aspectRatio: any;
};
const CropBoxAspectRatio = ({
  rows,
  aspectRatio,
}: AspectRatioType): JSX.Element => {
  const aspectRatioRef = useRef<HTMLSelectElement | null>(null);

  const handleAspectRatio = (e: any) => {
    let index = Number(e.target.value);
    let aspect = rows[index].value;

    aspectRatio(aspect, index);
  };

  return (
    <select
      className="appearance-none peer order-1 w-24 border border-transparent py-1.5 px-2 hover:border-slate-300 hover:transition hover:duration-200 focus:border-emerald-600 focus:outline-1 focus:outline-emerald-600 bg-white"
      ref={aspectRatioRef}
      onChange={handleAspectRatio}
    >
      {rows.map((row: any, key: any) => (
        <option value={key} key={key}>
          {row.ratio}
        </option>
      ))}
    </select>
  );
};
