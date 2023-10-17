import FallBackQuestionSuggestion from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/FallBackQuestionsSuggestion";
import { TSurveyOpenTextQuestion, TSurveyWithAnalytics } from "@formbricks/types/v1/surveys";
import { Button, Input, Label } from "@formbricks/ui";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface OpenQuestionFormProps {
  localSurvey: TSurveyWithAnalytics;
  question: TSurveyOpenTextQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  lastQuestion: boolean;
  isInValid: boolean;
  isFallBackSuggestionOpen: boolean;
  setIsFallBackSuggestionOpen: (isFallBackSuggestionOpen: boolean) => void;
}

export default function OpenQuestionForm({
  localSurvey,
  question,
  questionIdx,
  updateQuestion,
  isInValid,
  isFallBackSuggestionOpen,
  setIsFallBackSuggestionOpen,
}: OpenQuestionFormProps): JSX.Element {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const [cursorPosition, setCursorPosition] = useState(0);

  return (
    <form>
      <div className="mt-3">
        <Label htmlFor="headline">Question</Label>
        <div className="mt-2">
          <Input
            autoFocus
            id="headline"
            name="headline"
            value={question.headline}
            onChange={(e) => {
              updateQuestion(questionIdx, { headline: e.target.value });
              setCursorPosition(e.target.selectionStart as number);
            }}
            onFocus={(e) => {
              setCursorPosition(e.target.selectionStart as number);
            }}
            isInvalid={isInValid && question.headline.trim() === ""}
          />
        </div>
        {isFallBackSuggestionOpen && (
          <FallBackQuestionSuggestion
            localSurvey={localSurvey}
            questionIdx={questionIdx}
            updateQuestion={updateQuestion}
            cursorPosition={cursorPosition}
            setIsFallBackSuggestionOpen={setIsFallBackSuggestionOpen}
          />
        )}
      </div>

      <div className="mt-3">
        {showSubheader && (
          <>
            <Label htmlFor="subheader">Description</Label>
            <div className="mt-2 inline-flex w-full items-center">
              <Input
                id="subheader"
                name="subheader"
                value={question.subheader}
                onChange={(e) => updateQuestion(questionIdx, { subheader: e.target.value })}
              />
              <TrashIcon
                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                onClick={() => {
                  setShowSubheader(false);
                  updateQuestion(questionIdx, { subheader: "" });
                }}
              />
            </div>
          </>
        )}
        {!showSubheader && (
          <Button size="sm" variant="minimal" type="button" onClick={() => setShowSubheader(true)}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>

      <div className="mt-3">
        <Label htmlFor="placeholder">Placeholder</Label>
        <div className="mt-2">
          <Input
            id="placeholder"
            name="placeholder"
            value={question.placeholder}
            onChange={(e) => updateQuestion(questionIdx, { placeholder: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
}
