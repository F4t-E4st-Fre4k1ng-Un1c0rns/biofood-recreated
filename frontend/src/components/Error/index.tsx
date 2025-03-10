const emojiDict = {
  403: "🤨",
  404: "🤔",
  500: "🥺",
};

const textDict = {
  403: "У вас нет сюда доступа",
  404: "Того, что вы пытаетесь открыть, не существует",
  500: "Что-то сломалось. Простите.",
};

interface Props {
  code: keyof typeof emojiDict;
}
function Error({ code }: Props) {
  return (
    <div>
      <p
        className="w-full text-center"
        style={{
          fontSize: "5rem",
        }}
      >
        {emojiDict[code]}
      </p>
      <p className="w-full text-center">{textDict[code]}</p>
    </div>
  );
}

export default Error;
