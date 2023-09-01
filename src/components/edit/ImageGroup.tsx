import React, { useEffect, useRef, useState, forwardRef } from "react";

type Attributes = {
  rotate: any;
  flip: any;
};

export default ({ rotate, flip }: Attributes): JSX.Element => {
  const handleRotate = (num: number) => {
    rotate(num);
  };

  const handleFlip = (num: number) => {
    flip(num);
  };

  return (
    <>
      <div className="text-sm px-4 py-3">
        <div>
          <ImageRotate rotate={handleRotate} />
        </div>
        <div>
          <ImageFlip flip={handleFlip} />
        </div>
      </div>
    </>
  );
};

type ImageRotateType = { rotate: any };

const ImageRotate = ({ rotate }: ImageRotateType): JSX.Element => {
  const min: number = -180;
  const max: number = 180;

  const rangeRef = useRef<HTMLInputElement | null>(null);
  const numberRef = useRef<HTMLInputElement | null>(null);

  const handleRange = (e: any) => {
    const number = e.target.value;
    const value = number < min ? min : number > max ? max : number;

    rangeRef.current!.value = value;
    numberRef.current!.value = value;

    rotate(Number(value));
  };

  return (
    <div>
      <label htmlFor="" className="mb-2 block text-sm">
        Rotate
      </label>
      <div className="-mx-2 mb-4 flex flex-wrap -mt-3">
        <div className="relative flex flex-wrap justify-between px-2 text-sm w-full">
          <input
            type="range"
            className="mr-4 flex-1 w-24 border-none accent-emerald-600"
            min={min}
            max={max}
            defaultValue={0}
            onChange={handleRange}
            ref={rangeRef}
          />
          <div className="relative">
            <input
              type="number"
              className="appearance-number-none peer order-1 w-[72px] border border-transparent py-1.5 pl-2 pr-8 hover:border-slate-300 focus:border-emerald-600 focus:border-l-transparent focus:outline-1 focus:outline-emerald-600"
              defaultValue={0}
              min={min}
              max={max}
              ref={numberRef}
              onChange={handleRange}
            />
            <label className="inline-block absolute top-0 right-0 py-1.5 pr-2 text-xs">
              deg
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

type ImageFlipType = { flip: any };
const ImageFlip = ({ flip }: ImageFlipType): JSX.Element => {
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);

  const handleFlipVartical = (e: any) => {
    let num = scaleY * -1;
    setScaleY(num);

    flip({ type: "y", num });
  };

  const handleFlipHorizontal = (e: any) => {
    let num = scaleX * -1;
    setScaleX(num);

    flip({ type: "x", num });
  };

  return (
    <div>
      <label htmlFor="" className="mb-2 block text-sm">
        Flip
      </label>
      <div className="-mx-1 mb-4 flex flex-wrap">
        <div className="px-1">
          <button
            className="w-8 h-8 flex flex-wrap items-center justify-center border border-transparent hover:border-slate-300 active:border-transparent active:ring-2 active:ring-emerald-600 active:rounded-sm focus:outline-none"
            onClick={handleFlipHorizontal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-symmetry-vertical"
              viewBox="0 0 16 16"
            >
              <path d="M7 2.5a.5.5 0 0 0-.939-.24l-6 11A.5.5 0 0 0 .5 14h6a.5.5 0 0 0 .5-.5v-11zm2.376-.484a.5.5 0 0 1 .563.245l6 11A.5.5 0 0 1 15.5 14h-6a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .376-.484zM10 4.46V13h4.658L10 4.46z" />
            </svg>
          </button>
        </div>

        <div className="px-1">
          <button
            className="w-8 h-8 flex flex-wrap items-center justify-center border border-transparent hover:border-slate-300 active:border-transparent active:ring-2 active:ring-emerald-600 active:rounded-sm focus:outline-none"
            onClick={handleFlipVartical}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-symmetry-horizontal"
              viewBox="0 0 16 16"
            >
              <path d="M13.5 7a.5.5 0 0 0 .24-.939l-11-6A.5.5 0 0 0 2 .5v6a.5.5 0 0 0 .5.5h11zm.485 2.376a.5.5 0 0 1-.246.563l-11 6A.5.5 0 0 1 2 15.5v-6a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .485.376zM11.539 10H3v4.658L11.54 10z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
