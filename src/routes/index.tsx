import {
  $,
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { VoteCard } from "~/components/vote/card";
import random from "random";
import _ from "lodash";
import { VotePodium, VotePodium2 } from "~/components/vote/podium";

const ORIGINAL_ARR = [...Array(11).keys()].map(
  (i) => i + 1,
) as ReadonlyArray<number>;

export default component$(() => {
  const imagePool = useSignal([...ORIGINAL_ARR]);
  const relations = useSignal<{ betterID: number; worseID: number }[]>([]);

  const scores = useComputed$(() => {
    const a = new Map<number, number>();

    for (const r of relations.value) {
      a.set(r.worseID, (a.get(r.worseID) || 0) - 1);
      a.set(r.betterID, (a.get(r.betterID) || 0) + 0.5);
    }

    return a;
  });

  const aID = useSignal<number>();
  const bID = useSignal<number>();

  const refreshImages = $(() => {
    if (imagePool.value.length <= 2) return;

    let aIdx: number,
      bIdx: number,
      c = 0;
    do {
      aIdx = random.int(0, imagePool.value.length - 1);
      bIdx = random.int(0, imagePool.value.length - 1);

      if (c++ > 5000) throw new Error("selection loop internal error");
    } while (aIdx === bIdx);

    aID.value = imagePool.value[aIdx];
    bID.value = imagePool.value[bIdx];
  });

  const resultTemporary = useSignal("graph TD;\n");

  const voteImage = $((voteID: number, nonVoteID: number) => {
    const voteIdx = imagePool.value.indexOf(voteID);
    const nonVoteIdx = imagePool.value.indexOf(nonVoteID);

    // Remove less liked photo
    imagePool.value = imagePool.value.filter((_, idx) => idx !== nonVoteIdx);

    // Save
    relations.value = relations.value.concat({
      betterID: voteID,
      worseID: nonVoteID,
    });

    // (async () => {
    //   const resJsonVoteID = await fetch(
    //     `https://loremflickr.com/json/g/320/240/food,dish/all?lock=${voteID}`,
    //   ).then((res) => res.json());
    //   const resJsonVoteID = await fetch(
    //     `https://loremflickr.com/json/g/320/240/food,dish/all?lock=${voteID}`,
    //   ).then((res) => res.json());

    //   const src = resJsonVoteID["rawFileUrl"];
    // resultTemporary.value =
    //   resultTemporary.value +
    //   `    ${voteID}[<img src="https://loremflickr.com/json/g/320/240/food,dish/all?lock=${voteID}" width='40' height='40' />] --> ${nonVoteID}[<img src="https://loremflickr.com/json/g/320/240/food,dish/all?lock=${voteID}" width='40' height='40' />]\n`;
    // })

    if (imagePool.value.length <= 2) return;
    refreshImages();
  });

  useTask$(() => {
    refreshImages();
  });

  return (
    <>
      <h1>Hi 👋</h1>
      <div class="ml-2 mt-4">
        <pre>
          {aID.value} vs {bID.value}
        </pre>

        {aID.value && bID.value && (
          <VoteCard
            aSrc={`/api/img/${aID.value}`}
            bSrc={`/api/img/${bID.value}`}
            onClick$={(v) =>
              voteImage(
                v === "a" ? aID.value! : bID.value!,
                v === "b" ? aID.value! : bID.value!,
              )
            }
          />
        )}

        <button
          onClick$={() => {
            imagePool.value = [...ORIGINAL_ARR];
            refreshImages();
          }}
        >
          Re vote
        </button>

        <VotePodium2 scores={scores.value} />

        <pre>{JSON.stringify(imagePool.value, null, 2)}</pre>

        <pre>{resultTemporary}</pre>

        <div>
          <VotePodium scores={scores.value} />
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
