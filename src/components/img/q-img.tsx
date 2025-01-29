import {
  component$,
  useSignal,
  useTask$,
  type PropsOf,
  isServer,
} from "@builder.io/qwik";

export type QImgProps = PropsOf<"img">;
export const QImg = component$<QImgProps>((p) => {
  const src = useSignal<QImgProps["src"]>();

  useTask$(({ track }) => {
    track(() => p.src);

    src.value = "";

    if (isServer) {
      src.value = p.src;
    } else {
      setTimeout(() => {
        src.value = p.src;
      }, 1);
    }
  });

  return <img {...p} src={src.value} />;
});
