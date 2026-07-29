// 객체의 구조분해 할당 ----------------------
const user = {
  name: "김철수",
  age: 30,
  email: "kim@example.com",
  job: "개발자",
};

const { name, age, email, job } = user;
console.log(name, age, email, job);

const message = `
이름은 ${name}이고 나이는 ${age}입니다.
이메일 주소 : ${email}
직업:${job}`;
console.log(message);

//배열의 구조분해 할당---------------------
const colors = ["red", "green", "blue"];
const [color1, color2, color3] = colors;
console.log(color1, color2, color3);
