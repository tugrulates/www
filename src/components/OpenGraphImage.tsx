/* eslint-disable react/no-unknown-property */

import { DIMENSIONS, SITE } from "@/consts";

function OpenGraphImageContainer({
  children,
  tw,
}: {
  children: React.ReactNode;
  tw: string;
}): JSX.Element {
  return (
    <div
      tw={`${tw} relative flex flex-col w-full h-full items-center justify-between bg-black text-white`}
      style={{ fontFamily: "Regular" }}
    >
      {children}
    </div>
  );
}

function OpenGraphImagePill({ avatar }: { avatar: string }): JSX.Element {
  return (
    <div tw="p-2 rounded-full text-black bg-stone-200 shadow-xl shadow-stone-200/50 flex items-center">
      <img src={avatar} tw="w-24 h-24 rounded-full border border-black" />
      <span tw="px-4">{SITE.domain}</span>
    </div>
  );
}

function OpenGraphImageTitle({ title }: { title: string }): JSX.Element {
  return (
    <h1 tw="m-0 text-center" style={{ fontFamily: "Bold" }}>
      {title}
    </h1>
  );
}

function OpenGraphImageBackground({
  background,
  width,
  height,
}: {
  background: string;
  width: number;
  height: number;
}): JSX.Element {
  return (
    <div tw="absolute inset-0 flex">
      <img
        src={background}
        width={width}
        height={height}
        style={{ objectFit: "cover", filter: "blur(8px) brightness(40%)" }}
      />
    </div>
  );
}

function OpenGraphCtaPill({ cta }: { cta: string }): JSX.Element {
  return (
    <div tw="px-16 py-8 rounded-3xl bg-indigo-800 shadow-xl shadow-indigo-900/50">
      {cta}
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
    <OpenGraphImageContainer tw="text-6xl px-64 py-32">
      <OpenGraphImageBackground
        background={background}
        width={DIMENSIONS.opengraph_wide_width}
        height={DIMENSIONS.opengraph_wide_height}
      />
      <OpenGraphImagePill avatar={avatar} />
      <OpenGraphImageTitle title={title} />
      {description !== undefined ? <div>{description}</div> : undefined}
      <OpenGraphCtaPill cta={cta} />
    </OpenGraphImageContainer>
  );
}

export function OpenGraphImageSquare({
  avatar,
  background,
  title,
  cta,
}: Props): JSX.Element {
  return (
    <OpenGraphImageContainer tw="text-4xl p-16">
      <OpenGraphImageBackground
        background={background}
        width={DIMENSIONS.opengraph_square_size}
        height={DIMENSIONS.opengraph_square_size}
      />
      <OpenGraphImagePill avatar={avatar} />
      <OpenGraphImageTitle title={title} />
      <OpenGraphCtaPill cta={cta} />
    </OpenGraphImageContainer>
  );
}
