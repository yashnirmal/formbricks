import { TSurveyWithAnalytics } from "@formbricks/types/v1/surveys";
import { useState } from "react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "@formbricks/ui";
import { X } from "lucide-react";

interface FallBackQuestionsSuggestionProps {
  localSurvey: TSurveyWithAnalytics;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  cursorPosition: number;
  setIsFallBackSuggestionOpen: (isFallBackSuggestionOpen: boolean) => void;
}

export default function FallBackQuestionSuggestion({
  localSurvey,
  questionIdx,
  updateQuestion,
  cursorPosition,
  setIsFallBackSuggestionOpen,
}: FallBackQuestionsSuggestionProps): JSX.Element {
  const [isFallBackAnswerOpen, setIsFallBackAnswerOpen] = useState(false);
  const [fallbackAnswer, setFallbackAnswer] = useState("");

  function handleClick(id) {
    const headline = localSurvey.questions[questionIdx].headline;
    const temp =
      headline.slice(0, cursorPosition - 1) + "[recall:" + id + "]" + headline.slice(cursorPosition);
    updateQuestion(questionIdx, { headline: temp });
    setIsFallBackAnswerOpen(true);
  }

  console.log(localSurvey);

  function addFallBackAnswer() {
    const headline = localSurvey.questions[questionIdx].headline;

    const regex = /\[recall:([^\]]+)\]/;
    const match: RegExpExecArray | null = regex.exec(headline);
    const closingBracketIndex = headline.indexOf("]", match?.index);

    updateQuestion(questionIdx, {
      headline:
        headline.slice(0, closingBracketIndex) +
        "/fallback:" +
        fallbackAnswer +
        headline.slice(closingBracketIndex),
    });
    setIsFallBackSuggestionOpen(false);
  }

  return (
    <div className="absolute z-50 mr-4 flex w-full max-w-[400px] flex-col items-start rounded-sm bg-white shadow-lg">
      <div className="flex w-full items-center justify-between px-6 py-2">
        <p className="text-sm font-semibold text-slate-700">
          {!isFallBackAnswerOpen ? "Recall information from..." : "Add a fallback, if the data is missing"}
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFallBackSuggestionOpen(false);
            setIsFallBackAnswerOpen(false);
          }}>
          <X size={20} />
        </button>
      </div>

      {!isFallBackAnswerOpen ? (
        <>
          {localSurvey.questions?.slice(0, questionIdx).map((question) => (
            <button
              key={question.id}
              onClick={(e) => {
                e.preventDefault();
                handleClick(question.id);
              }}
              className="flex w-full items-center justify-start px-4 py-2 font-medium text-slate-700 last:mb-2 hover:bg-slate-100 hover:text-slate-800">
              <ChatBubbleBottomCenterTextIcon className="black ml-2 mr-6 h-5 w-5" aria-hidden="true" />
              {question.headline.length < 30 ? question.headline : question.headline.slice(0, 30) + "..."}
            </button>
          ))}
        </>
      ) : (
        <div className="flex w-full items-center gap-4">
          <div className="mx-6 my-2 flex w-full items-center justify-center gap-4">
            <Input
              className="w-full"
              value={fallbackAnswer}
              onChange={(e) => setFallbackAnswer(e.target.value)}
            />

            <Button className="bg-slate-700 hover:bg-slate-700" onClick={addFallBackAnswer}>
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
