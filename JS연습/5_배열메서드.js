const numbers = [1, 2, 3, 4, 5];

// 2를 곱한 새로운 배열 만들기
const doubled = numbers.map((num) => num * 2);

console.log(doubled);
/////////////////////////////////////////////
const users = [
  { id: 1, name: "철수", age: 25 },
  { id: 2, name: "영희", age: 30 },
  { id: 3, name: "민수", age: 28 },
];
const users_render = users.map((u) => `<p>${u.name},${u.age}</p>`);
console.log(users_render);

//<p>철수,25</p><p>영희,30</p><p>민수,28</p>
