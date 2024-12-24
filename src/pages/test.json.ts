export const prerender = false;

interface Props {
  request: Request;
}

export const GET = ({ request }: Props): Response => {
  return new Response(JSON.stringify({
    test: "Hello, World!",
    url: request.url,
  }));
};
