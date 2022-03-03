let db;

const request = indexedDB.open('budget-tracker', 1);



window.addEventListener('online', uploadSpending); //listen to app, get back online