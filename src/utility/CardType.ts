import { VotingTypes } from "interfaces/Room/VotingTypes";

export default function CardType(votingType: VotingTypes): (number | string)[] {
  switch (votingType) {
    case VotingTypes.Fibonnacci:
      return [0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    case VotingTypes.Random:
      return [0, 4];
  }
}
