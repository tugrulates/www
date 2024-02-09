/* eslint-disable react/no-unknown-property */

import { SITE } from "@/consts";

function OpenGraphImagePill({ avatar }: { avatar: string }): JSX.Element {
  return (
    <div tw="p-1 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-200/25 flex items-center">
      <img src={avatar} tw="w-12 h-12 rounded-full border-2 border-black" />
      <span tw="px-2">{SITE.domain}</span>
    </div>
  );
}

interface Props {
  avatar: string;
  background: string;
  title: string;
  cta: string;
  description?: string;
}

export function OpenGraphImageWide({
  avatar,
  background,
  title,
  cta,
  description,
}: Props): JSX.Element {
  return (
    <div
      tw="text-2xl relative flex flex-col w-full h-full px-32 py-16 items-center justify-between bg-black text-white"
      style={{ fontFamily: "Regular" }}
    >
      <div tw="absolute inset-0 flex ">
        <img
          src={background}
          width={1200}
          height={600}
          style={{ objectFit: "cover", filter: "blur(8px) brightness(40%)" }}
        />
      </div>
      <OpenGraphImagePill avatar={avatar} />
      <h1 tw="m-0" style={{ fontFamily: "Bold" }}>
        {title}
      </h1>
      {description !== undefined ? <div>{description}</div> : undefined}
      <div tw="px-8 py-4 rounded-2xl bg-indigo-800 shadow-lg shadow-indigo-900/25">
        {cta}
      </div>
    </div>
  );
}

export function OpenGraphImageSquare({
  avatar,
  background,
  title,
  cta,
}: Props): JSX.Element {
  return (
    <div
      tw="text-md relative flex flex-col w-full h-full p-8 items-center justify-between bg-black text-white"
      style={{ fontFamily: "Regular" }}
    >
      <div tw="absolute inset-0 flex">
        <img
          src={background}
          width={400}
          height={400}
          style={{ objectFit: "cover", filter: "blur(8px) brightness(40%)" }}
        />
      </div>
      <OpenGraphImagePill avatar={avatar} />
      <h1 tw="m-0 text-center" style={{ fontFamily: "Bold" }}>
        {title}
      </h1>
      <div tw="px-8 py-4 rounded-2xl bg-indigo-800 shadow-lg shadow-indigo-900/25">
        {cta}
      </div>
    </div>
  );
}
