# This is an optimal Task Manager Application for Keeping a track of your tasks.

## Tech Stack

1. React + Typescript
2. Tanstack Query for api call management
3. Firebase for storing data
4. Material UI
5. dnd-kit for Drag and Drop
6. tiptap edditor for Text Editor


## Project Features

1. It features an option to Signin/authenticate the users.
2. On the tasks page, there is a topbar with the name of the app and user info.
3. There are two tabs facilitating List and Board View interactivity(BoardView disabled for mobile screens).
4. There is an option to logout, add task.
5. The tasks can be dragged to change their orders or statuses.
6. There is an option to bulk delete/change statuses for multiple tasks.
7. There is an Activity log available while performing task updation.
8. Currently, I have integrated most of the features required for a task manager application along with the proper UI. The Add Attachement doesn't work for now as there is an issue with the firebase for the same. I have given the option to upload files on the UI however, they won't be saved in the database.


## Steps To Run This App

1. Run `npm i` command to install all the dependencies.
2. Update your .env file in the below format denoting firebase details

  VITE_API_KEY=
  VITE_AUTH_DOMAIN=
  VITE_PROJECT_ID=
  VITE_STORAGE_BUCKET=
  VITE_MESSAGING_SENDER_ID=
  VITE_APP_ID=
  VITE_MEASUREMENT_ID=
3. Run `npm run dev` to start the local server