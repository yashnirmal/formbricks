"use client";

import AdvancedSettings from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/AdvancedSettings";
import { getQuestionTypeName } from "@/lib/questions";
import { cn } from "@formbricks/lib/cn";
import { QuestionType } from "@formbricks/types/questions";
import { Input, Label, Switch } from "@formbricks/ui";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CursorArrowRippleIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
  QueueListIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import CTAQuestionForm from "./CTAQuestionForm";
import ConsentQuestionForm from "./ConsentQuestionForm";
import MultipleChoiceMultiForm from "./MultipleChoiceMultiForm";
import MultipleChoiceSingleForm from "./MultipleChoiceSingleForm";
import NPSQuestionForm from "./NPSQuestionForm";
import OpenQuestionForm from "./OpenQuestionForm";
import QuestionDropdown from "./QuestionMenu";
import RatingQuestionForm from "./RatingQuestionForm";
import { TSurveyWithAnalytics } from "@formbricks/types/v1/surveys";

interface QuestionCardProps {
  localSurvey: TSurveyWithAnalytics;
  questionIdx: number;
  moveQuestion: (questionIndex: number, up: boolean) => void;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  deleteQuestion: (questionIdx: number) => void;
  duplicateQuestion: (questionIdx: number) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  isFallBackSuggestionOpen: boolean;
  setIsFallBackSuggestionOpen: (isFallBackSuggestionOpen: boolean) => void;
  lastQuestion: boolean;
  isInValid: boolean;
}

export function BackButtonInput({
  value,
  onChange,
  className,
}: {
  value: string | undefined;
  onChange: (e: any) => void;
  className?: string;
}) {
  return (
    <div className="w-full">
      <Label htmlFor="backButtonLabel">&quot;Back&quot; Button Label</Label>
      <div className="mt-2">
        <Input
          id="backButtonLabel"
          name="backButtonLabel"
          value={value}
          placeholder="Back"
          onChange={onChange}
          className={className}
        />
      </div>
    </div>
  );
}

