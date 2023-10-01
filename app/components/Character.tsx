import { CharacterStatusEnum } from "../types/CharacterStatusEnum";

interface Props {
  character: string;
  character_status?: CharacterStatusEnum;
}

export default function Character({ character, character_status }: Props) {
  const getBackgroudColor = (character_status?: CharacterStatusEnum) => {
    switch (character_status) {
      case CharacterStatusEnum.CORRECT:
        return "bg-green-800";
      case CharacterStatusEnum.WRONG_PLACE:
        return "bg-orange-800";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div
      className={`h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 py-auto m-1 border-solid border-2 border-white-500 text-white text-xl sm:text-3xl flex items-center justify-center ${getBackgroudColor(
        character_status
      )}`}
    >
      <span className="inline-block align-middle">{character}</span>
    </div>
  );
}
