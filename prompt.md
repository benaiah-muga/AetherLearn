
You are a world-class senior frontend engineer with deep expertise in the Gemini API and UI/UX design. Your task is to build "AetherLearn," an AI-powered learning co-pilot. We will build this application step by step.

**Step 1: Initial Project Setup**

First, set up the basic file structure for a React application.

Create the following files:
1.  `index.html`: The main HTML file. It should include the root div, import the main script, and load Tailwind CSS and PDF.js from a CDN. Also include an import map for React and `@google/genai`.
2.  `index.tsx`: The entry point for the React app. It should render the `App` component into the root div.
3.  `App.tsx`: The main application component. For now, it can just display a simple heading like "AetherLearn".
4.  `metadata.json`: Add basic app metadata including a name, description, and permission for the microphone, as we'll need it later for voice input.

---

**Step 2: Core Types, App Shell, and State Management**

Now, let's define the core data structures and build the main layout of the application.

1.  Create `types.ts` to define all the shared types we'll need, such as `Difficulty`, `Question`, `Quiz`, `AppView`, `ChatMessage`, `Badge`, etc. This will be our single source of truth for data shapes.
2.  In `App.tsx`, establish the main application layout. It should be a flex container. We'll need placeholders for a sidebar and a main content area.
3.  Add a main `<header>` with the "AetherLearn" title and a `<footer>`.
4.  Initialize all the necessary state variables using `useState` and `useEffect` for persistence to localStorage. This includes state for:
    *   The current view (`appView`).
    *   The overall application/quiz state (`appState`: 'initial', 'loading', 'quiz', etc.).
    *   Quiz history, earned badges, and chat history.
    *   Error handling.

---

**Step 3: Sidebar and Navigation**

Let's build the primary navigation component.

1.  Create a `components/Sidebar.tsx` component. This sidebar should be collapsible on mobile.
2.  It needs to contain navigation buttons for different app views: "Chat Agent," "Quiz Generator," "Tools," "My Badges," "My Profile," and a "Staff Portal" link at the bottom.
3.  Add a section for selecting the "Agent Personality" with tooltips explaining each one.
4.  Add a scrollable section to display the user's `quizHistory`.
5.  Create all the necessary SVG icon components for the sidebar buttons (`ChatIcon`, `QuizIcon`, `ToolboxIcon`, `BadgeIcon`, `UserIcon`, `ShieldIcon`, `HistoryIcon`, `MaskIcon`, etc.) in the `components/icons` directory.
6.  Update `App.tsx` to include the `Sidebar` component and manage its open/close state for mobile view. The navigation buttons should update the `appView` state.

---

**Step 4: PDF Quiz Generator UI**

Build the user interface for the quiz generation feature.

1.  Create a `components/FileUpload.tsx` component. It should be a drag-and-drop area for uploading a PDF file, showing the selected file's name, and displaying validation errors. Use the `DocumentIcon`.
2.  Create a `components/QuizControls.tsx` component. This will contain dropdowns for "Difficulty" and "Question Types," a number input for the "Number of Questions," and a "Generate Quiz" button. The button should be disabled if no file is selected or if the app is loading. Use the `SparklesIcon`.
3.  In `App.tsx`, when `appView` is `'quiz-generator'`, render these two components.

---

**Step 5: PDF Processing and Quiz Generation Logic**

Now, let's wire up the backend logic for creating a quiz from a PDF.

1.  Create a `services/` directory. Inside, create `services/pdfService.ts`. This service will export an `extractTextFromPDF` function that uses the `pdfjsLib` loaded from the CDN to parse a `File` object and return its text content.
2.  Create `services/geminiService.ts`. This file will handle all interactions with the Gemini API.
    *   Implement a `generateQuiz` function. This function should take the PDF text, difficulty, number of questions, and question type preference as input.
    *   It must call the Gemini API (`gemini-2.5-flash`) with a detailed prompt and a strict JSON schema (`QUIZ_SCHEMA`) to ensure the response is a valid array of `Question` objects.
3.  In `App.tsx`, implement the `handleGenerateQuiz` function. This function will:
    *   Set the `appState` to `'loading'`.
    *   Call `extractTextFromPDF` from the PDF service.
    *   Call `generateQuiz` from the Gemini service with the extracted text.
    *   Set the returned quiz data into state and change `appState` to `'quiz'`.
    *   Handle any errors that occur during the process.
