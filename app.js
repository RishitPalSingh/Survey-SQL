const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

const pool = new Pool({
    user: 'postgres',
  host: 'localhost',
  database: 'Scrapper',
  password: 'Saisai@33',
  port: 5432,
});

const connect = async () => {
    const client = await pool.connect();
    
        client.release();

};

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/start', async (req, res) => {
    const { name, email } = req.body;
    try {
        const client = await pool.connect();

    
        let userResult = await client.query(`SELECT * FROM users WHERE email = ${email}`);
        let userId;

        if (userResult.rows.length > 0) {
    
            userId = userResult.rows[0].id;

            
            const responseResult = await client.query(`SELECT * FROM responses WHERE user_id = ${userId}`);
            if (responseResult.rows.length > 0) {
            
                const user = userResult.rows[0];
                res.render('completed', { alreadyCompleted: true, score: user.score });
                return;
            }

            
            const lastQuestionId = userResult.rows[0].last_question_id;
            if (lastQuestionId) {
                res.redirect(`/question/${lastQuestionId}?userId=${userId}`);
            } else {
                res.redirect(`/question/1?userId=${userId}`);
            }
        } else {
            
            userResult = await client.query(`INSERT INTO users (name, email) VALUES (${name}, ${email}) RETURNING id`);
            userId = userResult.rows[0].id;
            res.redirect(`/question/1?userId=${userId}`);
        }
    } catch (err) {
        console.error('Error starting survey:', err);
        res.status(500).send('Error starting survey');
    }
});



app.get('/question/:id', async (req, res) => {
    const userId = req.query.userId;
    const questionId = req.params.id;

    try {
        const questionResult = await pool.query(`SELECT * FROM questions WHERE id =${questionId}`);
        if (questionResult.rows.length === 0) {
        
            const userResult = await pool.query(`SELECT * FROM users WHERE id = $${userId}`);
            const user = userResult.rows[0];
            res.render('completed', { score: user.score });
            return;
        }

        const question = questionResult.rows[0];

        const optionsResult = await pool.query(`SELECT * FROM options WHERE question_id =${questionId}`);
        const options = optionsResult.rows;

        res.render('question', { question, options, userId });
    } catch (err) {
        console.error('Error fetching question:', err);
        res.status(500).send('Error fetching question');
    }
});

app.post('/answer', async (req, res) => {
    const { userId, questionId, optionId } = req.body;
    try {
        const client = await pool.connect();

        
        await client.query(`INSERT INTO responses (user_id, question_id, option_id) VALUES (${userId}, ${questionId}, ${optionId})`);


        await client.query(`UPDATE users SET last_question_id = ${questionId} WHERE id = ${userId}`);

        
        const optionScore = await client.query(`SELECT score FROM options WHERE id = ${optionId}`);
        const score = optionScore.rows[0].score;

        await client.query(`UPDATE users SET score = score + ${score} WHERE id = ${userId}`);

    
        const nextQuestionResult = await client.query(`SELECT next_question_id FROM options WHERE id = ${optionId}`);
        const nextQuestionId = nextQuestionResult.rows[0].next_question_id;

        if (nextQuestionId === 11) {
    
            const userResult = await client.query(`SELECT * FROM users WHERE id = ${userId}`);
            const user = userResult.rows[0];
            res.render('completed', { score: user.score });
        } else {
            
            res.redirect(`/question/${nextQuestionId}?userId=${userId}`);
        }
    } catch (err) {
        console.error('Error submitting answer:', err);
        res.status(500).send('Error submitting answer');
    }
});

connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

