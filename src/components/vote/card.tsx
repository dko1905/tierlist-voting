import { component$, type QRL } from "@builder.io/qwik";
import { QImg } from "../img/q-img";

export interface CardProps {
  onClick$: QRL<(v: "a" | "b") => void>;
  aSrc: string;
  bSrc: string;
}
export const VoteCard = component$<CardProps>(({ aSrc, bSrc, onClick$ }) => {
  return (
    <div class="flex">
      <QImg
        class="drag-none h-[200px] w-[200px] border-4 border-white hover:border-cyan-200 active:border-cyan-400"
        draggable={false}
        height={200}
        width={200}
        src={aSrc}
        alt=""
        onClick$={() => onClick$("a")}
      />
      <QImg
        class="drag-none h-[200px] w-[200px] border-4 border-white hover:border-cyan-200 active:border-cyan-400"
        draggable={false}
        height={200}
        width={200}
        src={bSrc}
        alt=""
        onClick$={() => onClick$("b")}
      />
    </div>
  );
});
