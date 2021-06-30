const db = require('../db');
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;


app.use(morgan('dev'));
/* app.use(responseTime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:\.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
})) */

// k6
app.get('/reviews/:id', (req, res) => {
  ;(async function() {
    const client = await db.pool.connect();
    const returnObj = {
      "product": req.params.id,
      "page": 0,
      "count": 0,
      "results": [],
    }
    const query = `select array_agg(row_to_json(t))
    from (
      select *,
        (
          select array_to_json(array_agg(row_to_json(d)))
          from (
            select id, url
            from review_photos
            where review_id=review.id
          ) d
        ) as photos
      from review
      where product_id = '${req.params.id}'
    ) t`
    const reviewQuery = `SELECT * FROM review WHERE product_id='${req.params.id}'`;
    const test = await client.query(query);
    //console.log(photo.rows);
    // const resultsQuery = await client.query(reviewQuery);
    /* const results = resultsQuery.rows;
    for (var i = 0; i < results.length; i++) {
      let currentReviewId = results[i].id;
      //console.log(currentReviewId);
      const photoQuery = `SELECT id, url FROM review_photos WHERE review_id='${currentReviewId}'`
      const photo = await client.query(photoQuery);
      //console.log(photo);
      results[i].photos = photo.rows;


    }
    returnObj.results = results;
    /* if (results.rows[0].array_agg !== null) {
      returnObj.results = results.rows[0].array_agg;
      returnObj.count = results.rows[0].array_agg.length;
    }
    returnObj.count = results.length; */
    client.release();
    res.send(test.rows);
  })()
})

app.post('/reviews', (req, res) => {
  ;(async function() {
    console.log(req.body.params)
    const client = await db.pool.connect();

  })
})

app.get('/reviews/meta/:id', (req, res) => {
  ;(async function() {
    const client = await db.pool.connect();
    const returnObj = {
      "ratings": {},
      "recommended": {},
      "characteristics": {},
    }
    const query = `select row_to_json(t)
    from (
      select product_id,
        (
          select row_to_json(d)
          from
          (
            select sum(recommend::int) AS true, count(*) - sum(recommend::int) AS false
            from review
            where product_id='${req.params.id}'

          ) d

        ) as recommended,
        (
          select row_to_json(x)
          from
          (
            SELECT count(rating = 1 OR NULL) AS "1", count(rating = 2 OR NULL) AS "2", count(rating = 3 OR NULL) AS "3", count(rating = 4 OR NULL) AS "4", count(rating = 5 OR NULL) AS "5"
            FROM review
            WHERE product_id='${req.params.id}'
          ) x
        ) as rating
      from review
      where product_id = '${req.params.id}'
    ) t`

    const recommendQuery = `select sum(recommend::int) AS true, count(*) - sum(recommend::int) AS false
    from review
    where product_id='${req.params.id}'`
    const recommend = await client.query(recommendQuery);

    const ratingCountQuery = `SELECT count(rating = 1 OR NULL) AS "1", count(rating = 2 OR NULL) AS "2", count(rating = 3 OR NULL) AS "3", count(rating = 4 OR NULL) AS "4", count(rating = 5 OR NULL) AS "5"
    FROM review
    WHERE product_id='${req.params.id}'`
    const ratingCount = await client.query(ratingCountQuery);
    //console.log(recommend.rows);
    //console.log(ratingCount.rows);
    returnObj.recommended = recommend.rows[0];
    returnObj.ratings = ratingCount.rows[0];
    //console.log(returnObj);
   // const results = await client.query(query);
    const nameData = await client.query(`SELECT id, name FROM characteristics WHERE product_id='${req.params.id}'`)
    //console.log(nameData.rows);
    //console.log(results.rows)

    if (recommend.rows[0].length !== 0) {
      const reviewData = await client.query(`SELECT id FROM review WHERE product_id='${req.params.id}'`);
      //console.log(reviewData.rows);
      const characteristicsAvgTracker = new Array(nameData.rows.length).fill(0);
      //console.log(characteristicsId.rows);
      for (var i = 0; i < reviewData.rows.length; i++) {
        const reviewId = reviewData.rows[i].id;
        const valueData = await client.query(`SELECT value FROM characteristics_reviews WHERE review_id='${reviewId}'`)
        //console.log(valueData.rows);
        for (var j = 0; j < valueData.rows.length; j++) {
          const currentValue = valueData.rows[j].value;
          characteristicsAvgTracker[j] = characteristicsAvgTracker[j] + currentValue;
        }
      }

      for (var i = 0; i < characteristicsAvgTracker.length; i++) {
        characteristicsAvgTracker[i] = characteristicsAvgTracker[i]/reviewData.rows.length;
      }
      //console.log(characteristicsAvgTracker);
      //console.log(nameData.rows)
      for (var i = 0; i < nameData.rows.length; i++) {
        returnObj.characteristics[nameData.rows[i].name] = {
          "id": nameData.rows[i].id,
          "value": characteristicsAvgTracker[i]
        }
      }
      client.release();
      res.send(returnObj)
    } else {
      for (var i = 0; i < nameData.rows.length; i++) {
        ratingsObj.characteristics[nameData.rows[i].name] = {
          "id": nameData.rows[i].id,
          "value": null
        }
      }
      client.release();
      res.send(ratingsObj);
    }


    //returnObj.results = results.rows[0].array_agg;
    //returnObj.count = results.rows[0].array_agg.length;


  })()
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  ;(async function() {
    console.log(req.params.review_id);
    const client = await db.pool.connect();
    await client.query(`UPDATE review SET helpfulness=helpfulness + 1 WHERE id=${req.params.review_id}`);
    client.release();
    res.sendStatus(204);
  })()
})

