// fetch는 즉시 Promise를 반환하고, 서버 응답을 기다리지 않는다
const promise = fetch("http://localhost:8000/healthchk");
console.log(promise); // Promise { <pending> }
