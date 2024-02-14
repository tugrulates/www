/* eslint-disable react/no-unknown-property */

import { DIMENSIONS, SITE } from "@/consts";

interface Props {
  avatar: string;
  background: string;
  title: string;
  cta: string;
  description?: string;
}

export function OpenGraphImage({
  avatar,
  background,
  title,
  cta,
  description,
}: Props): JSX.Element {
  return (
    <div
      tw="relative flex flex-row p-16 w-full h-full bg-black justify-center"
      style={{ fontFamily: "Regular" }}
    >
      <div tw="absolute inset-0 flex">
        <img
          src={background}
          width={DIMENSIONS.opengraph_source_width}
          height={DIMENSIONS.opengraph_source_height}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        tw="relative flex flex-1 flex-col p-16 items-center justify-between text-5xl text-white"
        style={{ maxWidth: DIMENSIONS.opengraph_source_height - 128 }}
      >
        <div
          tw="absolute inset-0 shadow-lg shadow-stone-900/80 bg-stone-800/90"
          style={{ borderRadius: "5%" }}
        />
        <div tw="p-2 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-900/80 flex items-center">
          <img src={avatar} tw={"w-24 h-24 rounded-full border border-black"} />
          <span tw="px-8">{SITE.domain}</span>
        </div>
        <h1 tw="m-0 text-center" style={{ fontFamily: "Bold" }}>
          {title}
        </h1>
        <div tw="text-stone-300 text-center">{description}</div>
        <div tw="px-16 py-8 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-900/80 flex justify-center">
          {cta}
        </div>
      </div>
    </div>
  );
}