export default function QuestionCard({
  localSurvey,
  questionIdx,
  moveQuestion,
  updateQuestion,
  duplicateQuestion,
  deleteQuestion,
  activeQuestionId,
  setActiveQuestionId,
  isFallBackSuggestionOpen,
  setIsFallBackSuggestionOpen,
  lastQuestion,
  isInValid,
}: QuestionCardProps) {
  const question = localSurvey.questions[questionIdx];
  const open = activeQuestionId === question.id;
  const [openAdvanced, setOpenAdvanced] = useState(question.logic && question.logic.length > 0);

  return (
    <Draggable draggableId={question.id} index={questionIdx}>
      {(provided) => (
        <div
          className={cn(
            open ? "scale-100 shadow-lg" : "scale-97 shadow-md",
            "flex flex-row rounded-lg bg-white transition-all duration-300 ease-in-out"
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <div
            className={cn(
              open ? "bg-slate-700" : "bg-slate-400",
              "top-0 w-10 rounded-l-lg p-2 text-center text-sm text-white hover:bg-slate-600",
              isInValid && "bg-red-400  hover:bg-red-600"
            )}>
            {questionIdx + 1}
          </div>
          <Collapsible.Root
            open={open}
            onOpenChange={() => {
              if (activeQuestionId !== question.id) {
                setActiveQuestionId(question.id);
              } else {
                setActiveQuestionId(null);
              }
            }}
            className="flex-1 rounded-r-lg border border-slate-200">
            <Collapsible.CollapsibleTrigger
              asChild
              className={cn(open ? "" : "  ", "flex cursor-pointer justify-between p-4 hover:bg-slate-50")}>
              <div>
                <div className="inline-flex">
                  <div className="-ml-0.5 mr-3 h-6 w-6 text-slate-400">
                    {question.type === QuestionType.OpenText ? (
                      <ChatBubbleBottomCenterTextIcon />
                    ) : question.type === QuestionType.MultipleChoiceSingle ? (
                      <QueueListIcon />
                    ) : question.type === QuestionType.MultipleChoiceMulti ? (
                      <ListBulletIcon />
                    ) : question.type === QuestionType.NPS ? (
                      <PresentationChartBarIcon />
                    ) : question.type === QuestionType.CTA ? (
                      <CursorArrowRippleIcon />
                    ) : question.type === QuestionType.Rating ? (
                      <StarIcon />
                    ) : question.type === "consent" ? (
                      <CheckIcon />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {question.headline || getQuestionTypeName(question.type)}
                    </p>
                    {!open && question?.required && (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {question?.required && "Required"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <QuestionDropdown
                    questionIdx={questionIdx}
                    lastQuestion={lastQuestion}
                    duplicateQuestion={duplicateQuestion}
                    deleteQuestion={deleteQuestion}
                    moveQuestion={moveQuestion}
                  />
                </div>
              </div>
            </Collapsible.CollapsibleTrigger>
            <Collapsible.CollapsibleContent className="px-4 pb-4">
              {question.type === QuestionType.OpenText ? (
                <OpenQuestionForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isInValid={isInValid}
                  isFallBackSuggestionOpen={isFallBackSuggestionOpen}
                  setIsFallBackSuggestionOpen={setIsFallBackSuggestionOpen}
                />
              ) : question.type === QuestionType.MultipleChoiceSingle ? (
                <MultipleChoiceSingleForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isInValid={isInValid}
                />
              ) : question.type === QuestionType.MultipleChoiceMulti ? (
                <MultipleChoiceMultiForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isInValid={isInValid}
                />
              ) : question.type === QuestionType.NPS ? (
                <NPSQuestionForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isInValid={isInValid}
                />
              ) : question.type === QuestionType.CTA ? (
                <CTAQuestionForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isInValid={isInValid}
                />
              ) : question.type === QuestionType.Rating ? (
                <RatingQuestionForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isInValid={isInValid}
                />
              ) : question.type === "consent" ? (
                <ConsentQuestionForm
                  localSurvey={localSurvey}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  isInValid={isInValid}
                />
              ) : null}
              <div className="mt-4">
                <Collapsible.Root open={openAdvanced} onOpenChange={setOpenAdvanced} className="mt-5">
                  <Collapsible.CollapsibleTrigger className="flex items-center text-xs text-slate-700">
                    {openAdvanced ? (
                      <ChevronDownIcon className="mr-1 h-4 w-3" />
                    ) : (
                      <ChevronRightIcon className="mr-2 h-4 w-3" />
                    )}
                    {openAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
                  </Collapsible.CollapsibleTrigger>

                  <Collapsible.CollapsibleContent className="space-y-4">
                    {question.type !== QuestionType.NPS &&
                    question.type !== QuestionType.Rating &&
                    question.type !== QuestionType.CTA ? (
                      <div className="mt-4 flex space-x-2">
                        <div className="w-full">
                          <Label htmlFor="buttonLabel">Button Label</Label>
                          <div className="mt-2">
                            <Input
                              id="buttonLabel"
                              name="buttonLabel"
                              value={question.buttonLabel}
                              placeholder={lastQuestion ? "Finish" : "Next"}
                              onChange={(e) => updateQuestion(questionIdx, { buttonLabel: e.target.value })}
                            />
                          </div>
                        </div>
                        {questionIdx !== 0 && (
                          <BackButtonInput
                            value={question.backButtonLabel}
                            onChange={(e) => updateQuestion(questionIdx, { backButtonLabel: e.target.value })}
                          />
                        )}
                      </div>
                    ) : null}
                    {(question.type === QuestionType.Rating || question.type === QuestionType.NPS) &&
                      questionIdx !== 0 && (
                        <div className="mt-4">
                          <BackButtonInput
                            value={question.backButtonLabel}
                            onChange={(e) => updateQuestion(questionIdx, { backButtonLabel: e.target.value })}
                          />
                        </div>
                      )}

                    <AdvancedSettings
                      question={question}
                      questionIdx={questionIdx}
                      localSurvey={localSurvey}
                      updateQuestion={updateQuestion}
                    />
                  </Collapsible.CollapsibleContent>
                </Collapsible.Root>
              </div>
            </Collapsible.CollapsibleContent>

            {open && (
              <div className="mx-4 flex justify-end space-x-6 border-t border-slate-200">
                {question.type === "openText" && (
                  <div className="my-4 flex items-center justify-end space-x-2">
                    <Label htmlFor="longAnswer">Long Answer</Label>
                    <Switch
                      id="longAnswer"
                      checked={question.longAnswer !== false}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuestion(questionIdx, {
                          longAnswer:
                            typeof question.longAnswer === "undefined" ? false : !question.longAnswer,
                        });
                      }}
                    />
                  </div>
                )}
                <div className="my-4 flex items-center justify-end space-x-2">
                  <Label htmlFor="required-toggle">Required</Label>
                  <Switch
                    id="required-toggle"
                    checked={question.required}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuestion(questionIdx, { required: !question.required });
                    }}
                  />
                </div>
              </div>
            )}
          </Collapsible.Root>
        </div>
      )}
    </Draggable>
  );
}
