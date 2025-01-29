import { type RequestHandler } from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";

// export const onGet: RequestHandler = async ({
//   params,
//   getWritableStream,
//   headers,
// }) => {
//   const id = Number.parseInt(params["id"]);
//   const ws = getWritableStream();

//   const resJson = await fetch(
//     `https://loremflickr.com/json/g/320/240/food,dish,italian/all?lock=${id}`,
//   ).then((res) => res.json());

//   const res = await fetch(resJson["rawFileUrl"]);
//   res.headers.forEach((v, k) => headers.set(k, v));
//   await res.body!.pipeTo(ws);
// };

export const onGet: RequestHandler = async ({
  params,
  getWritableStream,
  headers,
}) => {
  const id = Number.parseInt(params["id"]);
  const ws = getWritableStream();
  const writer = ws.getWriter();

  headers.set("Content-Type", "image/png");
  headers.set("Cache-Control", "max-age=120");

  let f;
  try {
    f = await readFile("./politicians/" + id + ".png"); // !!! HIGHLY DANGER !!!
    await writer.write(f);
    await writer.close();
  } finally {
    // empty
  }
};
