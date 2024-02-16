/* eslint-disable react/no-unknown-property */

import { DIMENSIONS, SITE } from "@/config";

interface Props {
  avatar: string;
  background: string;
  title: string;
  subtitle?: string;
  cta: string;
  description?: string;
}

export function OpenGraphImage({
  avatar,
  background,
  title,
  subtitle,
  cta,
  description,
}: Props): JSX.Element {
  const cardSize = DIMENSIONS.opengraph_source_height - 200;
  return (
    <div
      tw="relative flex flex-row w-full h-full bg-black justify-center items-center"
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
        style={{ height: cardSize, maxWidth: cardSize }}
      >
        <div
          tw="absolute inset-0 shadow-lg shadow-stone-900/80 bg-stone-800/90"
          style={{ borderRadius: "5%" }}
        />
        <div tw="p-2 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-900/80 flex items-center">
          <img src={avatar} tw={"w-24 h-24 rounded-full border border-black"} />
          <span tw="px-8">{SITE.domain}</span>
        </div>
        <div tw="flex flex-col items-center">
          <h1 tw="m-8" style={{ fontFamily: "Bold" }}>
            {title}
          </h1>
          {subtitle !== undefined ? (
            <h2 tw="m-8">
              <em>{subtitle}</em>
            </h2>
          ) : undefined}
        </div>
        <div tw="text-stone-300 text-center">{description}</div>
        <div tw="px-16 py-8 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-900/80 flex justify-center">
          {cta}
        </div>
      </div>
    </div>
  );
}
