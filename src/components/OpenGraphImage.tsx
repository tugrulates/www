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
    <div tw="relative flex flex-row w-full h-full bg-black">
      <div tw="absolute inset-0 flex">
        <img
          src={background}
          width={DIMENSIONS.opengraph_wide_width}
          height={DIMENSIONS.opengraph_wide_height}
          style={{ objectFit: "cover", filter: "blur(20px) brightness(40%)" }}
        />
      </div>
      <div
        tw="flex-1 text-5xl px-16 py-24 flex flex-col items-center justify-between text-white"
        style={{ fontFamily: "Regular" }}
      >
        <div tw="p-2 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-200/50 flex items-center">
          <img src={avatar} tw={"w-24 h-24 rounded-full border border-black"} />
          <span tw="px-8">{SITE.domain}</span>
        </div>
        <h1 tw="m-0 text-center" style={{ fontFamily: "Bold" }}>
          {title}
        </h1>
        <div tw="text-center">{description}</div>
        <div tw="text-black px-16 py-8 rounded-2xl bg-indigo-200 shadow-lg shadow-indigo-900/50">
          {cta}
        </div>
      </div>
      <img
        src={background}
        width={DIMENSIONS.opengraph_wide_height}
        height={DIMENSIONS.opengraph_wide_height}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
