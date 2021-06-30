import http from 'k6/http';
import { sleep } from 'k6';

/* var generateTests = function(testCount, lowerRange, upperRange) {
  let results = []
  for (var i = 0; i < testCount, i++) {

  }
} */

export let options = {
  stages: [
    /* { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage. */
    { duration: '2m', target: 100 },
    { duration: '2m', target: 200},
    { duration: '2m', target: 300},
  ],
};

export default function () {
  const BASE_URL = 'http://localhost:3000'; // make sure this is not production

  let responses = http.batch([
    [
      'GET',
      `${BASE_URL}/reviews/100`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/10000`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/1000000`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/5`,
      null,
    ],
    /* [
      'GET',
      `${BASE_URL}/reviews/meta/100`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/meta/10000`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/meta/1000000`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/meta/5`,
      null,
    ], */
  ]);

  sleep(1);
}

