# Survey Application

Welcome to the Survey Application! This is a simple web-based survey system built using Express.js and PostgreSQL. It allows users to participate in surveys by answering a series of questions and provides them with a score upon completion.

## Features

- **User Registration**: Users can start a survey by providing their name and email.
- **Question Navigation**: Users are guided through a series of questions with options to select from.
- **Response Recording**: Each user's responses are recorded in the database.
- **Score Calculation**: Users' scores are calculated based on their responses to the survey questions.
- **Completion Status**: Users can view their scores and check if they have already completed the survey.

## Technologies Used

- **Node.js** with **Express.js**: for building the server-side application.
- **PostgreSQL**: for storing survey data and user responses.
- **EJS**: for rendering dynamic HTML templates.
- **Body-Parser**: for parsing incoming request bodies.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: version 14 or higher
- **PostgreSQL**: version 12 or higher

## Database Schema

The application uses PostgreSQL as its database system. Below is the schema of the database tables used in the application:

### `users` Table

- `id`: SERIAL primary key, unique identifier for each user.
- `name`: VARCHAR(100), stores the name of the user.
- `email`: VARCHAR(100), stores the email address of the user.
- `last_question_id`: INT, stores the ID of the last question the user answered.
- `score`: INT, stores the score of the user in the survey.

### `questions` Table

- `id`: SERIAL primary key, unique identifier for each question.
- `question_text`: TEXT, stores the text of the question.

### `options` Table

- `id`: SERIAL primary key, unique identifier for each option.
- `question_id`: INT, foreign key referencing the `id` column in the `questions` table.
- `option_text`: TEXT, stores the text of the option.
- `score`: INT, stores the score associated with selecting this option.
- `next_question_id`: INT, stores the ID of the next question to navigate to based on selecting this option.

### `responses` Table

- `id`: SERIAL primary key, unique identifier for each response.
- `user_id`: INT, foreign key referencing the `id` column in the `users` table.
- `question_id`: INT, foreign key referencing the `id` column in the `questions` table.
- `option_id`: INT, foreign key referencing the `id` column in the `options` table.

This schema allows the application to store user information, survey questions, available options for each question, and the responses provided by users during the survey.


## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/survey-app.git
    cd survey-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up the database:**

    - Create a PostgreSQL database named `Scrapper`.
    - Set up table for usage.

4. **Configure database connection:**

    Open the `app.js` file and modify the `pool` object to match your PostgreSQL database configuration:

    ```javascript
    const pool = new Pool({
        user: 'your-postgres-username',
        host: 'localhost',
        database: 'Scrapper',
        password: 'your-postgres-password',
        port: 5432,
    });
    ```

## Starting the Application

After completing the installation steps, you can start the application using the following command:

```bash
npm start