app.put('/reviews/:review_id/report', (req, res) => {
  ;(async function() {
    const client = await db.pool.connect();
    await client.query(`UPDATE review SET reported=true WHERE id=${req.params.review_id}`)
    client.release();
    res.sendStatus(204);
  })()
})


app.get('/test/:id', (req, res) => {
  ;(async function() {
    const client = await db.pool.connect();
   /*  const query = `select row_to_json(t)
    from (
      select product_id,
        (
          select row_to_json(d)
          from
          (
            select sum(recommend::int) AS true, count(*) - sum(recommend::int) AS false
            from review
            where product_id='${req.params.id}'

          ) d

        ) as recommended,
        (
          select row_to_json(x)
          from
          (
            SELECT count(rating = 1 OR NULL) AS "1", count(rating = 2 OR NULL) AS "2", count(rating = 3 OR NULL) AS "3", count(rating = 4 OR NULL) AS "4", count(rating = 5 OR NULL) AS "5"
            FROM review
            WHERE product_id='${req.params.id}'
          ) x
        ) as rating
      from review
      where product_id = '${req.params.id}'
    ) t`
    const query2 = `select array_agg(row_to_json(t))
    from(
    WITH v1 AS (SELECT id FROM characteristics WHERE product_id='1')
    SELECT AVG(value) FROM characteristics_reviews, v1 WHERE characteristic_id = v1.id GROUP BY characteristic_id
    ) t` */
    /* const query3 = 'select id, url from review_photos where review_id=1';
    const query4 = 'select * from review where product_id=100'; */
    const query5 = `select array_agg(row_to_json(t))
    from (
      select *,
        (
          select array_to_json(array_agg(row_to_json(d)))
          from (
            select id, url
            from review_photos
            where review_id=review.id
          ) d
        ) as photos
      from review
      where product_id = ${req.params.id}
    ) t`
    /* const test = await client.query(query3);
    const test2 = await client.query(query4); */
    const test3 = await client.query(query5);
    client.release();
    res.send(test3.rows[0].array_agg);
  })()
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* db.poolQuery("SELECT * FROM review WHERE product_id='1'"); */

/* select id, count(rating)
from review
cross join json_array_elements(review) elem
where (elem->>'rating')::boolean AND product_id='4'
group by 1
order by 1; */

/* WITH v1 AS (SELECT id FROM characteristics WHERE product_id='1')
SELECT AVG(value) FROM characteristics_reviews, v1 WHERE characteristic_id = v1.id GROUP BY characteristic_id; */