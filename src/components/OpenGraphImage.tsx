import { DIMENSIONS, SITE } from "~/config.ts";

interface Props {
  avatar: string;
  background: string;
  title: string;
  cta: string;
  subtitle?: string;
  description?: string;
}

export function OpenGraphImage({
  avatar,
  background,
  title,
  cta,
  subtitle,
  description,
}: Props): React.JSX.Element {
  const cardSize = DIMENSIONS.opengraph.height - 80;
  return (
    <div
      tw="relative flex flex-row w-full h-full bg-black justify-center items-center"
      style={{ fontFamily: "Regular" }}
    >
      <div tw="absolute inset-0 flex">
        <img
          alt="Discarded JSX element"
          src={background}
          width={DIMENSIONS.opengraph.width}
          height={DIMENSIONS.opengraph.height}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        tw="relative flex flex-1 flex-col p-8 items-center justify-between text-2xl text-white"
        style={{ height: cardSize, maxWidth: cardSize }}
      >
        <div
          tw="absolute inset-0 shadow-md shadow-stone-900/80 bg-stone-800/90"
          style={{ borderRadius: "5%" }}
        />
        <div tw="p-1 rounded-full text-black bg-stone-200 shadow-md shadow-stone-900/80 flex items-center">
          <img
            alt="Discarded JSX element"
            src={avatar}
            width={48}
            height={48}
            tw={"rounded-full border border-black"}
          />
          <span tw="px-4">{SITE.url.host}</span>
        </div>
        <div tw="flex flex-col items-center">
          <h1 tw="m-4" style={{ fontFamily: "Bold" }}>
            {title}
          </h1>
          {subtitle && (
            <h2 tw="m-4">
              <em>{subtitle}</em>
            </h2>
          )}
        </div>
        <div tw="text-stone-300 text-center">{description}</div>
        <div tw="px-8 py-4 rounded-2xl bg-indigo-500 shadow-md shadow-indigo-900/80 flex justify-center">
          {cta}
        </div>
      </div>
    </div>
  );
}