4.  Create a `components/Loader.tsx` component to display while `appState` is `'loading'` or `'evaluating'`.

---

**Step 6: Quiz Taking UI and Logic**

With a quiz generated, the user needs to be able to take it.

1.  Create a `components/Question.tsx` component. It should be able to render both multiple-choice (radio buttons) and short-answer (text input) questions based on the `questionType`. It should also include a button to request an AI-generated explanation for the answer.
2.  Create a `components/Timer.tsx` component that displays the elapsed time in a `MM:SS` format. It should be sticky at the top of the screen during the quiz.
3.  In `App.tsx`, when `appState` is `'quiz'`, render the quiz.
    *   First, show a "Start Timed Quiz" button. When clicked, start the timer.
    *   Once started, render the `Timer` and a list of `QuestionComponent`s.
    *   Manage the user's answers in the `userAnswers` state object.
    *   Add a "Submit Quiz" button at the end.

---

**Step 7: Quiz Submission, Evaluation, and Results**

Let's handle the grading and results display.

1.  In `services/geminiService.ts`, add two new functions:
    *   `getExplanation`: Takes a question and document context, and asks the Gemini API for a concise explanation of the correct answer.
    *   `evaluateShortAnswer`: This is a key feature. It takes a question and a user's short answer, and asks the Gemini API (using a JSON schema for a boolean response) to determine if the user's answer is *conceptually correct*, not just a string match.
2.  Create a `components/Results.tsx` component. It should display the final score, percentage, time taken, and a review of each question, showing the user's answer, the correct answer, and highlighting if they were correct or incorrect. It should also include a placeholder feature to "Mint Achievement NFT" for high scores and a button to "Create New Quiz."
3.  In `App.tsx`, implement the `handleSubmitQuiz` function. This function will:
    *   Stop the timer.
    *   Set `appState` to `'evaluating'`.
    *   For each short-answer question, call `evaluateShortAnswer`.
    *   Calculate the final score and create a new `QuizHistoryItem`.
    *   Update the `quizHistory` state.
    *   Set the `appState` to `'results'`.

---

**Step 8: Gamification System**

To boost engagement, we'll add a badge system.

1.  Create a `badges.ts` file. Define all badge types using the `BadgeId` enum. For each badge, specify its name, description, icon, and a `criteria` function that determines if the badge should be awarded based on the latest quiz and the user's history.
2.  Create the UI components in the `components/` directory:
    *   `Badges.tsx`: A view that displays all possible badges, showing which ones the user has earned.
    *   `BadgeCard.tsx`: A component for rendering a single badge, with a tooltip for its description.
    *   `BadgeNotification.tsx`: A toast-style notification that appears in the corner of the screen when a new badge is unlocked.
3.  In `App.tsx`'s `handleSubmitQuiz` function, after updating the history, call a `checkAndAwardBadges` function (from `badges.ts`). If new badges are earned, update the `earnedBadges` state and trigger the `BadgeNotification`.

---

**Step 9: Chat Agent Interface**

Let's build the conversational part of the app.

1.  Create a `components/ChatInterface.tsx` component.
    *   It should have a welcome screen with suggestion chips for new conversations.
    *   It should render a scrollable history of messages, with different styling for 'user' and 'model' roles.
    *   The input area should be a `textarea` with a send button and a microphone button for voice input.
    *   Implement basic Markdown rendering for the model's responses and parse out suggestion lists to render as clickable chips below the last message.
2.  Implement the voice input functionality using the Web Speech API (`SpeechRecognition`). Handle permissions, listening state, and errors gracefully.
3.  Add the `ChatInterface` to `App.tsx` to be rendered when `appView` is `'chat'`.

---

**Step 10: Chat Agent Logic and Tool Calling**

Now, let's make the chat agent intelligent.

