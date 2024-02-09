/* eslint-disable react/no-unknown-property */
import { SITE } from "@/consts";

interface Props {
  background: string;
  title: string;
  description: string;
  cta: string;
}

export default function OpenGraphImage(props: Props): JSX.Element {
  return (
    <div
      tw="text-2xl relative flex flex-col w-full h-full px-32 py-16 gap-16 items-center justify-between bg-black text-white"
      style={{ fontFamily: "Fira Sans" }}
    >
      <div tw="absolute inset-0 flex object-cover opacity-25">
        <img src={props.background} />
      </div>
      <div tw="px-4 py-2 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-200/25 ">
        {SITE.domain}
      </div>
      <h1 tw="m-0" style={{ fontFamily: "Fira Sans Bold" }}>
        {props.title}
      </h1>
      <div>{props.description}</div>
      <div tw="px-8 py-4 rounded-2xl bg-indigo-800 shadow-lg shadow-indigo-900/25">
        {props.cta}
      </div>
    </div>
  );
}
