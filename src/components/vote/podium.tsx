import { component$, useComputed$, useVisibleTask$ } from "@builder.io/qwik";
import _ from "lodash";

export interface VotePodiumProps {
  scores: Map<number, number>;
}
export const VotePodium = component$<VotePodiumProps>(({ scores }) => {
  const scoresUniq = _(Array.from(scores.values()))
    .uniq()
    .sortBy()
    .reverse()
    .value();

  return (
    <table>
      <tbody>
        {scoresUniq.map((score) => (
          <tr class="my-1" key={score}>
            <td>{score}</td>
            <td>
              {Array.from(scores.entries())
                .filter(([voteID, voteScore]) => voteScore === score)
                .map(([voteID]) => (
                  <img
                    key={voteID}
                    src={`/api/img/${voteID}`}
                    width="40"
                    height="40"
                  />
                ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export const VotePodium2 = component$<VotePodiumProps>(({ scores }) => {
  const scoresGrouped = useComputed$(() =>
    _(Array.from(scores.entries()))
      .map(([id, score]) => ({ id, score }))
      .groupBy((v) => v.score)
      .value(),
  );
  const uniqueScores = useComputed$(() =>
    _(scoresGrouped.value)
      .keys()
      .map((v) => _.toNumber(v))
      .sortBy()
      .reverse()
      .value(),
  );

  useVisibleTask$(({ track }) => {
    track(() => scoresGrouped.value);
    track(() => uniqueScores.value);

    console.log("scores grouped", scoresGrouped.value);
    console.log("unique", uniqueScores.value);
  });

  const first = scoresGrouped.value[uniqueScores.value[0]];
  const second = scoresGrouped.value[uniqueScores.value[1]];
  const third = scoresGrouped.value[uniqueScores.value[2]];

  // return <pre>{JSON.stringify(scoresGrouped.value, null, 2)}</pre>;

  return (
    <div className="flex h-96 items-end justify-center space-x-4">
      {/* 2nd Place */}
      <div className="flex flex-col items-center">
        <div className="relative flex h-40 w-20 items-end justify-center rounded-t-lg bg-gray-400">
          {/* Stacked Images */}
          <div className="absolute -top-20 flex flex-col items-center space-y-2">
            {second?.map((v) => (
              <img
                src={`/api/img/${v.id}`} // Replace with your image URL
                alt={v.id}
                className="h-12 w-12 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="mb-4 text-2xl font-bold text-white">2</span>
        </div>
        <span className="mt-2 text-lg font-semibold">2nd Place</span>
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center">
        <div className="relative flex h-56 w-20 items-end justify-center rounded-t-lg bg-yellow-400">
          {/* Stacked Images */}
          <div className="absolute -top-20 flex flex-col items-center space-y-2">
            {first?.map((v) => (
              <img
                src={`/api/img/${v.id}`} // Replace with your image URL
                alt={v.id}
                className="h-12 w-12 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="mb-4 text-2xl font-bold text-white">1</span>
        </div>
        <span className="mt-2 text-lg font-semibold">1st Place</span>
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center">
        <div className="relative flex h-32 w-20 items-end justify-center rounded-t-lg bg-orange-600">
          {/* Stacked Images */}
          <div className="absolute -top-20 flex flex-col items-center space-y-2">
            {third?.map((v) => (
              <img
                src={`/api/img/${v.id}`} // Replace with your image URL
                alt={v.id}
                className="h-12 w-12 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="mb-4 text-2xl font-bold text-white">3</span>
        </div>
        <span className="mt-2 text-lg font-semibold">3rd Place</span>
      </div>
    </div>
  );
});
