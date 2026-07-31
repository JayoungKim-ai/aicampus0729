import React from "react";
import { useState, useEffect } from "react";

function HealthChk() {
  const [message, setMessage] = useState("접속중...");
  const [error, setError] = useState("");

  useEffect(() => {
    // 데이터 요청
    async function getData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/health");
        const data = await response.json();
        setMessage(data.status);
      } catch (error) {
        setMessage("서버연결실패" + error.message);
        setError(error.message);
      }
    }
    getData();
  }, []);

  return (
    <div>
      {message}
      {error}
    </div>
  );
}

export default HealthChk;
