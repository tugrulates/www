/* eslint-disable react/no-unknown-property */
import { SITE } from "@/consts";

interface Props {
  avatar: string;
  background: string;
  title: string;
  description: string;
  cta: string;
}

export default function OpenGraphImage(props: Props): JSX.Element {
  return (
    <div
      tw="text-2xl relative flex flex-col w-full h-full px-32 py-16 items-center justify-between bg-black text-white"
      style={{ fontFamily: "Regular" }}
    >
      <div tw="absolute inset-0 flex object-cover opacity-25">
        <img src={props.background} />
      </div>
      <div
        tw="absolute bg-red-500"
        style={{ width: "1200px", height: "400px", top: "45px" }}
      ></div>
      <div tw="p-1 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-200/25 flex items-center">
        <img
          src={props.avatar}
          tw="w-12 h-12 rounded-full border-2 border-black"
        />
        <span tw="px-2">{SITE.domain}</span>
      </div>
      <h1 tw="m-0" style={{ fontFamily: "Bold" }}>
        {props.title}
      </h1>
      <div>{props.description}</div>
      <div tw="px-8 py-4 rounded-2xl bg-indigo-800 shadow-lg shadow-indigo-900/25">
        {props.cta}
      </div>
    </div>
  );
}
