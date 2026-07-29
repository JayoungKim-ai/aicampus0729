const original = [1, 2, 3];
const copied = [...original];
copied[0] = 100;
console.log(copied);
console.log(original);

// 배열 합치기 --------------------------
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr = [...arr1, ...arr2, 7, 8, 9];
console.log(arr);

// 객체 복사
const original2 = { name: "홍길동", age: 25 };
const copied2 = { ...original2, phone: "010-123-4567", age: 26 };
console.log(copied2);
