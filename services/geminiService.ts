
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Quiz, Difficulty, Question, QuizQuestionTypePreference } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUIZ_SCHEMA = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionText: {
          type: Type.STRING,
          description: 'The text of the quiz question.'
        },
        questionType: {
          type: Type.STRING,
          description: "The type of question. Must be either 'multiple-choice' or 'short-answer'.",
          enum: ['multiple-choice', 'short-answer']
        },
        options: {
          type: Type.ARRAY,
          description: "An array of 4 strings representing the possible answers for a multiple-choice question. This should be omitted for 'short-answer' questions.",
          items: {
            type: Type.STRING
          }
        },
        correctAnswer: {
          type: Type.STRING,
          description: "The correct answer to the question. For multiple-choice, this must be one of the strings from the 'options' array."
        },
        difficulty: {
            type: Type.STRING,
            description: "The difficulty of the question.",
            enum: ['beginner', 'intermediate', 'advanced']
        }
      },
      required: ['questionText', 'questionType', 'correctAnswer', 'difficulty']
    }
};

export const generateQuiz = async (context: string, difficulty: Difficulty, numQuestions: number, questionTypePreference: QuizQuestionTypePreference): Promise<Quiz> => {
  
  let questionTypeInstruction = '';
  switch (questionTypePreference) {
    case 'multiple-choice':
      questionTypeInstruction = 'All questions must be multiple-choice. For multiple-choice questions, provide exactly 4 options.';
      break;
    case 'short-answer':
      questionTypeInstruction = 'All questions must be short-answer.';
      break;
    case 'mixed':
    default:
      questionTypeInstruction = 'Generate a mix of multiple-choice and short-answer questions. For multiple-choice questions, provide exactly 4 options.';
      break;
  }
  
  const prompt = `You are an expert educator. Based on the following document context, create a quiz with exactly ${numQuestions} questions.
  The questions should be tailored for a user with a '${difficulty}' skill level.
  ${questionTypeInstruction}
  Ensure the questions accurately reflect the provided context.

  Document Context:
  ---
  ${context.substring(0, 30000)}
  ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
      },
    });
    
    const jsonStr = response.text.trim();
    const quizData = JSON.parse(jsonStr);

    if (!Array.isArray(quizData)) {
        throw new Error("AI response is not a valid quiz array.");
    }

    // Ensure the generated quiz respects the question type preference
    const filteredQuiz = quizData.filter(q => {
        if (questionTypePreference === 'multiple-choice') return q.questionType === 'multiple-choice';
        if (questionTypePreference === 'short-answer') return q.questionType === 'short-answer';
        return true;
    });


    return filteredQuiz as Quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. The AI model may be temporarily unavailable or the document content could not be processed.");
  }
};

export const getExplanation = async (question: Question, documentContext: string): Promise<string> => {
    const prompt = `
    A student answered a quiz question and needs an explanation.
    
    Document Context (for reference):
    ---
    ${documentContext.substring(0, 10000)}
    ---

    Question: "${question.questionText}"
    Correct Answer: "${question.correctAnswer}"

    Please provide a concise and clear explanation for why the correct answer is "${question.correctAnswer}".
    Explain the underlying concept from the document. Do not just state the answer.
    Keep the explanation to 2-4 sentences.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting explanation:", error);
        throw new Error("Failed to get explanation from the AI model.");
    }
};

const EVALUATION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        isCorrect: {
            type: Type.BOOLEAN,
            description: 'True if the student\'s answer is conceptually correct, otherwise false.'
        }
    },
    required: ['isCorrect']
};

export const evaluateShortAnswer = async (question: Question, userAnswer: string): Promise<boolean> => {
    const prompt = `You are a teaching assistant grading a quiz. Determine if the student's answer is correct for the given question. The answer does not need to be a perfect match to the provided correct answer, but it must be conceptually and factually correct. Be lenient with phrasing.

Question: "${question.questionText}"
Provided Correct Answer for reference: "${question.correctAnswer}"
Student's Answer: "${userAnswer}"

Based on this, is the student's answer correct?
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: EVALUATION_SCHEMA,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });
        
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (typeof result.isCorrect !== 'boolean') {
            return userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        }

        return result.isCorrect;

    } catch (error) {
        console.error("Error evaluating short answer:", error);
        return userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    }
};

// --- Agent and Tool Calling ---

export const CREATE_QUIZ_TOOL: FunctionDeclaration = {
    name: 'createQuizOnTopic',
    description: 'Creates a quiz on a specified topic by first searching for information and then generating questions. Use this tool when a user asks to be quizzed on a subject.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            topic: { type: Type.STRING, description: 'The subject of the quiz, e.g., "Quantum Physics".' },
            difficulty: { type: Type.STRING, enum: ['beginner', 'intermediate', 'advanced'], description: 'The desired difficulty of the quiz.' },
            numQuestions: { type: Type.INTEGER, description: 'The number of questions for the quiz.' }
        },
        required: ['topic', 'difficulty', 'numQuestions']
    }
};


export const createQuizOnTopic = async (topic: string, difficulty: Difficulty, numQuestions: number): Promise<Quiz> => {
    console.log(`Creating quiz on topic: ${topic}`);
    const searchPrompt = `Provide a detailed overview of the topic: ${topic}. This information will be used to create a quiz, so be comprehensive and accurate.`;

    // 1. Use Google Search to get context on the topic
    const searchResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: searchPrompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    const context = searchResult.text;
    if (!context) {
        throw new Error(`Could not find any information on the topic: "${topic}".`);
    }

    // 2. Use the context to generate a quiz. Defaults to mixed for agent-generated quizzes for now.
    return generateQuiz(context, difficulty, numQuestions, 'mixed');
};