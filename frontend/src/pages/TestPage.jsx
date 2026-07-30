import React, { useState } from "react";

function TestPage() {
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  // hi ---------------------
  function handleClick(name) {
    alert("hi" + name);
  }

  return (
    <>
      <h1>TestPage</h1>
      <button
        className="bg-[#eee]"
        onClick={() => {
          handleClick("철수");
        }}
      >
        클릭하세요!
      </button>
      <div>
        <h3>========제어컴포넌트=======</h3>
        <div>
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-gray-100"
            value={name}
            onChange={(e) => {
              setName(e.target.value.toUpperCase());
            }}
          />
        </div>
        <br />
        <div>
          <label htmlFor="pwd">비밀번호:</label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            className="bg-gray-100"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
          {pwd.length}
        </div>
      </div>
    </>
  );
}

export default TestPage;