1.  Create `personalities.ts` to store the system instruction prompts for different agent personalities ('Aether', 'Socrates', etc.).
2.  In `services/geminiService.ts`, define a `FunctionDeclaration` for a tool named `createQuizOnTopic`. This tool will take `topic`, `difficulty`, and `numQuestions` as parameters.
3.  Implement the `createQuizOnTopic` function. This function will first call the Gemini API with the `googleSearch` tool to gather context about the requested topic. Then, it will use that context to call the `generateQuiz` function we created earlier.
4.  In `App.tsx`, implement the `handleSendMessage` function.
    *   It will call the Gemini API's `generateContent` method.
    *   The prompt will include the chat history and a system instruction combining the selected agent personality with instructions on when to use the `createQuizOnTopic` tool.
    *   It must check the API response for `functionCalls`. If the `createQuizOnTopic` tool is called, execute the corresponding service function and transition the app to the `'quiz'` state.
    *   If it's a regular text response, simply add it to the chat history.

---

**Step 11: User Profile Page**

Create a page for users to see their progress.

1.  Create `components/Profile.tsx`. This component should display a user avatar, name (mock), email (mock), and key stats like "Quizzes Taken" and "Badges Earned."
2.  Below the summary, display a more detailed, scrollable list of their quiz history, showing the topic, date, score, and time for each quiz.
3.  Integrate this view into `App.tsx` under the `'profile'` view.

---

**Step 12: Tools Page**

Add a utility page for students.

1.  Create `components/Tools.tsx`. This component will serve as a container for different study tools.
2.  Inside `Tools.tsx`, create two sub-components:
    *   `ScientificCalculator`: A simple, functional calculator UI for students.
    *   `NotesApp`: A mini notes application with a list of notes and a text area for editing the active note. The notes should be persisted to localStorage.
3.  Integrate this view into `App.tsx` under the `'tools'` view.

---

**Step 13: Staff Portal (Authentication and Structure)**

Let's build the admin section.

1.  Create a `components/LoginModal.tsx`. It will be a simple modal with a form for a username and password (use hardcoded credentials like 'admin'/'password' for this prototype).
2.  In `App.tsx`, when the "Staff Portal" button in the sidebar is clicked, open this modal.
3.  Create the main container component `components/StaffView.tsx`. This will be the root component for the entire admin dashboard after a successful login. It should have its own header (with a logout button), a sidebar for staff-specific navigation, and a main content area.
4.  If the login is successful, `App.tsx` should render `StaffView` instead of the main user-facing layout.

---

**Step 14: Staff Portal (User Management)**

Build the first feature of the staff portal.

1.  Create `components/StaffSidebar.tsx` with navigation for 'Dashboard', 'User Management', 'Analytics', 'System Status', and 'Model Providers'.
2.  Create `components/StaffPortal.tsx`. This component will display a table of mock user data. It should include a search bar to filter users and an "Add User" button. Each row should have edit and delete buttons.
3.  Create `components/UserModal.tsx` for adding/editing users and `components/ConfirmModal.tsx` for confirming user deletion.
4.  Wire up the state and logic within `StaffPortal.tsx` to manage the mock user data and control the modals.

---

**Step 15: Staff Portal (Additional Views)**

Flesh out the other staff portal views with mock data to make it feel like a complete application.

1.  In `StaffView.tsx`, implement the logic to render different components based on the `StaffSidebar` selection.
2.  For the 'Analytics', 'System Status', and 'Dashboard' views, create static components that display charts and stats using mock data. You don't need a real charting library; you can use styled divs to represent bar charts.
3.  Create `components/ModelProviders.tsx`. This view will show a table of configured AI model providers (e.g., Google AI, Groq) and their API keys (masked by default). Include functionality to add/edit providers via a modal.
4.  Create all remaining icon components needed for these views.

---

**Step 16: Final Touches and Documentation**

Finally, let's add the last few pieces and the project documentation.

1.  Create `components/ReferencesWidget.tsx`. This is a small, slide-out widget that will appear on the right side of the screen to display source URLs when the AI uses Google Search grounding. For now, we'll just create the component and add a placeholder to `App.tsx`.
2.  Create a `README.md` file. It should provide a comprehensive overview of the project, its features, the technical stack, and instructions on how to run it. Include a detailed section on the badge system.
3.  Create a `PROPOSAL.md` file containing a detailed project proposal, including an abstract, problem statement, objectives, methodology, and timeline. This provides the academic and planning context for the application.

Execute these steps in order, and you will have successfully built the complete AetherLearn application.
